defmodule ElixirusWeb.Layouts do
  use ElixirusWeb, :html
  import ElixirusWeb.Components.NavHeader

  embed_templates "layouts/*"
end
