defmodule ElixirusWeb.LoginModal do
  @moduledoc """
  modal for quick login
  """
  alias ElixirusWeb.LoginForm
  use ElixirusWeb, :live_component

  def render(assigns) do
    ~H"""
    <div
      id="login-modal-renderer"
      class="fixed hidden"
      style="position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important; z-index: 999999 !important; isolation: isolate !important;"
    >
      <div
        class="fixed bg-blue-500/10 inset-0 transition-opacity"
        style="position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important; z-index: 999999 !important;"
        aria-hidden="true"
      >
      </div>
      <div
        class="fixed inset-0 overflow-y-auto"
        style="position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important; z-index: 1000000 !important;"
        role="dialog"
        aria-modal="true"
        tabindex="0"
      >
        <div class="flex min-h-full items-center justify-center">
          <div
            class="w-full flex items-center justify-center xs:max-w-xl max-w-3xl p-4 sm:p-6 lg:py-8"
            style="z-index: 1000001 !important; position: relative !important;"
          >
            <.live_component module={LoginForm} id="login_form" />
          </div>
        </div>
      </div>
    </div>
    """
  end
end
