defmodule ElixirusWeb.StudentLive.Timetable do
  require Logger
  alias Elixirus.Types.Period
  alias Elixirus.Types.Client
  use ElixirusWeb, :live_view
  import Venomous
  alias Venomous.SnakeArgs

  alias ElixirusWeb.Modal
  import ElixirusWeb.Helpers
  import Heroicons
  import Phoenix.HTML, only: [raw: 1]
  @asyncs [:load_schedule, :load_timetable]

  defp weekday_scroll_left() do
    case get_current_weekday() do
      n when n < 5 -> n * 300
      _ -> 0
    end
  end

  defp current_next_period_number(timetable) do
    case timetable |> Enum.at(get_current_weekday()) |> get_next_period() do
      [%Period{number: num} | _rest] ->
        num

      _ ->
        0
    end
  end

  defp exclude_empty_days(timetable) do
    timetable
    |> Enum.filter(fn weekday ->
      Enum.any?(weekday, fn period ->
        period.subject |> Kernel.!=("")
      end)
    end)
  end

  defp format_date(date) do
    date
    |> Date.to_iso8601()
    |> String.split("-")
    |> Enum.slice(0..1)
    |> Enum.join("-")
  end

  defp load_schedule(socket, date, :load), do: load_schedule(socket, date)

  defp load_schedule(socket, date, schedule) do
    schedules = socket.assigns.schedule
    assign(socket, :schedule, Map.put_new(schedules, date, schedule))
  end

  defp load_schedule(socket, month_year) do
    client = socket.assigns.client
    [year, month] = month_year |> String.split("-")

    start_async(socket, :load_schedule, fn ->
      {SnakeArgs.from_params(:elixirus, :schedule, [client, year, month])
       |> python!(), year, month}
    end)
  end

  defp fetch_schedule(socket, monday) do
    socket = assign(socket, :schedule, %{})
    user_id = socket.assigns.user_id

    [first, second] =
      [monday, Date.add(monday, 6)]
      |> Enum.map(&format_date/1)

    if first == second do
      schedule = handle_cache_data(user_id, "#{first}-schedule")
      load_schedule(socket, first, schedule)
    else
      [cache_first, cache_second] =
        [first, second] |> Enum.map(&handle_cache_data(user_id, "#{&1}-schedule"))

      socket
      |> load_schedule(first, cache_first)
      |> load_schedule(second, cache_second)
    end
  end

  defp get_events_inside_period(schedule, period) do
    get_events_inside_day(schedule, period.date)
    |> Enum.filter(&(&1 |> Map.get(:number) == period.number))
  end

  defp get_events_inside_day(schedule, [year, month, day]) do
    schedule
    |> Map.get(year <> month, [])
    |> Enum.at(String.to_integer(day), [])
  end

  defp get_events_inside_day(schedule, date),
    do: get_events_inside_day(schedule, String.split(date, "-"))

  defp event_inside_period?(schedule, %Period{date: date, number: number}) do
    case get_events_inside_day(schedule, date) do
      [] ->
        false

      events ->
        events |> Enum.any?(&(&1 |> Map.get(:number) |> Kernel.==(number)))
    end
  end

  defp load_calendar(socket, :load), do: socket

  defp load_calendar(socket, calendar_data),
    do: assign(socket, :calendar_events, calendar_data)

  defp load_calendar(socket, load, ""), do: load_calendar(socket, load)

  defp load_calendar(socket, :load, calendar_id) do
    monday = socket.assigns.current_monday

    start_async(socket, :load_calendar_data, fn ->
      fetch_calendar_data(
        calendar_id,
        monday |> to_string(),
        monday |> Date.add(7) |> to_string()
      )
    end)
  end

  defp load_calendar(socket, data, _calendar_id), do: load_calendar(socket, data)

  defp fetch_calendar_data(cal_id, date_from, date_to) do
    SnakeArgs.from_params(
      :calendar_handler,
      :get_google_calendar_events,
      [
        cal_id,
        date_from,
        date_to
      ]
    )
    |> python!()
  end

  defp load_timetable(socket, :load) do
    monday = socket.assigns.current_monday
    client = socket.assigns.client
    user_id = socket.assigns.user_id

    case Hammer.check_rate("timetable:#{user_id}", 60_000, 5) do
      {:allow, _count} ->
        socket
        |> assign(:loadings, [:timetable | socket.assigns.loadings])
        |> start_async(:load_timetable, fn ->
          SnakeArgs.from_params(:elixirus, :timetable, [client, monday |> to_string()])
          |> python!(python_timeout: 20_000)
        end)

      {:deny, _limit} ->
        socket |> put_flash(:error, "Rate limit exceeded!")
    end
  end

  defp load_timetable(socket, timetable) do
    socket
    |> assign(:timetable, exclude_empty_days(timetable))
  end

  def calculate_minute_difference(time_from_str, time_to_str)
      when is_nil(time_from_str) or is_nil(time_to_str),
      do: 0

  def calculate_minute_difference(time_from_str, time_to_str) do
    if to_string(time_from_str) == "undefined" or to_string(time_to_str) == "undefined" do
      0
    else
      [hours_from, minutes_from] =
        time_from_str
        |> String.split(":")
        |> Enum.map(&String.to_integer/1)

      [hours_to, minutes_to] =
        time_to_str
        |> String.split(":")
        |> Enum.map(&String.to_integer/1)

      total_minutes_from = hours_from * 60 + minutes_from
      total_minutes_to = hours_to * 60 + minutes_to
      total_minutes_to - total_minutes_from
    end
  end

  def handle_async(:load_schedule, {:ok, {schedule, year, month}}, socket) do
    user_id = socket.assigns.user_id

    socket =
      case match_basic_errors(socket, schedule, @asyncs) do
        {:ok, schedule} ->
          cache_and_ttl_data(user_id, "#{year}-#{month}-schedule", schedule, 15)

          assign(
            socket,
            :schedule,
            Map.put(socket.assigns.schedule, "#{year}-#{month}", schedule)
          )

        {:token_error, _message, socket} ->
          socket

        {:error, _message, socket} ->
          socket
      end

    {:noreply, socket}
  end

  def handle_async(:load_calendar_data, {:ok, events}, socket) do
    user_id = socket.assigns.user_id

    socket =
      case events do
        {:error, msg} ->
          Logger.error("calendar events: #{inspect(msg)}")
          put_flash(socket, :error, "Error in loading calendar")

        events ->
          cache_and_ttl_data(
            user_id,
            Date.to_iso8601(socket.assigns.current_monday) <> "-timetable_calendar",
            events
          )

          assign(socket, :calendar_events, events)
      end

    {:noreply, socket}
  end

  def handle_async(:load_timetable, {:ok, timetable}, socket) do
    user_id = socket.assigns.user_id

    socket =
      case match_basic_errors(socket, timetable, @asyncs) do
        {:ok, timetable} ->
          cache_and_ttl_data(
            user_id,
            Date.to_iso8601(socket.assigns.current_monday) <> "-timetable",
            timetable,
            30
          )

          socket
          |> assign(:timetable, exclude_empty_days(timetable))
          |> assign(:loadings, List.delete(socket.assigns.loadings, :timetable))

        {:token_error, _message, socket} ->
          socket

        {:error, _message, socket} ->
          socket
      end

    {:noreply, socket}
  end

  def handle_event("change_week", %{"days" => days}, socket) do
    current_monday =
      socket.assigns.current_monday
      |> Date.add(String.to_integer(days))

    user_id = socket.assigns.user_id
    calendar_id = socket.assigns.calendar_id

    timetable =
      handle_cache_data(
        user_id,
        Date.to_iso8601(current_monday) <> "-timetable"
      )

    calendar_data =
      handle_cache_data(
        user_id,
        Date.to_iso8601(current_monday) <> "-timetable_calendar"
      )

    socket =
      socket
      |> assign(:current_monday, current_monday)
      |> assign(:timetable, [])
      |> load_calendar(calendar_data, calendar_id)
      |> load_timetable(timetable)
      |> fetch_schedule(current_monday)

    {:noreply, socket}
  end

  def handle_event(
        "connect_calendar",
        %{"calendar_id" => calendar_id},
        socket
      ) do
    current_monday = socket.assigns.current_monday
    end_of_week = Date.add(current_monday, 7)

    socket =
      socket
      |> assign(:calendar_id, calendar_id)
      |> start_async(:load_calendar_data, fn ->
        fetch_calendar_data(
          calendar_id,
          current_monday |> to_string(),
          end_of_week |> to_string()
        )
      end)

    {:noreply, socket}
  end

  def handle_event("retrieve_local_storage", %{"calendar_id" => calendar_id}, socket) do
    socket =
      socket
      |> assign(:calendar_id, calendar_id)

    handle_event("connect_calendar", %{"calendar_id" => calendar_id}, socket)
  end

  def mount(
        _params,
        %{"semester" => semester, "token" => token, "user_id" => user_id},
        socket
      ) do
    %Client{} =
      client =
      socket
      |> handle_api_token(token)
      |> Client.get_client()

    # if its weekend, skip to next week
    beggining_of_the_week =
      case get_current_weekday() do
        n when n < 5 ->
          this_weeks_monday()

        _ ->
          warsaw_now() |> DateTime.add(4, :day) |> this_weeks_monday()
      end

    timetable = handle_cache_data(user_id, "#{beggining_of_the_week}-timetable")

    calendar_data =
      handle_cache_data(
        user_id,
        "#{beggining_of_the_week |> Date.to_iso8601()}-timetable_calendar"
      )

    socket =
      socket
      |> assign(:user_id, user_id)
      |> assign(:semester, semester)
      |> assign(:this_monday, beggining_of_the_week)
      |> assign(:current_monday, beggining_of_the_week)
      |> assign(:client, client)
      |> assign(:timetable, [])
      |> assign(:loadings, [])
      |> assign(:show_period_modal, false)
      |> assign(:calendar_events, %{})
      |> assign(:calendar_id, "")
      |> assign(:page_title, "Timetable")
      |> fetch_schedule(beggining_of_the_week)
      |> load_calendar(calendar_data)
      |> load_timetable(timetable)

    {:ok, socket}
  end

  defp weekday_modal(assigns) do
    calendar_events = assigns[:calendar_events] || []
    weekday = assigns[:weekday]
    schedule = assigns[:schedule] || %{}
    
    schedule_events = 
      case weekday do
        %{date: date} when is_binary(date) -> schedule |> get_events_inside_day(date)
        _ -> []
      end
    
    weekday_name = 
      case weekday do
        %{weekday: name} when is_binary(name) -> name
        %{weekday: name} -> name
        _ -> "Unknown"
      end
    
    weekday_date = 
      case weekday do
        %{date: date} when is_binary(date) -> date
        %{date: date} -> date
        _ -> nil
      end
    
    ~H"""
    <.live_component module={Modal} id={"#{weekday_name}-googlecalendar"}>
      <div class="weekday-events-modal-content">
        <!-- Header -->
        <div class="weekday-events-header">
          <div class="weekday-events-header-title">
            <Heroicons.calendar class="w-6 h-6" />
            <h2 class="weekday-events-title">
              <%= weekday_name %> Events
            </h2>
          </div>
          <span class="weekday-events-date">
            <%= if weekday_date do
              date_to_shorthand(weekday_date)
            else
              ""
            end %>
          </span>
        </div>

        <!-- Schedule Events -->
        <div
          :if={schedule_events != []}
          class="weekday-events-section"
        >
          <div class="weekday-events-section-title">
            <Heroicons.academic_cap class="w-5 h-5" />
            <span>Schedule Events</span>
          </div>
          <div class="weekday-events-list">
            <div
              :for={event <- schedule_events}
              class="weekday-event-card weekday-event-schedule"
            >
              <div class="weekday-event-header">
                <span class="weekday-event-title">
                  <%= event.title %>
                </span>
                <span
                  :if={event.subject != event.title}
                  class="weekday-event-subject"
                >
                  <%= event.subject %>
                </span>
              </div>
              <div class="weekday-event-details">
                <div
                  :for={
                    {key, value} <-
                      event
                      |> Map.get(:data, %{})
                      |> Map.to_list()
                      |> Enum.reverse()
                  }
                  :if={value != "unknown"}
                  class="weekday-event-detail-row"
                >
                  <span class="weekday-event-detail-label"><%= key %>:</span>
                  <span class="weekday-event-detail-value"><%= value %></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Google Calendar Events -->
        <div
          :if={calendar_events != [] && calendar_events != nil}
          class="weekday-events-section"
        >
          <div class="weekday-events-section-title">
            <Heroicons.calendar class="w-5 h-5" />
            <span>Google Calendar</span>
          </div>
          <div class="weekday-events-list">
            <div
              :for={event <- calendar_events}
              class="weekday-event-card weekday-event-google"
            >
              <div class="weekday-event-header">
                <span class="weekday-event-title">
                  <%= event["summary"] || event[:summary] || "Untitled Event" %>
                </span>
              </div>
              <div
                :if={(event["description"] || event[:description] || "") != ""}
                class="weekday-event-description"
              >
                <%= (event["description"] || event[:description] || "") |> HtmlSanitizeEx.html5() |> raw %>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          :if={schedule_events == [] && (calendar_events == [] || calendar_events == nil)}
          class="weekday-events-empty"
        >
          <Heroicons.calendar_days class="w-12 h-12" />
          <p class="weekday-events-empty-text">No events for this day</p>
        </div>

        <!-- Close Button -->
        <button
          class="weekday-events-close-button"
          phx-click={Modal.hide_modal("#{weekday_name}-googlecalendar")}
        >
          <Heroicons.x_mark class="w-5 h-5" />
          <span>Close</span>
        </button>
      </div>
    </.live_component>
    """
  end

  defp weekday(assigns) do
    ~H"""
    <div class="weekday-header weekday-header-static">
      <span class="weekday-name"><%= @weekday.weekday %></span>
      <span class="weekday-date"><%= date_to_shorthand(@weekday.date) %></span>
    </div>
    """
  end

  defp weekday_button(assigns) do
    ~H"""
    <button
      phx-click={ElixirusWeb.Modal.show_modal_js("#{@weekday.weekday}-googlecalendar")}
      phx-target={"##{@weekday.weekday}-googlecalendar"}
      class="weekday-header weekday-header-button"
    >
      <div class="weekday-header-content">
        <span class="weekday-name"><%= @weekday.weekday %></span>
        <span class="weekday-date"><%= date_to_shorthand(@weekday.date) %></span>
      </div>
      <!-- Glow effect indicator for events -->
      <div class="weekday-event-indicator">
        <div class="weekday-event-glow"></div>
        <div class="weekday-event-dot"></div>
      </div>
    </button>
    """
  end

  defp period_modal(assigns) do
    ~H"""
    <.live_component
      :if={@period.subject != ""}
      module={Modal}
      id={"#{@period.weekday}-#{@period.number}"}
    >
      <div class="modal-period-content">
        <!-- Header Section -->
        <div class="modal-header-section">
          <div class="flex items-center gap-3 mb-2">
            <div class="modal-day-badge">
              <%= @period.weekday %>
            </div>
            <div class="modal-lesson-badge">
              Lesson <%= @period.number %>
            </div>
          </div>
          <h2 class="modal-subject-title">
            <%= @period.subject %>
          </h2>
        </div>

        <!-- Status Badges (if any) -->
        <div
          :if={@period.info != %{}}
          class="modal-status-section"
        >
          <div
            :for={
              {title, info} <-
                @period.info
                |> Map.to_list()
            }
            class={"modal-status-badge modal-status-#{lesson_info_color(%{title => ""})}"}
          >
            <span class="modal-status-icon"></span>
            <span class="modal-status-text">
              <%= title %>
            </span>
            <div :if={is_map(info)} class="modal-status-details">
              <span :for={{_, val} <- info} class="modal-status-detail-item">
                <%= val %>
              </span>
            </div>
          </div>
        </div>

        <!-- Events Section -->
        <div
          :if={
            events =
              get_events_inside_period(@schedule, @period)
            events != []
          }
          class="modal-events-section"
        >
          <div class="modal-section-title">
            <Heroicons.calendar class="w-5 h-5" />
            <span>Events</span>
          </div>
          <div
            :for={event <- events}
            class="modal-event-card"
          >
            <div class="modal-event-header">
              <span class="modal-event-title">
                <%= event.title %>
              </span>
              <span
                :if={event.subject != event.title}
                class="modal-event-subject"
              >
                <%= event.subject %>
              </span>
            </div>
            <div class="modal-event-details">
              <span
                :for={
                  item <-
                    event
                    |> Map.get(:data)
                    |> Map.values()
                    |> Enum.reverse()
                }
                :if={item != "unknown"}
                class="modal-event-detail"
              >
                <%= item %>
              </span>
            </div>
          </div>
        </div>

        <!-- Details Section -->
        <div class="modal-details-section">
          <div class="modal-detail-grid">
            <div class="modal-detail-item">
              <div class="modal-detail-label">
                <Heroicons.user class="w-4 h-4" />
                <span>Teacher & Room</span>
              </div>
              <div class="modal-detail-value">
                <%= @period.teacher_and_classroom %>
              </div>
            </div>

            <div class="modal-detail-item">
              <div class="modal-detail-label">
                <Heroicons.calendar_days class="w-4 h-4" />
                <span>Date</span>
              </div>
              <div class="modal-detail-value">
                <%= @period.date %>
              </div>
            </div>
          </div>
        </div>

        <!-- Close Button -->
        <button
          class="modal-close-button"
          phx-click={Modal.hide_modal("#{@period.weekday}-#{@period.number}")}
        >
          <Heroicons.x_mark class="w-5 h-5" />
          <span>Close</span>
        </button>
      </div>
    </.live_component>
    """
  end

  defp lesson_info_color(%{"odwołane" => _val}), do: "red-700"
  defp lesson_info_color(%{"dzień wolny szkoły" => _val}), do: "lime-400"
  defp lesson_info_color(%{"przesunięcie" => _val}), do: "blue-400"
  defp lesson_info_color(%{}), do: "fuchsia-600"

  defp period(assigns) do
    ~H"""
    <div class="h-[90px] w-full">
      <div :if={@period.subject == ""} class="h-full w-full invisible pointer-events-none"></div>
      <button
        :if={@period.subject != ""}
        phx-click={ElixirusWeb.Modal.show_modal_js("#{@period.weekday}-#{@period.number}")}
        phx-target={"##{@period.weekday}-#{@period.number}"}
        class="
          h-full w-full flex flex-col text-left justify-between py-2 px-3 xs:py-2.5 xs:px-4
          rounded-lg glass-card backdrop-blur-xl relative border
          transition-all duration-200 ease-out
          hover:brightness-110 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20 period-button-hover
          border-purple-500/20
        "
      >
        <!-- Status badge overlay (centered) -->
        <div 
          :if={@period.info != %{}}
          class={"period-status-overlay period-status-#{lesson_info_color(@period.info)}"}
        >
          <div class="period-status-overlay-content">
            <span class="period-status-icon"></span>
            <span class="period-status-text">
              <%= @period.info |> Map.keys() |> List.first() %>
            </span>
          </div>
        </div>
        
        <!-- Subject name -->
        <div class="flex-grow flex items-start">
          <span class="line-clamp-2 text-sm xs:text-base font-medium text-purple-100 leading-tight">
            <%= @period.subject %>
          </span>
        </div>
        
        <!-- Teacher/Classroom -->
        <div class="flex-shrink-0 mt-1">
          <span class="text-[10px] xs:text-xs text-purple-300/60 truncate block">
            <%= @period.teacher_and_classroom
            |> String.split("s.")
            |> List.last() %>
          </span>
        </div>
      </button>
    </div>
    """
  end
end
