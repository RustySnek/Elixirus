defmodule ElixirusWeb.StudentLive.Timetable do
  require Logger
  alias Elixirus.Types.Period
  alias Elixirus.Types.Client
  use ElixirusWeb, :live_view
  import Venomous
  alias Venomous.SnakeArgs

  alias ElixirusWeb.Modal
  import ElixirusWeb.Helpers

  import Heroicons, only: [information_circle: 1]
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
    ~H"""
    <.live_component module={Modal} id={"#{@weekday.weekday}-googlecalendar"}>
      <div class="gap-y-2 flex flex-col items-center md:max-w-3xl max-w-xs xs:max-w-[250px]">
        <div
          :for={
            event <-
              @schedule
              |> get_events_inside_day(@weekday.date)
          }
          class="bg-[#1E1E1E] rounded-2xl px-4 py-2 md:max-w-3xl max-w-xs xs:max-w-[250px]"
        >
          <div class="flex flex-col text-center space-y-2 mb-3">
            <span class="text-lg text-center text-fuchsia-700 font-bold">
              <%= event.title %>
            </span>
            <span class="text-lg text-fuchsia-400 font-bold font-italic break-words">
              <%= event.subject %>
            </span>
          </div>
          <div class="flex flex-col text-center">
            <span
              :for={
                item <-
                  event
                  |> Map.get(:data)
                  |> Map.values()
                  |> Enum.reverse()
              }
              :if={item != "unknown"}
            >
              <%= item %>
            </span>
          </div>
        </div>
        <div
          :for={
            event <-
              @calendar_events
          }
          class="bg-[#1E1E1E] rounded-2xl px-4 py-2"
        >
          <span class="mb-2 text-lg font-bold">
            <%= event["summary"] %>
          </span>
          <br />
          <span><%= event["description"] |> HtmlSanitizeEx.html5() |> raw %></span>
        </div>
      </div>
    </.live_component>
    """
  end

  defp weekday(assigns) do
    ~H"""
    <div class="
      text-center h-12 shadow rounded-lg w-full 
      font-semibold flex items-center justify-center 
      md:text-lg bg-card
    ">
      <%= @weekday.weekday %>, <%= date_to_shorthand(@weekday.date) %>
    </div>
    """
  end

  defp weekday_button(assigns) do
    ~H"""
    <button
      phx-click={ElixirusWeb.Modal.show_modal_js("#{@weekday.weekday}-googlecalendar")}
      phx-target={"##{@weekday.weekday}-googlecalendar"}
      class="
      text-center h-12 shadow rounded-lg w-full 
      font-semibold items-center justify-center
      md:text-lg bg-card relative flex
    "
    >
      <%= @weekday.weekday %>, <%= date_to_shorthand(@weekday.date) %>
      <.information_circle
        outline
        class="absolute right-2 top-1/2 -translate-y-1/2 text-red-800 w-6 md:w-7"
      />
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
      <div class="bg-card mx-5 max-w-md min-w-[300px] md:min-w-[450px] xs:max-w-[250px] overflow-y-auto rounded-lg absolute z-40">
        <div
          :for={
            event <-
              get_events_inside_period(@schedule, @period)
          }
          class="bg-card rounded-2xl px-4 py-2"
        >
          <div class="flex flex-col space-y-2 mb-3">
            <span class="text-lg text-fuchsia-700 font-bold">
              <%= event.title %>
            </span>
            <span
              :if={
                event.subject !=
                  event.title
              }
              class="text-fuchsia-400 font-bold font-italic text-lg"
            >
              <%= event.subject %>
            </span>
          </div>
          <div class="flex flex-col">
            <span
              :for={
                item <-
                  event
                  |> Map.get(:data)
                  |> Map.values()
                  |> Enum.reverse()
              }
              :if={item != "unknown"}
            >
              <%= item %>
            </span>
          </div>
        </div>

        <div class="p-4 flex flex-col justify-center gap-y-1">
          <div
            :for={
              {title, info} <-
                @period.info
                |> Map.to_list()
            }
            class={"flex flex-col text-#{lesson_info_color(%{title => ""})} font-bold pb-2"}
          >
            <span>
              <%= title %>
            </span>
            <div :if={is_map(info)} class="text-gray-500 font-normal flex flex-col">
              <span :for={{_, val} <- info}><%= val %></span>
            </div>
          </div>

          <span class="break-words max-w-xl lg:text-lg font-bold mb-1">
            <%= @period.subject %>
          </span>
          <span class="text-base lg:text-lg">
            <%= @period.weekday %>
          </span>

          <span class="text-gray-400">
            Lesson: <%= @period.number %>
          </span>
          <span class="text-gray-400">
            <%= @period.teacher_and_classroom %>
          </span>
          <span class="text-gray-400">
            <%= @period.date %>
          </span>
        </div>
        <button
          class="bg-gray-600 h-8 hover:brightness-125 transition rounded-b-lg rounded-x-lg w-full"
          phx-click={Modal.hide_modal("#{@period.weekday}-#{@period.number}")}
        >
          Close
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
    <button
      disabled={@period.subject == ""}
      phx-click={ElixirusWeb.Modal.show_modal_js("#{@period.weekday}-#{@period.number}")}
      phx-target={"##{@period.weekday}-#{@period.number}"}
      class={"
        hover:brightness-125 transition h-[90px] w-full flex flex-col text-left justify-between py-1 px-4
        duration-100 rounded-lg shadow bg-card relative
        #{ @period.subject == "" &&"!shadow-none !bg-inherit"}
        "}
    >
      <span class={"flex-shrink absolute opacity-50 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-center font-bold text-#{lesson_info_color(@period.info)}"}>
        <%= @period.info |> Map.keys() |> Enum.join(", ") %>
      </span>
      <div class="flex-grow z-10">
        <span class="line-clamp-1">
          <%= @period.subject %>
        </span>
      </div>
      <span class="text-sm text-gray-500 ">
        <%= @period.teacher_and_classroom
        |> String.split("s.")
        |> List.last() %>
      </span>
    </button>
    """
  end
end
