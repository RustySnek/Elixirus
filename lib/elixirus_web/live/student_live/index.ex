defmodule ElixirusWeb.StudentLive.Index do
  alias ElixirusWeb.LoginForm
  require Logger
  alias Elixirus.Types.Message
  alias Elixirus.Types.Event
  alias Venomous.SnakeArgs
  use ElixirusWeb, :live_view
  alias Elixirus.Types.Client
  import ElixirusWeb.Helpers
  import Heroicons, except: [link: 1]
  
  alias ElixirusWeb.StudentLive.Attendance

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
    :load_schedule,
    :load_subject_attendance
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

  def handle_event("set_stat_tab", %{"tab" => tab}, socket) do
    socket = 
      socket
      |> assign(:active_stat_tab, tab)
      |> calculate_and_assign_stats()
    {:noreply, socket}
  end

  defp calculate_subject_attendance_frequency(attend_marks) do
    Attendance.calculate_attendance_frequency(attend_marks)
  end

  def handle_async(:load_subject_attendance, {:ok, attendance}, socket) do
    socket =
      case match_basic_errors(socket, attendance, @asyncs) do
        {:ok, subject_attendance} ->
          user_id = socket.assigns.user_id
          cache_and_ttl_data(user_id, "subject_attendance", subject_attendance, 15)

          subject_frequency =
            subject_attendance
            |> Map.to_list()
            |> Enum.map(fn {subj, marks} ->
              {subj, calculate_subject_attendance_frequency(marks)}
            end)
            |> Enum.into(%{})

          socket
          |> assign(:subject_frequency, subject_frequency)
          |> assign(:loadings, List.delete(socket.assigns.loadings, :subject_attendance))
          |> calculate_and_assign_stats()

        {_err, _msg, socket} ->
          socket
      end

    {:noreply, socket}
  end

  def handle_event("discard_all", _params, socket) do
    discards = socket.assigns.discards

    message_discards =
      socket.assigns.messages
      |> Enum.map(&Map.get(&1, :href))
      |> Enum.reject(fn msg -> msg in Map.get(discards, "message", []) end)

    attendance_discards =
      socket.assigns.attendance
      |> Enum.map(&Map.get(&1, :href))
      |> Enum.reject(fn a -> a in Map.get(discards, "attendance", []) end)

    grade_discards =
      socket.assigns.grades
      |> Enum.map(&Map.get(&1, :href))
      |> Enum.reject(fn g -> g in Map.get(discards, "grade", []) end)

    announcement_discards =
      socket.assigns.announcements
      |> Enum.map(&(Map.get(&1, :title) <> Map.get(&1, :date)))
      |> Enum.reject(fn a -> a in Map.get(discards, "announcement", []) end)

    discards =
      %{
        :grade => grade_discards,
        :message => message_discards,
        :attendance => attendance_discards,
        :announcement => announcement_discards
      }

    {:noreply, push_event(socket, "discard-all", discards)}
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
          sorted_gpas = 
            try do
              sort_gpas(gpas)
            rescue
              e ->
                Logger.error("Failed to sort GPAs: #{inspect(e)}")
                Logger.error("GPAs data: #{inspect(gpas)}")
                gpas  # Return unsorted if sort fails
            end
          cache_and_ttl_data(user_id, "0-grades", first)
          cache_and_ttl_data(user_id, "1-grades", second)
          cache_and_ttl_data(user_id, "averages", sorted_gpas)
          cache_and_ttl_data(user_id, "final_average", final)

          socket
          |> assign(:final_avg, final)
          |> assign(:averages, sorted_gpas)
          |> assign(:loadings, 
            socket.assigns.loadings
            |> List.delete(:final_avg)
            |> List.delete(:averages)
          )
          |> calculate_and_assign_stats()

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

  def handle_async(:load_averages, {:ok, grades}, socket) do
    socket =
      case match_basic_errors(socket, grades, @asyncs) do
        {:ok, {[_first, _second] = _grades, gpas, _descriptive}} ->
          user_id = socket.assigns.user_id
          sorted_gpas = 
            try do
              sort_gpas(gpas)
            rescue
              e ->
                Logger.error("Failed to sort GPAs in load_averages: #{inspect(e)}")
                Logger.error("GPAs data: #{inspect(gpas)}")
                gpas  # Return unsorted if sort fails
            end
          cache_and_ttl_data(user_id, "averages", sorted_gpas)

          socket
          |> assign(:averages, sorted_gpas)
          |> assign(:loadings, List.delete(socket.assigns.loadings, :averages))
          |> calculate_and_assign_stats()

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
    |> assign(:averages, [])
    |> assign(:subject_frequency, %{})
    |> assign(:active_stat_tab, "worst_attendance")
    |> assign(:best_grades, [])
    |> assign(:worst_grades, [])
    |> assign(:best_attendance, [])
    |> assign(:worst_attendance, [])
    |> assign(:upcoming_period, nil)
  end

  def mount(_params, %{"token" => token}, socket) when map_size(token) == 0 do
    {:ok, setup(socket) |> assign(:page_title, "Login") |> LoginForm.require_login()}
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
    averages = handle_cache_data(user_id, "averages")
    subject_attendance = handle_cache_data(user_id, "subject_attendance")
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
      |> (fn s ->
        # If averages is :load, we need to load it
        # But if final_avg is also :load (in loadings), it will load both, so we skip
        # If final_avg is cached, we load averages separately
        case {averages, final_avg} do
          {:load, :load} ->
            # Both need loading, final_avg handler will set both
            s
          {:load, _cached} ->
            # final_avg is cached, but averages is not - load it
            case Hammer.check_rate("averages:#{user_id}", 60_000, 10) do
              {:allow, _count} ->
                s
                |> assign(:loadings, [:averages | s.assigns.loadings])
                |> start_async(:load_averages, fn ->
                  SnakeArgs.from_params(:elixirus, :grades, [client]) |> Venomous.python!()
                end)
              {:deny, _limit} ->
                s |> put_flash(:error, "Rate limit exceeded!")
            end
          _ ->
            s
        end
      end).()
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
      |> create_fetcher(user_id, subject_attendance, :subject_attendance, fn ->
        SnakeArgs.from_params(:elixirus, :subject_attendance, [client])
        |> Venomous.python!(python_timeout: 20_000)
      end)

    socket =
      socket
      |> (fn s ->
        case frequency do
          [_, _, final] ->
            assign(s, :final_frequency, final)
          _ ->
            s
        end
      end).()
      |> (fn s ->
        case averages do
          :load ->
            # Averages will be loaded via load_final_avg or load_averages async task
            s
          data when is_list(data) and length(data) > 0 ->
            # Ensure GPAs are sorted if not already
            # Data should be list of {subject, [first_sem, second_sem, gpa]} tuples
            sorted_data = 
              try do
                sort_gpas(data)
              rescue
                e ->
                  Logger.warning("Failed to sort cached GPAs: #{inspect(e)}")
                  Logger.warning("First few items: #{inspect(data |> Enum.take(2))}")
                  data  # If sort fails, use original data
              end
            Logger.info("Loaded #{length(sorted_data)} averages from cache")
            s
            |> assign(:averages, sorted_data)
            |> calculate_and_assign_stats()
          data when is_list(data) ->
            # Empty list, keep it but log warning
            Logger.warning("Averages cache returned empty list")
            assign(s, :averages, data)
          other ->
            Logger.warning("Averages cache returned unexpected format: #{inspect(other)}")
            s
        end
      end).()
      |> (fn s ->
        case subject_attendance do
          :load ->
            s
          data when is_map(data) ->
            subject_frequency =
              data
              |> Map.to_list()
              |> Enum.map(fn {subj, marks} ->
                {subj, calculate_subject_attendance_frequency(marks)}
              end)
              |> Enum.into(%{})
            s
            |> assign(:subject_frequency, subject_frequency)
            |> calculate_and_assign_stats()
          _ ->
            s
        end
      end).()
      |> calculate_and_assign_stats()

    {:ok, socket}
  end

  defp announcement(assigns) do
    ~H"""
    <div
      phx-discard-type="announcement"
      phx-hook="swipe_discard"
      id={@announcement.title <> @announcement.date}
      class="glass-card backdrop-blur-xl rounded-lg p-4 hover:border-purple-400/60 transition-colors relative overflow-hidden group"
    >
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0 mt-1">
          <Heroicons.megaphone class="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors" />
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-semibold text-purple-200 mb-2 line-clamp-2">
            <%= @announcement.title %>
          </h3>
          <article
            id={"#{@idx}announcement-wrapper"}
            phx-hook="new_page_link"
            class="text-sm text-purple-300/80 announcement_link mb-3 line-clamp-3"
          >
            <%= @announcement.description
            |> Earmark.as_html!()
            |> HtmlSanitizeEx.html5()
            |> Phoenix.HTML.raw() %>
          </article>
          <div class="flex items-center justify-between text-xs text-purple-400/70 mt-3 pt-3 border-t border-purple-500/20">
            <div class="flex items-center gap-2">
              <Heroicons.user class="w-4 h-4" />
              <span><%= @announcement.author %></span>
            </div>
            <div class="flex items-center gap-2">
              <Heroicons.calendar class="w-4 h-4" />
              <span><%= @announcement.date %></span>
            </div>
          </div>
        </div>
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
      class="flex-col flex justify-between glass-card backdrop-blur-xl rounded-md px-2 py-1 relative"
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
      class="flex-row flex justify-between glass-card backdrop-blur-xl rounded-md px-2 py-1"
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
    <div class="p-1 rounded-md flex flex-col gap-x-2 glass-card backdrop-blur-xl gap-y-2 relative">
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

  defp _has_no_new_items?(messages, attendance, grades, announcements, discards) do
    messages_empty? = 
      messages == [] || 
      (discards && Enum.all?(messages, fn m -> m.href in Map.get(discards, "message", []) end))
    
    attendance_empty? = 
      attendance == [] || 
      (discards && Enum.all?(attendance, fn a -> a.href in Map.get(discards, "attendance", []) end))
    
    grades_empty? = 
      grades == [] || 
      (discards && Enum.all?(grades, fn g -> g.href in Map.get(discards, "grade", []) end))
    
    announcements_empty? = 
      announcements == [] || 
      (discards && Enum.all?(announcements, fn a -> (a.title <> a.date) in Map.get(discards, "announcement", []) end))
    
    messages_empty? && attendance_empty? && grades_empty? && announcements_empty?
  end

  defp count_discardable_items(messages, attendance, grades, announcements, discards) do
    message_count = 
      if discards do
        messages
        |> Enum.count(fn m -> !(m.href in Map.get(discards, "message", [])) end)
      else
        length(messages)
      end
    
    attendance_count = 
      if discards do
        attendance
        |> Enum.count(fn a -> !(a.href in Map.get(discards, "attendance", [])) end)
      else
        length(attendance)
      end
    
    grade_count = 
      if discards do
        grades
        |> Enum.count(fn g -> !(g.href in Map.get(discards, "grade", [])) end)
      else
        length(grades)
      end
    
    announcement_count = 
      if discards do
        announcements
        |> Enum.count(fn a -> !((a.title <> a.date) in Map.get(discards, "announcement", [])) end)
      else
        length(announcements)
      end
    
    message_count + attendance_count + grade_count + announcement_count
  end

  defp next_up(%{period: nil} = assigns) do
    ~H"""
    """
  end

  defp next_up(%{period: %Elixirus.Types.Period{} = period} = assigns) do
    assigns = assign(assigns, :info, period.info)

    ~H"""
    <div class="glass-card backdrop-blur-xl h-20 rounded-md flex flex-row gap-x-2 relative">
      <span class="select-none absolute opacity-10 inset-0 flex items-center justify-end mr-2 font-bold text-xl">
        Up next
      </span>

      <div class="flex flex-col glass-card backdrop-blur-xl bg-opacity-50 rounded-md p-1 justify-between">
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
            {key, val} <-
              @info
              |> Map.to_list()
          }
          phx-hook="expand_click"
          id="info"
          class="line-clamp-3 flex-wrap break-all flex glass-card backdrop-blur-xl w-24 max-w-24 p-1 rounded-md my-1"
        >
          <div class="flex flex-col">
            <span><%= key %></span>
            <div :if={val != ""} class="flex flex-row gap-x-1">
              <p :for={val <- Map.values(val)} :if={val != ""}>
                <%= val %>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    """
  end

  defp calculate_and_assign_stats(socket) do
    averages = socket.assigns[:averages] || []
    
    # Convert from {subject, [%Gpa{}, %Gpa{}, %Gpa{}]} to {subject, gpa_number}
    # Extract GPA from semester 0 (overall GPA)
    grades_with_gpa = 
      averages
      |> Enum.map(fn
        {subject, gpa_list} when is_list(gpa_list) ->
          # Find semester 0 GPA (overall/year GPA)
          overall_gpa = 
            gpa_list
            |> Enum.find(fn %Elixirus.Types.Gpa{semester: sem} -> sem == 0 end)
            |> case do
              %Elixirus.Types.Gpa{gpa: gpa} -> gpa
              _ -> nil
            end
          
          {subject, overall_gpa}
        other ->
          Logger.warning("Unexpected averages format: #{inspect(other)}")
          nil
      end)
      |> Enum.reject(&is_nil/1)
    
    # Convert string GPAs to numbers and filter valid ones
    valid_averages = 
      grades_with_gpa
      |> Enum.map(fn {subject, gpa} ->
        numeric_gpa = 
          case gpa do
            gpa when is_binary(gpa) ->
              case Float.parse(gpa) do
                {num, _} -> num
                :error -> nil
              end
            gpa when is_number(gpa) -> gpa
            _ -> nil
          end
        {subject, numeric_gpa}
      end)
      |> Enum.filter(fn
        {_subject, gpa} when is_number(gpa) ->
          gpa != 0.0 && gpa != 99.0
        _ ->
          false
      end)
      |> Enum.map(fn {subject, gpa} ->
        # Convert back to format {subject, [first, second, gpa]} for consistency
        # We don't have first/second, so use the overall GPA for all
        {subject, [gpa, gpa, gpa]}
      end)
    
    best_grades = 
      valid_averages
      |> Enum.sort_by(fn {_subject, [_first, _second, gpa]} -> gpa end, :desc)
      |> Enum.take(5)
    
    worst_grades = 
      valid_averages
      |> Enum.sort_by(fn {_subject, [_first, _second, gpa]} -> gpa end, :asc)
      |> Enum.take(5)
    
    subject_frequency = socket.assigns[:subject_frequency] || %{}
    timetable = socket.assigns[:timetable]
    
    # Best attendance (highest %)
    best_attendance = 
      subject_frequency
      |> Map.to_list()
      |> Enum.filter(fn {_subject, freq} -> 
        is_number(freq) && freq > 0 
      end)
      |> Enum.sort_by(fn {_subject, freq} -> freq end, :desc)
      |> Enum.take(5)
    
    # Worst attendance (lowest %)
    worst_attendance = 
      subject_frequency
      |> Map.to_list()
      |> Enum.filter(fn {_subject, freq} -> 
        is_number(freq) && freq > 0 
      end)
      |> Enum.sort_by(fn {_subject, freq} -> freq end, :asc)
      |> Enum.take(5)
    
    # Upcoming period
    upcoming_period = 
      if timetable do
        timetable
        |> next_timetable_events_today()
        |> nonempty_periods()
        |> Enum.at(0)
      else
        nil
      end
    
    socket
    |> assign(:best_grades, best_grades)
    |> assign(:worst_grades, worst_grades)
    |> assign(:best_attendance, best_attendance)
    |> assign(:worst_attendance, worst_attendance)
    |> assign(:upcoming_period, upcoming_period)
  end

  defp stats(assigns) do
    final_avg = Map.get(assigns, :final_avg, 0.0) || 0.0
    final_frequency = Map.get(assigns, :final_frequency, 0.0) || 0.0
    _timetable = Map.get(assigns, :timetable)
    student_info = Map.get(assigns, :student_info)
    active_tab = Map.get(assigns, :active_stat_tab, "worst_attendance") || "worst_attendance"
    
    # Pre-computed stats from LiveView - passed as direct assigns
    best_grades = assigns.best_grades || []
    worst_grades = assigns.worst_grades || []
    best_attendance = assigns.best_attendance || []
    worst_attendance = assigns.worst_attendance || []
    upcoming_period = assigns.upcoming_period
    
    ~H"""
    <div class="glass-card backdrop-blur-xl rounded-lg p-6">
      <div class="flex items-center gap-3 mb-6">
        <Heroicons.academic_cap class="w-8 h-8 text-purple-400" />
        <h2 class="text-2xl font-bold text-purple-300">Your Statistics</h2>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Overall Stats -->
        <div class="flex flex-col gap-4">
          <h3 class="text-lg font-semibold text-purple-400 mb-2">Overall Performance</h3>
          <div class="flex flex-col gap-3">
            <.link
              navigate={~p"/student/subjects"}
              class="flex items-center justify-between glass-card backdrop-blur-xl rounded-md p-3 hover:border-purple-400/60 transition-colors cursor-pointer"
            >
              <span class="text-sm text-purple-200">Final Average</span>
              <span class="text-xl font-bold text-purple-300">
                <%= if final_avg > 0, do: :erlang.float_to_binary(final_avg, decimals: 2), else: "N/A" %>
              </span>
            </.link>
            <.link
              navigate={~p"/student/attendance"}
              class="flex items-center justify-between glass-card backdrop-blur-xl rounded-md p-3 hover:border-purple-400/60 transition-colors cursor-pointer"
            >
              <span class="text-sm text-purple-200">Attendance</span>
              <span class="text-xl font-bold text-purple-300">
                <%= if final_frequency > 0, do: :erlang.float_to_binary(final_frequency, decimals: 1) <> "%", else: "N/A" %>
              </span>
            </.link>
          </div>
        </div>
        
        <!-- Subject Performance Tabs -->
        <div class="flex flex-col gap-4">
          <h3 class="text-lg font-semibold text-purple-400 mb-2">Subject Performance</h3>
          
          <!-- Tab Navigation -->
          <div class="flex flex-wrap gap-2 mb-4">
            <button
              phx-click="set_stat_tab"
              phx-value-tab="worst_attendance"
              class={"px-4 py-2 rounded-md text-sm font-medium transition-colors #{if active_tab == "worst_attendance", do: "glass-card backdrop-blur-xl border-purple-400/60 text-purple-300", else: "text-purple-400/70 hover:text-purple-300"}"}
            >
              Worst Attendance
            </button>
            <button
              phx-click="set_stat_tab"
              phx-value-tab="worst_grades"
              class={"px-4 py-2 rounded-md text-sm font-medium transition-colors #{if active_tab == "worst_grades", do: "glass-card backdrop-blur-xl border-purple-400/60 text-purple-300", else: "text-purple-400/70 hover:text-purple-300"}"}
            >
              Worst Grades
            </button>
            <button
              phx-click="set_stat_tab"
              phx-value-tab="best_attendance"
              class={"px-4 py-2 rounded-md text-sm font-medium transition-colors #{if active_tab == "best_attendance", do: "glass-card backdrop-blur-xl border-purple-400/60 text-purple-300", else: "text-purple-400/70 hover:text-purple-300"}"}
            >
              Best Attendance
            </button>
            <button
              phx-click="set_stat_tab"
              phx-value-tab="best_grades"
              class={"px-4 py-2 rounded-md text-sm font-medium transition-colors #{if active_tab == "best_grades", do: "glass-card backdrop-blur-xl border-purple-400/60 text-purple-300", else: "text-purple-400/70 hover:text-purple-300"}"}
            >
              Best Grades
            </button>
          </div>
          
          <!-- Tab Content -->
          <div class="flex flex-col gap-2 min-h-[200px]">
            <!-- Worst Attendance -->
            <div :if={active_tab == "worst_attendance"} class="flex flex-col gap-2">
              <.link
                :for={{subject, freq} <- worst_attendance}
                navigate={~p"/student/attendance"}
                class="glass-card backdrop-blur-xl rounded-md p-3 flex items-center justify-between hover:border-purple-400/60 transition-colors cursor-pointer"
              >
                <span class="text-sm text-purple-200 truncate flex-1"><%= subject %></span>
                <span class="text-lg font-bold text-red-400 ml-3">
                  <%= :erlang.float_to_binary(freq, decimals: 1) %>%
                </span>
              </.link>
              <div :if={worst_attendance == []} class="text-sm text-purple-300/50 text-center py-4">
                No attendance data available
              </div>
            </div>
            
            <!-- Worst Grades -->
            <div :if={active_tab == "worst_grades"} class="flex flex-col gap-2">
              <.link
                :for={{subject, [_first, _second, gpa]} <- worst_grades}
                navigate={~p"/student/subjects?#{URI.encode_query(%{"query" => subject})}"}
                class="glass-card backdrop-blur-xl rounded-md p-3 flex items-center justify-between hover:border-purple-400/60 transition-colors cursor-pointer"
              >
                <span class="text-sm text-purple-200 truncate flex-1"><%= subject %></span>
                <span class="text-lg font-bold text-amber-400 ml-3">
                  <%= case gpa do
                    gpa when is_number(gpa) -> :erlang.float_to_binary(gpa, decimals: 2)
                    "-" -> "-"
                    other -> to_string(other)
                  end %>
                </span>
              </.link>
              <div :if={worst_grades == []} class="text-sm text-purple-300/50 text-center py-4">
                No grade data available
              </div>
            </div>
            
            <!-- Best Attendance -->
            <div :if={active_tab == "best_attendance"} class="flex flex-col gap-2">
              <.link
                :for={{subject, freq} <- best_attendance}
                navigate={~p"/student/attendance"}
                class="glass-card backdrop-blur-xl rounded-md p-3 flex items-center justify-between hover:border-purple-400/60 transition-colors cursor-pointer"
              >
                <span class="text-sm text-purple-200 truncate flex-1"><%= subject %></span>
                <span class="text-lg font-bold text-green-400 ml-3">
                  <%= :erlang.float_to_binary(freq, decimals: 1) %>%
                </span>
              </.link>
              <div :if={best_attendance == []} class="text-sm text-purple-300/50 text-center py-4">
                No attendance data available
              </div>
            </div>
            
            <!-- Best Grades -->
            <div :if={active_tab == "best_grades"} class="flex flex-col gap-2">
              <.link
                :for={{subject, [_first, _second, gpa]} <- best_grades}
                navigate={~p"/student/subjects?#{URI.encode_query(%{"query" => subject})}"}
                class="glass-card backdrop-blur-xl rounded-md p-3 flex items-center justify-between hover:border-purple-400/60 transition-colors cursor-pointer"
              >
                <span class="text-sm text-purple-200 truncate flex-1"><%= subject %></span>
                <span class="text-lg font-bold text-green-400 ml-3">
                  <%= case gpa do
                    gpa when is_number(gpa) -> :erlang.float_to_binary(gpa, decimals: 2)
                    "-" -> "-"
                    other -> to_string(other)
                  end %>
                </span>
              </.link>
              <div :if={best_grades == []} class="text-sm text-purple-300/50 text-center py-4">
                No grade data available
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Upcoming Class -->
      <div :if={upcoming_period} class="mt-6 glass-card backdrop-blur-xl rounded-md p-4">
        <div class="flex items-center gap-3 mb-3">
          <Heroicons.clock class="w-5 h-5 text-purple-400" />
          <h3 class="text-lg font-semibold text-purple-400">Upcoming Class</h3>
        </div>
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <span class="text-purple-200 font-medium"><%= upcoming_period.subject %></span>
            <span class="text-purple-300"><%= upcoming_period.number %>. period</span>
          </div>
          <div class="text-sm text-purple-300/70">
            <%= upcoming_period.date_from %> - <%= upcoming_period.date_to %>
          </div>
          <div class="text-sm text-purple-300/70">
            <%= upcoming_period.teacher_and_classroom %>
          </div>
        </div>
      </div>
      
      <!-- Student Info -->
      <.link
        :if={student_info}
        navigate={~p"/student/student_info"}
        class="mt-6 glass-card backdrop-blur-xl rounded-md p-4 hover:border-purple-400/60 transition-colors cursor-pointer block w-full"
      >
        <div class="flex items-center gap-3 mb-3">
          <Heroicons.user_circle class="w-5 h-5 text-purple-400" />
          <h3 class="text-lg font-semibold text-purple-400">Student Info</h3>
        </div>
        <div class="flex flex-wrap gap-4 text-sm">
          <div class="flex items-center gap-2">
            <span class="text-purple-300/70">Number:</span>
            <span class="text-purple-200 font-medium"><%= student_info.number %></span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-purple-300/70">Lucky Number:</span>
            <span class={"text-purple-200 font-medium #{student_info.number == student_info.lucky_number && "text-green-400"}"}>
              <%= student_info.lucky_number %>
            </span>
          </div>
        </div>
      </.link>
    </div>
    """
  end
end
