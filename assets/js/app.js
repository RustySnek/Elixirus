import "phoenix_html"
import { Socket } from "phoenix"
import { LiveSocket } from "phoenix_live_view"
import topbar from "../vendor/topbar"
import "./firebase_notifications"

navigator.serviceWorker.register('firebase-messaging-sw.js', { type: "module" })
  .then(function(registration) {
    console.log('Registration successful, scope is:', registration.scope);
  }).catch(function(err) {
    console.log('Service worker registration failed, error:', err);
  });

let csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")
let Hooks = {}
Hooks.set_local_storage = {
  updated() {
    if (this.el.value !== "") {
      localStorage.setItem(this.el.name, this.el.value)
    }
  }
}

Hooks.handle_textarea = {
  mounted() {
    this.el.addEventListener("keydown", (event) => {
      if (event.key === "Tab") {
        event.preventDefault()
        var start = this.el.selectionStart;
        var end = this.el.selectionEnd;

        // set textarea value to: text before caret + tab + text after caret
        this.el.value = this.el.value.substring(0, start) +
          "\t" + this.el.value.substring(end);

        // put caret at right position again
        this.el.selectionStart =
          this.el.selectionEnd = start + 1;
      }
    })
  }
}

Hooks.retrieve_local_storage = {
  mounted() {
    let name = this.el.getAttribute("name")
    let item = localStorage.getItem(name)
    if (name === "semester" && item === undefined || name === "semester" && item === null) {
      let currentMonth = new Date().getMonth() + 1
      let result = (currentMonth >= 2 && currentMonth < 9) ? "1" : "0"
      this.pushEventTo(this.el, "retrieve_local_storage", { [name]: result })
    } else {
      this.pushEventTo(this.el, "retrieve_local_storage", { [name]: item })
    }
  }
}

Hooks.recipients_form = {
  mounted() {
    this.el.addEventListener("submit", (event) => {
      event.preventDefault();
      input = this.el.querySelector("#recipient-name-input")
      name = input.value
      input.value = ""
    })
  }
}

Hooks.form_confirmation = {
  mounted() {
    this.el.addEventListener("click", (e) => {
      e.preventDefault();
      let confirmation = confirm("Submit the form?")
      if (confirmation) {
        this.pushEvent("send_message")
      }
    })
  }
}

Hooks.login_form = {
  updated() {
    let username = localStorage.getItem("username") || "";
    let username_input = this.el.querySelector('#form-username');
    username_input.value = username
  },
  mounted() {
    let renderer = document.getElementById("login-modal-renderer")
    const observer = new MutationObserver((mutations, observer) => {
      let username = localStorage.getItem("username") || "";

      let username_input = this.el.querySelector('#form-username');
      username_input.addEventListener('input', () => {
        localStorage.setItem("username", username_input.value);
      });
      let password_input = this.el.querySelector('#form-password');
      if (username !== "") {
        username_input.value = username

        password_input.focus()
      } else {
        username_input.focus()

      }
    })
    let config = { attributes: true, attributeFilter: ['class'] };
    observer.observe(renderer, config)


  }
}

Hooks.new_page_link = {
  mounted() {
    if (this.el.tagName.toLowerCase() === 'a') {
      this.el.setAttribute('target', '_blank');
      this.el.setAttribute('rel', 'noopener noreferrer');
    } else {

      const links = this.el.querySelectorAll('a');
      links.forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      });

    }
  },
  updated() {
    if (this.el.tagName.toLowerCase() === 'a') {
      this.el.setAttribute('target', '_blank');
      this.el.setAttribute('rel', 'noopener noreferrer');
    } else {

      const links = this.el.querySelectorAll('a');
      links.forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      });

    }

  }
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
      this.el.scrollIntoView({ behavior: "smooth", block: "start" });

    }, 200);
  }
}
Hooks.slide_right = {
  destroyed() {
    this.el.classList.add("-translate-x-full")
  },



}

Hooks.expand_links = {
  mounted() {
    this.el.addEventListener("mouseenter", () => {
      let expand_div = document.getElementById(`expanded-${this.el.getAttribute('id')}`)
      expand_div.classList.add("!block")
    })
    this.el.addEventListener("mouseleave", () => {
      let expand_div = document.getElementById(`expanded-${this.el.getAttribute('id')}`)
      expand_div.classList.remove("!block")
    })

  }
}
Hooks.store_token = {
  updated() {
    if (this.el.value === "") {
      return
    }
    const { v4: uuidv4 } = require("uuid");
    const user_id = uuidv4();
    fetch(`/set_token?token=${this.el.value}&user_id=${user_id}`).then(_response => window.location.reload())
  }
}

let liveSocket = new LiveSocket("/live", Socket, { hooks: Hooks, params: { _csrf_token: csrfToken } })

// Show progress bar on live navigation and form submits

topbar.config({ barColors: { 0: '#29d' }, shadowColor: 'rgba(246, 0, 206, .3)' })
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

