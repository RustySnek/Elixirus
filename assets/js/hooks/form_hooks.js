let FormHooks = {};

FormHooks.handle_textarea = {
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

FormHooks.recipients_form = {
  mounted() {
    this.el.addEventListener("submit", (event) => {
      event.preventDefault();
      input = this.el.querySelector("#recipient-name-input")
      input.value = ""
    })
  }
}

FormHooks.form_confirmation = {
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

export default FormHooks;
