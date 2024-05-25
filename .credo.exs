# .credo.exs
%{
  configs: [
    %{
      name: "default",
      checks: %{
        disabled: [
          # this means that `TabsOrSpaces` will not run
          {
            Credo.Check.Refactor.Apply,
            []
          }
        ]
      }
      # files etc.
    }
  ]
}
