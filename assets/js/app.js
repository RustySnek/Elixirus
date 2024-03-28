// If you want to use Phoenix channels, run `mix help phx.gen.channel`
// to get started and then uncomment the line below.
// import "./user_socket.js"

// You can include dependencies in two ways.
//
// The simplest option is to put them in assets/vendor and
// import them using relative paths:
//
//     import "../vendor/some-package.js"
//
// Alternatively, you can `npm install some-package --prefix assets` and import
// them using a path starting with the package name:
//
//     import "some-package"
//

// Include phoenix_html to handle method=PUT/DELETE in forms and buttons.
import "phoenix_html"
// Establish Phoenix Socket and LiveView configuration.
import {Socket} from "phoenix"
import {LiveSocket} from "phoenix_live_view"
import topbar from "../vendor/topbar"

let csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")
let Hooks = {}
Hooks.set_local_storage = {
  updated() {
    localStorage.setItem(this.el.name, this.el.value)
  }
}
Hooks.retrieve_local_storage = {
  mounted() {
    let name = this.el.getAttribute("name")
    let item = localStorage.getItem(name)
    console.log(item, this.el.name)
    this.pushEvent("retrieve_local_storage", {[name]: item === undefined | null ? "" : item})
  }
}
Hooks.focus_field = {
  mounted() {
    this.el.focus()
  },
}
Hooks.frequency = {
  mounted() {
    const deg = this.el.getAttribute("name")
    setTimeout(() => {
    this.el.style.setProperty("--progress-value", deg)
      
    }, 50);

  },
updated() {
    const deg = this.el.getAttribute("name")
    setTimeout(() => {
    this.el.style.setProperty("--progress-value", deg)
      
    }, 50);

  }



}
Hooks.highlight_grade = {
  
  mounted() {
    setTimeout(() => {
     this.el.classList.add("!bg-inherit")
    this.el.scrollIntoView({behavior: "smooth", block: "start"});
   
    }, 200);
    }
}
Hooks.slide_right = {
  mounted() {
    this.el.classList.add("-translate-x-full")
  },
 destroyed() {
    this.el.classList.add("-translate-x-full")
  },
  

}
Hooks.store_token = {
  updated() {
    if (this.el.value === "") {
      return
    }
    const {v4: uuidv4} = require("uuid");
    const user_id = uuidv4();
    fetch(`/set_token?token=${this.el.value}&username=${this.el.name}&user_id=${user_id}`).then((response) => {
      this.pushEvent("navigate_students", {return_url: this.el.getAttribute("return_url"),token: this.el.value, username: this.el.name, user_id: user_id})
      })
    }
}
Hooks.store_semester = {
  updated() {
    fetch(`/set_semester?semester=${this.el.value}`)
  }
}
let liveSocket = new LiveSocket("/live", Socket, {hooks: Hooks,params: {_csrf_token: csrfToken}})

// Show progress bar on live navigation and form submits
topbar.config({barColors: {0: "#29d"}, shadowColor: "rgba(0, 0, 0, .3)"})
window.addEventListener("phx:page-loading-start", _info => topbar.show(300))
window.addEventListener("phx:page-loading-stop", _info => topbar.hide())

// connect if there are any LiveViews on the page
liveSocket.connect()

// expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)  // enabled for duration of browser session
// >> liveSocket.disableLatencySim()
window.liveSocket = liveSocket

