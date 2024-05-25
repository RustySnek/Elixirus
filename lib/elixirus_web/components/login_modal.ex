defmodule ElixirusWeb.LoginModal do
  @moduledoc """
  modal for quick login
  """
  alias ElixirusWeb.LoginForm
  use ElixirusWeb, :live_component

  def render(assigns) do
    ~H"""
    <div id="login-modal-renderer" class="z-40 fixed hidden">
      <div>
        <div class=" fixed bg-blue-500/10  inset-0 transition-opacity" aria-hidden="true" />
        <div class="fixed inset-0 overflow-y-auto" role="dialog" aria-modal="true" tabindex="0">
          <div class="flex min-h-full items-center justify-center">
            <div class="w-full flex items-center justify-center xs:max-w-xl max-w-3xl p-4 sm:p-6 lg:py-8">
              <.live_component module={LoginForm} id="login_form" />
            </div>
          </div>
        </div>
      </div>
    </div>
    """
  end
end
