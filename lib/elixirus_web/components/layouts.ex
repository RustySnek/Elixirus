defmodule ElixirusWeb.Layouts do
  use ElixirusWeb, :html
  import ElixirusWeb.Components.NavHeader

  embed_templates "layouts/*"

  def links do
    [
      {
        "Academics",
        ~p"/student/academics",
        [
          {"Subjects", ~p"/student/academics/subjects"},
          {"Attendance", ~p"/student/academics/attendance"},
          {"Homework", ~p"/student/academics/homework"}
        ],
        []
      },
      {"Scheduling", ~p"/student/scheduling",
       [
         {"Timetable", ~p"/student/scheduling/timetable"},
         {"Schedule", ~p"/student/scheduling/schedule"}
       ], []},
      {"Communication", ~p"/student/communication/messages",
       [
         {"Announcements", ~p"/student/communication/announcements"},
         {"Messages", ~p"/student/communication/messages"}
       ], []}
    ]
  end
end
