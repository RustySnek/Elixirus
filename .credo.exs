# .credo.exs
%{
  configs: [
    %{
      name: "default",
      checks: %{
        enabled: [
          # this means that `TabsOrSpaces` will not run
          {
            Credo.Check.Refactor.Nesting,
            [max_nesting: 3]
          }
        ]
      }
      # files etc.
    }
  ]
}
