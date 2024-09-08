defmodule ElixirusWeb.Layouts do
  use ElixirusWeb, :html
  import ElixirusWeb.Components.NavHeader

  embed_templates "layouts/*"

  def links do
    [
      {"Messages", ~p"/student/messages", [], []},
      {"Announcements", ~p"/student/announcements", [], []}
      #    {
      #      "Academics",
      #      ~p"/student/academics",
      #      [
      #        {"Subjects", ~p"/student/academics/subjects"},
      #        {"Attendance", ~p"/student/academics/attendance"},
      #        {"Homework", ~p"/student/academics/homework"}
      #      ],
      #      []
      #    },
      #    {"Scheduling", ~p"/student/scheduling",
      #     [
      #       {"Timetable", ~p"/student/scheduling/timetable"},
      #       {"Schedule", ~p"/student/scheduling/schedule"}
      #     ], []},
      #    {"Communication", ~p"/student/communication/announcements",
      #     [
      #       {"Announcements", ~p"/student/communication/announcements"}
      #     ], []}
    ]
  end
end
