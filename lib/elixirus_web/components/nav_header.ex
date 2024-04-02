defmodule ElixirusWeb.Components.NavHeader do
  use Phoenix.Component
  alias Phoenix.LiveView.JS

  defp toggle_dropdown(id, js \\ %JS{}) do
    js
    |> JS.toggle(to: id)
  end

  attr :name, :string, default: "My App"

  defp logo(assigns) do
    ~H"""
    <svg
      class="w-10 h-10 p-2 mr-3 text-white rounded-full"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      viewBox="0 0 24 24"
    >
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
    </svg>

    <span class="self-center text-xl font-semibold whitespace-nowrap ">
      <%= @name %>
    </span>
    """
  end

  slot :logo

  slot :link, default: [%{__slot__: :link, inner_block: nil, label: "student", to: "/student"}] do
    attr :label, :string, required: true
    attr :to, :string, required: true
  end

  def header(assigns) do
    ~H"""
    <nav class=" border-gray-200 px-2 sm:px-4 py-2.5 rounded w-full">
      <div class="container flex flex-wrap items-center justify-between mx-auto">
        <%= render_slot(@logo) %>
        <button
          phx-click={toggle_dropdown("#navbar-default")}
          type="button"
          class="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden focus:outline-none focus:ring-2 focus:ring-gray-200 "
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span class="sr-only">Open main menu</span>
          <svg
            class="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd"
            >
            </path>
          </svg>
        </button>
        <div class="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul class="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-4 lg:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 ">
            <%= for link <- @link do %>
              <.link
                navigate={link.to}
                class="block hover:text-fuchsia-900 py-2 pl-3 pr-4 text-xl text-fuchsia-700 rounded md:border-0 md:hover:text-purple-700 md:p-0 "
              >
                <%= link.label %>
              </.link>
            <% end %>
          </ul>
        </div>
      </div>
    </nav>
    """
  end
end