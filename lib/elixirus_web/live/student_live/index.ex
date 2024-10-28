defmodule ElixirusWeb.StudentLive.Index do
  require Logger
  alias Elixirus.Types.Message
  alias Elixirus.Types.Event
  alias Venomous.SnakeArgs
  use ElixirusWeb, :live_view
  alias Elixirus.Types.Client
  import ElixirusWeb.Helpers

  @asyncs [
    :load_announcements,
    :load_new_grades,
    :load_final_avg,
    :load_frequency,
    :load_student_info,
    :load_messages,
    :load_averages,
    :load_timetable,
    :load_attendance,
    :load_schedule
  ]

  defp year_average(grades) do
    avgs =
      grades
      |> Enum.map(fn semester ->
        semester |> Map.values() |> Enum.map(&count_average(&1))
      end)
      |> List.flatten()

    case length(avgs |> Enum.filter(&Kernel.!=(&1, 0))) do
      0 ->
        0.0

      len ->
        avgs
        |> Enum.reduce(0, fn avg, acc -> acc + avg end)
        |> Kernel./(len)
    end
  end

  def handle_event("retrieve_local_storage", %{"discards" => discards}, socket)
      when is_map(discards) do
    {:noreply, assign(socket, :discards, discards)}
  end

  def handle_event("retrieve_local_storage", %{"discards" => _discards}, socket) do
    {:noreply, assign(socket, :discards, %{})}
  end

  def handle_async(task, {:ok, {:killed, _reason}}, socket) when task in @asyncs do
    {:noreply, socket}
  end

  def handle_async(:load_calendar, {:ok, calendar}, socket) do
    calendar = calendar |> Map.values() |> List.flatten()
    user_id = socket.assigns.user_id
    cache_and_ttl_data(user_id, "today_calendar", calendar)

    {:noreply, assign(socket, :calendar_events, calendar)}
  end

  def handle_async(:load_schedule, {:ok, {schedule, year, month}}, socket) do
    socket =
      case match_basic_errors(socket, schedule, @asyncs) do
        {:ok, schedule} ->
          user_id = socket.assigns.user_id
          cache_and_ttl_data(user_id, "#{year}-#{month}-schedule-nonempty", schedule)

          socket
          |> assign(:schedule, schedule)
          |> assign(:loadings, List.delete(socket.assigns.loadings, :schedule))

        {_err, _msg, socket} ->
          socket
      end

    {:noreply, socket}
  end

  def handle_async(:load_final_avg, {:ok, grades}, socket) do
    socket =
      case match_basic_errors(socket, grades, @asyncs) do
        {:ok, {[first, second] = grades, gpas, _descriptive}} ->
          user_id = socket.assigns.user_id
          final = year_average(grades)
          cache_and_ttl_data(user_id, "0-grades", first)
          cache_and_ttl_data(user_id, "1-grades", second)
          cache_and_ttl_data(user_id, "averages", gpas)
          cache_and_ttl_data(user_id, "final_average", final)

          socket
          |> assign(:final_avg, final)
          |> assign(:averages, gpas)
          |> assign(:loadings, List.delete(socket.assigns.loadings, :final_avg))

        {_err, _msg, socket} ->
          socket
      end

    {:noreply, socket}
  end

  def handle_async(:load_messages, {:ok, messages}, socket) do
    socket =
      case match_basic_errors(socket, messages, @asyncs) do
        {:ok, messages} ->
          user_id = socket.assigns.user_id

          {unread, read} =
            Enum.split_with(messages, fn %Message{unread: unread} -> unread == true end)

          cache_and_ttl_data(user_id, "messages", messages, 15)
          cache_and_ttl_data(user_id, "unread_messages", unread, 15)
          cache_and_ttl_data(user_id, "seen_messages", read, 15)

          socket
          |> assign(:messages, unread)
          |> assign(:loadings, List.delete(socket.assigns.loadings, :messages))

        {_err, _msg, socket} ->
          socket
      end

    {:noreply, socket}
  end

  def handle_async(:load_averages, {:ok, averages}, socket) do
    socket =
      case match_basic_errors(socket, averages, @asyncs) do
        {:ok, _averages} ->
          socket

        {:error, _err} ->
          socket

        {_err, _msg, socket} ->
          socket
      end

    {:noreply, socket}
  end

  def handle_async(:load_timetable, {:ok, timetable}, socket) do
    socket =
      case match_basic_errors(socket, timetable, @asyncs) do
        {:ok, timetable} ->
          user_id = socket.assigns.user_id

          cache_and_ttl_data(user_id, "timetable", timetable)

          socket
          |> assign(:timetable, timetable)
          |> assign(:loadings, List.delete(socket.assigns.loadings, :timetable))

        {_err, _msg, socket} ->
          socket
      end

    {:noreply, socket}
  end

  def handle_async(:load_attendance, {:ok, attendance}, socket) do
    socket =
      case match_basic_errors(socket, attendance, @asyncs) do
        {:ok, attendance} ->
          user_id = socket.assigns.user_id
          attendance = List.flatten(attendance)

          cache_and_ttl_data(user_id, "last_attendance", attendance, 10)

          socket
          |> assign(:loadings, List.delete(socket.assigns.loadings, :attendance))
          |> assign(:attendance, attendance)

        {_err, _msg, socket} ->
          socket
      end

    {:noreply, socket}
  end

  def handle_async(:load_student_info, {:ok, student_info}, socket) do
    socket =
      case match_basic_errors(socket, student_info, @asyncs) do
        {:ok, student_info} ->
          user_id = socket.assigns.user_id
          cache_and_ttl_data(user_id, "student_info", student_info, 30)

          socket
          |> assign(:student_info, student_info)
          |> assign(:loadings, List.delete(socket.assigns.loadings, :student_info))

        {_err, _msg, socket} ->
          socket
      end

    {:noreply, socket}
  end

  def handle_async(:load_new_grades, {:ok, grades}, socket) do
    socket =
      case match_basic_errors(socket, grades, @asyncs) do
        {:ok, grades} ->
          user_id = socket.assigns.user_id
          new_grades = grades |> Map.values() |> List.flatten()
          cache_and_ttl_data(user_id, "new_grades", new_grades)

          socket
          |> assign(:grades, new_grades)
          |> assign(:loadings, List.delete(socket.assigns.loadings, :grades))

        {_err, _msg, socket} ->
          socket
      end

    {:noreply, socket}
  end

  def handle_async(:load_frequency, {:ok, freq}, socket) do
    socket =
      case match_basic_errors(socket, freq, @asyncs) do
        {:ok, frequency} ->
          user_id = socket.assigns.user_id

          frequency =
            frequency
            |> Tuple.to_list()
            |> Enum.map(
              &((&1 * 1000)
                |> round()
                |> Kernel./(10))
            )

          cache_and_ttl_data(user_id, "frequency", frequency, 15)

          socket
          |> assign(:final_frequency, frequency |> Enum.at(2))
          |> assign(:loadings, List.delete(socket.assigns.loadings, :frequency))

        {_err, _msg, socket} ->
          socket
      end

    {:noreply, socket}
  end

  def handle_async(:load_announcements, {:ok, announcements}, socket) do
    socket =
      case match_basic_errors(socket, announcements, @asyncs) do
        {:ok, announcements} ->
          user_id = socket.assigns.user_id
          cache_and_ttl_data(user_id, "announcements", announcements, 20)

          socket
          |> assign(:announcements, announcements)
          |> assign(:loadings, List.delete(socket.assigns.loadings, :frequency))

        {_err, _msg, socket} ->
          socket
      end

    {:noreply, socket}
  end

  defp setup(socket) do
    socket
    |> assign(:final_avg, 0.0)
    |> assign(:final_frequency, 100.0)
    |> assign(:student_info, nil)
    |> assign(:timetable, nil)
    |> assign(:schedule, nil)
    |> assign(:attendance, [])
    |> assign(:announcements, [])
    |> assign(:grades, [])
    |> assign(:messages, [])
    |> assign(:discards, nil)
  end

  def mount(_params, %{"token" => token}, socket) when map_size(token) == 0 do
    {:ok, setup(socket) |> assign(:page_title, "Login") |> push_event("require-login", %{})}
  end

  def mount(
        _params,
        %{"token" => token, "user_id" => user_id, "semester" => semester} = session,
        socket
      ) do
    %Client{} =
      client =
      socket
      |> handle_api_token(token)
      |> Client.get_client()

    {{year, month, day}, _} = :calendar.local_time()
    announcements = handle_cache_data(user_id, "announcements")
    frequency = handle_cache_data(user_id, "frequency")
    new_grades = handle_cache_data(user_id, "new_grades")
    final_avg = handle_cache_data(user_id, "final_average")
    student_info = handle_cache_data(user_id, "student_info")
    unread_messages = handle_cache_data(user_id, "unread_messages")
    attendance = handle_cache_data(user_id, "last_attendance")
    timetable = handle_cache_data(user_id, "timetable")
    calendar_data = handle_cache_data(user_id, "today_calendar")

    schedule =
      handle_cache_data(
        user_id,
        "#{year}-#{month}-schedule-nonempty"
      )

    semester =
      case semester |> Integer.parse() do
        :error -> 0
        {semester, _} -> semester
      end

    socket =
      case calendar_data do
        :load ->
          if calendar_id = session["calendar_id"] do
            start_async(socket, :load_calendar, fn ->
              SnakeArgs.from_params(:calendar_handler, :get_google_calendar_events, [
                calendar_id,
                "#{year}-#{month}-#{day}",
                "#{year}-#{month}-#{day + 12}"
              ])
              |> Venomous.python!()
            end)
          else
            socket
          end

        data ->
          assign(socket, :calendar_events, data)
      end

    socket =
      socket
      |> setup()
      |> assign(:semester, semester)
      |> assign(:day, day)
      |> assign(:month, month)
      |> assign(:year, year)
      |> assign(:page_title, "Home")
      |> assign(:loadings, [])
      |> assign(:user_id, user_id)
      |> create_fetcher(user_id, announcements, :announcements, fn ->
        SnakeArgs.from_params(:elixirus, :announcements, [client]) |> Venomous.python!()
      end)
      |> create_fetcher(user_id, new_grades, :new_grades, fn ->
        SnakeArgs.from_params(:elixirus, :new_grades, [client, semester])
        |> Venomous.python!()
      end)
      |> create_fetcher(user_id, final_avg, :final_avg, fn ->
        SnakeArgs.from_params(:elixirus, :grades, [client]) |> Venomous.python!()
      end)
      |> create_fetcher(user_id, frequency, :frequency, fn ->
        SnakeArgs.from_params(:elixirus, :frequency, [client])
        |> Venomous.python!()
      end)
      |> create_fetcher(user_id, student_info, :student_info, fn ->
        SnakeArgs.from_params(:elixirus, :student_info, [client])
        |> Venomous.python!()
      end)
      |> create_fetcher(user_id, unread_messages, :messages, fn ->
        SnakeArgs.from_params(:elixirus, :received, [client])
        |> Venomous.python!()
      end)
      |> create_fetcher(user_id, attendance, :attendance, fn ->
        SnakeArgs.from_params(:elixirus, :attendance, [client, false, "last_login"])
        |> Venomous.python!()
      end)
      |> create_fetcher(user_id, schedule, :schedule, fn ->
        {SnakeArgs.from_params(:elixirus, :schedule, [client, year, month])
         |> Venomous.python!(), year, month}
      end)
      |> create_fetcher(user_id, timetable, :timetable, fn ->
        SnakeArgs.from_params(:elixirus, :timetable, [
          client,
          this_weeks_monday() |> to_string
        ])
        |> Venomous.python!()
      end)

    socket =
      case frequency do
        [_, _, final] ->
          assign(socket, :final_frequency, final)

        _ ->
          socket
      end

    {:ok, socket}
  end

  defp announcement(assigns) do
    ~H"""
    <div
      phx-discard-type="announcement"
      phx-hook="swipe_discard"
      id={@announcement.title <> @announcement.date}
      class="flex-col flex justify-between bg-card rounded-md px-2 py-1 relative"
    >
      <span class="select-none absolute opacity-10 inset-0 flex items-center justify-center font-bold text-xl">
        Announcement
      </span>
      <h3 class="text-sm"><%= @announcement.title %></h3>
      <article
        id={"#{@idx}announcement-wrapper"}
        phx-hook="new_page_link"
        class="lg:text-lg text-sm announcement_link z-10"
      >
        <%= @announcement.description
        |> Earmark.as_html!()
        |> HtmlSanitizeEx.html5()
        |> Phoenix.HTML.raw() %>
      </article>
      <div class="flex flex-col flex-wrap mt-1">
        <span class="text-sm xs:text-xs self-end"><%= @announcement.author %></span>
        <span class="text-sm xs:text-xs self-end"><%= @announcement.date %></span>
      </div>
    </div>
    """
  end

  defp unread_message(assigns) do
    ~H"""
    <.link
      navigate={~p"/student/messages/#{@message.href}"}
      phx-discard-type="message"
      phx-hook="swipe_discard"
      id={@message.href}
      class="flex-col flex justify-between bg-card rounded-md px-2 py-1 relative"
    >
      <span class="select-none absolute opacity-10 inset-0 flex items-center justify-center font-bold text-xl">
        Message
      </span>

      <h3 class="text-sm"><%= @message.title %></h3>
      <div class="flex flex-col flex-wrap mt-1">
        <span class="text-sm xs:text-xs self-end"><%= @message.author %></span>
        <span class="text-sm xs:text-xs self-end"><%= @message.date %></span>
      </div>
    </.link>
    """
  end

  defp attendance(assigns) do
    ~H"""
    <.link
      navigate={~p"/student/attendance?href=#{@attendance.href}"}
      phx-discard-type="attendance"
      phx-hook="swipe_discard"
      id={@attendance.href}
      class="flex-row flex justify-between bg-card rounded-md px-2 py-1"
    >
      <div>
        <h3 class="w-8"><%= @attendance.symbol %></h3>
        <span class="xs:text-xs text-sm w-8">
          <%= @attendance.period %>. <%= @attendance.subject %>
        </span>
      </div>
      <div class="flex flex-col flex-wrap mt-1 self-end">
        <span class="text-sm xs:text-xs self-end"><%= @attendance.teacher %></span>
        <span class="text-sm xs:text-xs self-end"><%= @attendance.date %></span>
      </div>
    </.link>
    """
  end

  defp today_schedule(%{schedule: _schedule} = assigns) do
    ~H"""
    <div class="p-1 rounded-md flex flex-col gap-x-2 bg-card gap-y-2 relative">
      <span class="select-none absolute opacity-10 inset-0 flex items-center justify-center font-bold text-xl">
        Event
      </span>
      <div
        :for={event = %Event{} <- @schedule}
        class="flex flex-col w-32 max-w-32 w-full rounded-md px-2 text-sm"
      >
        <span class="break-all">
          <strong><%= event.subject %></strong> | <%= event.title %>
        </span>
        <div :if={event.hour != "unknown"} class="flex flex-row justify-between flex-wrap break-all">
          <span>Time</span><span><%= event.hour %></span>
        </div>
        <div :if={event.number != "unknown"} class="flex flex-row justify-between flex-wrap break-all">
          <span>Period</span><span><%= event.number %></span>
        </div>
        <div :for={{key, val} <- event.data} class="flex flex-row justify-between flex-wrap break-all">
          <span><%= key %></span><span><%= val %></span>
        </div>
      </div>
    </div>
    """
  end

  defp grade(assigns) do
    ~H"""
    <div
      phx-discard-type="grade"
      phx-hook="swipe_discard"
      id={@grade.href}
      class="flex-row flex justify-between bg-card rounded-md px-2 py-1 relative"
    >
      <span class="select-none absolute opacity-10 inset-0 flex items-center justify-center font-bold text-xl">
        Grade
      </span>
      <div>
        <h3><%= @grade.grade %> <%= @grade.title %></h3>
        <span class="xs:text-xs text-sm w-8">
          <%= @grade.category %>
        </span>
      </div>
      <div class="flex flex-col flex-wrap mt-1 self-end">
        <span class="text-sm xs:text-xs self-end">Weight: <strong><%= @grade.weight %></strong></span>
        <span class="text-sm xs:text-xs self-end"><%= @grade.teacher %></span>
        <span class="text-sm xs:text-xs self-end"><%= @grade.date %></span>
      </div>
    </div>
    """
  end

  defp next_up(%{period: nil} = assigns) do
    ~H"""
    """
  end

  defp next_up(%{period: %Elixirus.Types.Period{} = period} = assigns) do
    assigns = assign(assigns, :info, period.info)

    ~H"""
    <div class="bg-card h-20 rounded-md flex flex-row gap-x-2 relative">
      <span class="select-none absolute opacity-10 inset-0 flex items-center justify-end mr-2 font-bold text-xl">
        Up next
      </span>

      <div class="flex flex-col bg-lighterbg rounded-md p-1 justify-between">
        <span class="xs:text-sm line-clamp-2 break-all">
          <%= @period.subject %>
        </span>
        <span class="xs:text-sm line-clamp-2 break-all">
          <%= @period.teacher_and_classroom %>
        </span>
        <span class="xs:text-sm truncate">
          <%= @period.number %>. <%= @period.date_from %> - <%= @period.date_to %>
        </span>
      </div>
      <div :if={@info != %{}} class="flex overflow-x-auto z-10">
        <div
          :for={
            info <-
              @info
              |> Map.values()
              |> Enum.filter(&Kernel.!=(&1, ""))
          }
          class="flex flex-row gap-x-1 h-full"
        >
          <div
            :for={{value, idx} <- Map.values(info) |> Enum.with_index()}
            phx-hook="expand_click"
            id={"info-#{idx}"}
            class="line-clamp-3 flex-wrap break-all flex bg-lighterbg w-24 max-w-24 p-1 rounded-md my-1"
          >
            <%= value %>
          </div>
        </div>
      </div>
    </div>
    """
  end
end
