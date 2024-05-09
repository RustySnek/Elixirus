defmodule ElixirusWeb.Components.NavHeader do
  use Phoenix.Component
  alias Phoenix.LiveView.JS
  alias Elixirus.Healthcheck.Healthcheck
  alias Elixirus.Healthcheck.Services

  defp toggle_dropdown(id, js \\ %JS{}) do
    js
    |> JS.toggle(to: id)
  end

  defp status() do
    librus = Healthcheck.get_service_status(Services.LibrusConnection)
    proxy = Healthcheck.get_service_status(Services.ProxyAlive)
    %{librus: librus, proxy: proxy}
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

  attr :links, :list, required: true

  def header(assigns) do
    ~H"""
    <nav class=" border-gray-200 px-2 xs:px-0 sm:px-4 py-2.5 rounded w-full">
      <div class="flex flex-row text-xs gap-x-4">
        Services:
        <div
          :for={{service, status} <- status()}
          class={"#{status == :up && '!text-green-400'} text-red-600"}
        >
          <%= service %> <span class="font-semibold"><%= status %></span>
        </div>
      </div>
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
            <%= for {title, href, nested_links, _text_classes} <- @links do %>
              <div phx-hook="expand_links" class="flex relative flex-col w-full" id={title}>
                <.link
                  id={"link-#{title}"}
                  navigate={href}
                  class="block hover:text-fuchsia-900 py-2 pl-3 pr-4 text-3xl xs:text-2xl text-fuchsia-700 rounded md:border-0 md:hover:text-purple-700 md:p-0 "
                >
                  <%= title %>
                </.link>
                <div
                  :if={nested_links != []}
                  id={"expanded-#{title}"}
                  class="md:absolute z-20 top-full md:bg-[#1f1f1f] md:py-4 rounded-lg left-2 sm:block md:hidden"
                >
                  <%= for {title, href} <- nested_links do %>
                    <.link
                      class="h-10 flex flex-col justify-center px-4 hover:bg-fuchsia-700/10 hover:text-fuchsia-900 xs:text-xl text-2xl text-fuchsia-700 rounded md:border-0 md:hover:text-purple-700"
                      navigate={href}
                    >
                      <%= title %>
                    </.link>
                  <% end %>
                </div>
              </div>
            <% end %>
          </ul>
        </div>
      </div>
    </nav>
    """
  end
end
