defmodule ElixirusWeb.Layouts do
  use ElixirusWeb, :html
  import ElixirusWeb.Components.NavHeader

  embed_templates "layouts/*"

  def links do
    [
      {"Timetable", ~p"/student/timetable", [], []},
      {"Messages", ~p"/student/messages", [], []},
      {"Announcements", ~p"/student/announcements", [], []},
      {"Schedule", ~p"/student/schedule", [], []},
      {"Subjects", ~p"/student/subjects", [], []}
      #    {
      #      "Academics",
      #      ~p"/student/academics",
      #      [
      #        
      #        {"Attendance", ~p"/student/academics/attendance"},
      #        {"Homework", ~p"/student/academics/homework"}
      #      ],
      #      []
      #    },
      #    {"Scheduling", ~p"/student/scheduling",
      #     [
      #     ], []},
      #    {"Communication", ~p"/student/communication/announcements",
      #     [
      #       {"Announcements", ~p"/student/communication/announcements"}
      #     ], []}
    ]
  end
end
