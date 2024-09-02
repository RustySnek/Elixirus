import { v4 as uuidv4 } from "uuid";

let AuthHooks = {}

AuthHooks.logout_button = {
  mounted() {
    this.el.addEventListener("click", e => {
      e.preventDefault()
      const user_id = uuidv4();

      fetch(`/clear_token?user_id=${user_id}`).then(_response => window.location.reload())
    })
  }
}
AuthHooks.store_token = {
  updated() {
    if (this.el.value === "") {
      return
    }
    const user_id = uuidv4();
    fetch(`/set_token?token=${this.el.value}&user_id=${user_id}`).then(_response => window.location.reload())
  }
}


AuthHooks.login_form = {
  updated() {
    let username = localStorage.getItem("username") || "";
    let username_input = this.el.querySelector('#form-username');
    username_input.value = username
  },
  mounted() {
    let renderer = document.getElementById("login-modal-renderer")
    let username = localStorage.getItem("username") || "";
    let password_input = this.el.querySelector('#form-password');
    let username_input = this.el.querySelector('#form-username');
    if (username !== "") {
      username_input.value = username
      password_input.focus()
    } else {
      username_input.focus()
    }


    const observer = new MutationObserver((mutations, observer) => {

      username_input.addEventListener('input', () => {
        localStorage.setItem("username", username_input.value);
      });
    })
    let config = { attributes: true, attributeFilter: ['class'] };
    observer.observe(renderer, config)


  }
}
export default AuthHooks;
