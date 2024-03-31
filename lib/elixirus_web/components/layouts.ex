defmodule ElixirusWeb.Layouts do
  use ElixirusWeb, :html
  import ElixirusWeb.Components.NavHeader
  import ElixirusWeb.Components.RefreshIcon

  embed_templates "layouts/*"
end
