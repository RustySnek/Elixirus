let StyleHooks = {};
StyleHooks.frequency = {
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


StyleHooks.highlight_grade = {

  mounted() {
    setTimeout(() => {
      this.el.classList.add("!bg-inherit")
      this.el.scrollIntoView({ behavior: "smooth", block: "start" });

    }, 200);
  }
}
StyleHooks.slide_right = {
  destroyed() {
    this.el.classList.add("-translate-x-full")
  },



}

StyleHooks.expand_links = {
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


StyleHooks.new_page_link = {
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

export default StyleHooks;
