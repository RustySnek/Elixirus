defmodule ElixirusWeb.Layouts do
  use ElixirusWeb, :html
  import ElixirusWeb.Components.NavHeader
  import ElixirusWeb.Components.RefreshIcon

  embed_templates "layouts/*"

  def links do
    [
      {
        "Academics",
        ~p"/student/academics",
        [
          {"Subjects", ~p"/student/academics/subjects"},
          {"Attendance", ~p"/student/academics/attendance"}
        ],
        []
      },
      {"Scheduling", ~p"/student/scheduling",
       [
         {"Timetable", ~p"/student/scheduling/timetable"},
         {"Schedule", ~p"/student/scheduling/schedule"},
         {"Homework", ~p"/student/scheduling/homework"}
       ], []},
      {"Messages", ~p"/student/messages", [], []}
    ]
  end
end
