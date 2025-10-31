defmodule ElixirusWeb.StudentLive.Attendance do
  require Logger
  use ElixirusWeb, :live_view

  alias Elixirus.Types.Client
  alias Elixirus.Types.Attendance
  import ElixirusWeb.Helpers
  import Venomous
  alias Venomous.SnakeArgs
  import Heroicons, except: [link: 1]

  @asyncs [
    :load_frequency,
    :load_subject_attendance,
    :load_attendance
  ]

  def calculate_attendance_frequency(attend_marks, miss_lesson_offset \\ 0) do
    attended =
      Enum.reduce(
        ["ob", "sp"],
        0,
        fn state, acc -> Map.get(attend_marks, state, 0) + acc end
      )

    total = attend_marks |> Map.values() |> Enum.sum()

    {attended, total} =
      if miss_lesson_offset < 0 do
        attended = attended + abs(miss_lesson_offset)
        {attended, total + abs(miss_lesson_offset)}
      else
        total = total + miss_lesson_offset
        {attended, total}
      end

    (attended / max(1, total) * 10_000)
    |> Float.round()
    |> Kernel./(100)
  end

  def handle_event("offset_frequency", %{"name" => name, "offset" => offset}, socket) do
    frequencies = socket.assigns.subject_frequency
    attend_marks = socket.assigns.subject_attendance

    offset =
      case Integer.parse(offset) do
        :error -> 0
        {offset, _} -> offset
      end

    new_freq = calculate_attendance_frequency(attend_marks |> Map.get(name, %{}), offset)
    
    {:noreply,
     assign(socket, :subject_frequency, Map.put(frequencies, name, new_freq))}
  end

  def handle_async(:load_subject_attendance, {:ok, attendance}, socket) do
    socket =
      case match_basic_errors(socket, attendance, @asyncs) do
        {:ok, subject_attendance} ->
          user_id = socket.assigns.user_id
          cache_and_ttl_data(user_id, "subject_attendance", subject_attendance, 15)

          subject_frequencies =
            subject_attendance
            |> Map.to_list()
            |> Enum.map(fn {subj, marks} ->
              {subj, calculate_attendance_frequency(marks)}
            end)
            |> Enum.into(%{})

          # Store initial sort order (lowest to highest frequency)
          subject_order =
            subject_frequencies
            |> Map.to_list()
            |> Enum.sort_by(fn {_subj, freq} -> freq end)
            |> Enum.map(fn {subj, _freq} -> subj end)

          socket
          |> assign(:subject_attendance, subject_attendance)
          |> assign(:subject_frequency, subject_frequencies)
          |> assign(:subject_order, subject_order)
          |> assign(:loadings, List.delete(socket.assigns.loadings, :subject_attendance))

        {_err, _msg, socket} ->
          socket
      end

    {:noreply, socket}
  end

  def handle_async(:load_frequency, {:ok, frequency}, socket) do
    user_id = socket.assigns.user_id

    socket =
      case match_basic_errors(socket, frequency, @asyncs) do
        {:ok, freq} ->
          freq =
            freq
            |> Tuple.to_list()
            |> Enum.map(
              &((&1 * 1000)
                |> round()
                |> Kernel./(10))
            )

          cache_and_ttl_data(user_id, "frequency", freq, 10)

          socket
          |> assign(:frequency, freq)
          |> assign(:loadings, List.delete(socket.assigns.loadings, :frequency))

        {:token_error, _message, socket} ->
          socket

        {:error, _message, socket} ->
          socket
      end

    {:noreply, socket}
  end

  def handle_async(:load_attendance, {:ok, {attendance, semester}}, socket) do
    user_id = socket.assigns.user_id

    semester =
      case semester |> Integer.parse() do
        :error -> 0
        {semester, _} -> semester
      end

    socket =
      case match_basic_errors(socket, attendance, @asyncs) do
        {:ok, [first, second] = attendance, stats} ->
          attendance = Enum.at(attendance, semester)

          cache_and_ttl_data(user_id, "0-attendance", first, 10)
          cache_and_ttl_data(user_id, "1-attendance", second, 10)
          cache_and_ttl_data(user_id, "attendance-stats", stats, 10)

          socket
          |> assign(:attendance, attendance)
          |> assign(:loadings, List.delete(socket.assigns.loadings, :attendance))
          |> assign(:stats, stats)

        {:token_error, _message, socket} ->
          socket

        {:error, _message, socket} ->
          socket
      end

    {:noreply, socket}
  end

  def handle_event("hover_attendance", %{"data_id" => data_id}, socket) do
    {:noreply, assign(socket, :visible, data_id)}
  end

  def handle_params(%{"href" => href}, _uri, socket) do
    {:noreply, assign(socket, :selected, href)}
  end

  def handle_params(_params, _uri, socket), do: {:noreply, assign(socket, :selected, nil)}

  def mount(_params, %{"user_id" => user_id, "token" => token, "semester" => semester}, socket) do
    %Client{} =
      client =
      socket
      |> handle_api_token(token)
      |> Client.get_client()

    frequency = handle_cache_data(user_id, "frequency")
    subject_attendance = handle_cache_data(user_id, "subject_attendance")

    subject_frequency =
      if subject_attendance != :load do
        subject_attendance
        |> Map.to_list()
        |> Enum.map(fn {subj, marks} ->
          {subj, calculate_attendance_frequency(marks)}
        end)
        |> Enum.into(%{})
      else
        %{}
      end

    attendance = handle_cache_data(user_id, "#{semester}-attendance")

    stats =
      case handle_cache_data(user_id, "attendance-stats") do
        :load -> []
        stats -> stats
      end

    # Store initial sort order if subject_frequency is loaded
    subject_order =
      if subject_frequency != %{} do
        subject_frequency
        |> Map.to_list()
        |> Enum.sort_by(fn {_subj, freq} -> freq end)
        |> Enum.map(fn {subj, _freq} -> subj end)
      else
        []
      end

    socket =
      socket
      |> assign(:attendance, [])
      |> assign(:stats, stats)
      |> assign(:frequency, [])
      |> assign(:subject_frequency, subject_frequency)
      |> assign(:subject_attendance, %{})
      |> assign(:subject_order, subject_order)
      |> assign(:loadings, [])
      |> assign(:client, client)
      |> assign(:semester, semester)
      |> assign(:user_id, user_id)
      |> assign(:visible, nil)
      |> assign(:page_title, "Attendance")
      |> create_fetcher(user_id, frequency, :frequency, fn ->
        SnakeArgs.from_params(:elixirus, :frequency, [client])
        |> python!()
      end)
      |> create_fetcher(user_id, subject_attendance, :subject_attendance, fn ->
        SnakeArgs.from_params(:elixirus, :subject_attendance, [client])
        |> Venomous.python!(python_timeout: 20_000)
        |> dbg
      end)
      |> create_fetcher(user_id, attendance, :attendance, fn ->
        {SnakeArgs.from_params(:elixirus, :attendance, [client, true])
         |> python!(), semester}
      end)

    {:ok, socket}
  end

  defp excursion(true), do: "Yes"
  defp excursion(false), do: "No"

  defp freq_calculator(assigns) do
    ~H"""
    <div class="flex justify-between mt-1">
      <div class="flex flex-row gap-1 flex-wrap">
        <div
          :for={{name, value} <- @attendance}
          class={"rounded-full text-sm w-16 h-min flex-wrap flex flex-row bg-#{attendance_color(name)}"}
        >
          <span class="bg-inherit text-center h-min rounded-l-full brightness-75 w-1/3">
            <%= name %>
          </span>
          <span class="w-2/3 text-center"><%= value %></span>
        </div>
      </div>
      <form phx-change="offset_frequency" phx-update="ignore" id={"#{@subject}-nb-offset"}>
        <input hidden value={@subject} name="name" />
        <input
          class={"bg-fg rounded-md w-20 h-6 border border-#{attendance_color("nb")}"}
          type="number"
          name="offset"
        />
      </form>
    </div>
    """
  end

  attr :class, :string, default: ""
  attr :absence, Attendance, required: true
  attr :selected, :boolean, required: true

  defp absence(%{selected: true} = assigns) do
    ~H"""
    <div class="col-span-full order-last">
      <.link
        id="selected-absence"
        phx-hook="highlight_grade"
        patch={~p"/student/attendance"}
        class={[
          "block glass-card backdrop-blur-xl rounded-lg p-5 border-2 transition-all duration-300 hover:shadow-lg",
          "border-purple-400/80 bg-purple-500/20 ring-2 ring-purple-400/30",
          @class
        ]}
      >
        <div class="flex flex-col md:flex-row gap-4">
          <!-- Symbol Display -->
          <div class="flex-shrink-0 flex items-center justify-center">
            <div class={[
              "relative w-20 h-20 rounded-lg border-2 flex items-center justify-center",
              "border-#{attendance_color(@absence.symbol)}/60 bg-#{attendance_color(@absence.symbol)}/20"
            ]}>
              <span class={[
                "text-4xl font-bold",
                "text-#{attendance_color(@absence.symbol)}"
              ]}>
                <%= @absence.symbol %>
              </span>
            </div>
          </div>

          <!-- Details -->
          <div class="flex-1 flex flex-col gap-3">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-xs text-purple-400/70 mb-1">Period</div>
                <div class="text-lg font-bold text-purple-200"><%= @absence.period %></div>
              </div>
              <div class="text-right">
                <div class="text-xs text-purple-400/70 mb-1">Subject</div>
                <div class="text-sm font-semibold text-purple-200 truncate max-w-[200px]"><%= @absence.subject %></div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <div class="text-xs text-purple-400/70 mb-1">Type</div>
                <div class={[
                  "text-sm font-medium",
                  "text-#{attendance_color(@absence.symbol)}"
                ]}>
                  <%= @absence.type %>
                </div>
              </div>

              <div>
                <div class="text-xs text-purple-400/70 mb-1">Teacher</div>
                <div class="text-sm text-purple-200"><%= @absence.teacher %></div>
              </div>

              <div>
                <div class="text-xs text-purple-400/70 mb-1">Topic</div>
                <div class="text-sm text-purple-200 break-words"><%= @absence.topic %></div>
              </div>

              <div>
                <div class="text-xs text-purple-400/70 mb-1">School Trip</div>
                <div class="text-sm text-purple-200"><%= excursion(@absence.excursion) %></div>
              </div>
            </div>
          </div>
        </div>
      </.link>
    </div>
    """
  end

  defp absence(%{selected: false} = assigns) do
    ~H"""
    <.link
      patch={~p"/student/attendance/#{@absence.href}"}
      class={[
        "group relative aspect-square flex flex-col items-center justify-center rounded-lg border-2",
        "transition-all duration-200 hover:scale-105 hover:shadow-lg overflow-hidden",
        "border-#{attendance_color(@absence.symbol)}/60 bg-#{attendance_color(@absence.symbol)}/10",
        "hover:border-#{attendance_color(@absence.symbol)}/80 hover:bg-#{attendance_color(@absence.symbol)}/20",
        @class
      ]}
    >
      <!-- Period -->
      <div class="absolute top-1 left-1 text-xs font-semibold text-purple-200/70">
        <%= @absence.period %>
      </div>

      <!-- Symbol -->
      <span class={[
        "text-2xl md:text-3xl font-bold",
        "text-#{attendance_color(@absence.symbol)}"
      ]}>
        <%= @absence.symbol %>
      </span>

      <!-- Subject -->
      <div class="absolute bottom-1 left-1 right-1">
        <span class="text-[10px] text-purple-200/80 truncate block text-center font-medium">
          <%= @absence.subject %>
        </span>
      </div>
    </.link>
    """
  end

  defp colors(freq) do
    cond do
      freq == 100 -> "bg-fuchsia-600"
      freq > 70 -> "bg-green-600"
      freq <= 50 -> "bg-red-600"
      freq <= 70 -> "bg-amber-600"
    end
  end
end
