import "phoenix_html"
import { Socket } from "phoenix"
import { LiveSocket } from "phoenix_live_view"
import topbar from "../vendor/topbar"
import Hooks from './hooks';

import Alpine from 'alpinejs';
import breakpoint from 'alpinejs-breakpoints';

let csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")
let liveSocket = new LiveSocket("/live", Socket, { hooks: Hooks, params: { _csrf_token: csrfToken } })

topbar.config({ barColors: { 0: '#C026D3' }, shadowColor: 'rgba(162, 28, 175, .3)' })
window.addEventListener('phx:page-loading-start', _info =>
  topbar.show(200)
)
window.addEventListener('phx:page-loading-stop', _info => topbar.hide())
window.addEventListener('phx:require-login', e => {
  const modal = document.getElementById('login-modal-renderer')
  modal.classList.remove("hidden")
})


liveSocket.connect()
window.liveSocket = liveSocket

Alpine.plugin(breakpoint)
Alpine.start()
