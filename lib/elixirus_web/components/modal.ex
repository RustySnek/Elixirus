defmodule ElixirusWeb.Modal do
  @moduledoc """
  Terrible live_component modal
  """
  use ElixirusWeb, :live_component

  attr :id, :string, required: true
  attr :hidden, :boolean, default: true
  slot :inner_block, required: true

  def render(assigns) do
    ~H"""
    <div class="absolute z-40 " id={@id} hidden={@hidden}>
      <div id={"#{@id}-bg"} class=" fixed bg-black/50 inset-0 transition-opacity" aria-hidden="true" />
      <div class="fixed inset-0 overflow-y-auto" role="dialog" aria-modal="true" tabindex="0">
        <div class="flex min-h-full items-center justify-center">
          <div
            phx-click-away={hide_modal(@id)}
            class="w-fit flex items-center justify-center max-w-3xl"
          >
            <%= render_slot(@inner_block) %>
          </div>
        </div>
      </div>
    </div>
    """
  end

  def handle_event("show_modal", _params, socket) do
    show_modal_js(socket.assigns.id)
    {:noreply, socket}
  end

  def show_modal_js(js \\ %JS{}, id) when is_binary(id) do
    js
    |> JS.show(to: "##{id}")
    |> JS.show(
      to: "##{id}-bg",
      transition: {"transition-all transform ease-out duration-300", "opacity-0", "opacity-100"}
    )
  end

  def hide_modal(js \\ %JS{}, id) do
    js
    |> JS.hide(
      to: "##{id}-bg",
      transition: {"transition-all transform ease-in duration-200", "opacity-100", "opacity-0"}
    )
    |> JS.hide(to: "##{id}", transition: {"block", "block", "hidden"})
    |> JS.pop_focus()
  end
end
