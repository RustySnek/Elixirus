import { discard } from './storage_hooks';

let StyleHooks = {};

StyleHooks.scroll_top = {
  mounted() {
    const top_scroll = this.el.getAttribute("top")
    window.scrollTo(0, parseInt(top_scroll) || 0
    )
  }
}
StyleHooks.expand_click = {
  mounted() {
    this.el.addEventListener("click", _ => {
      const classes = ["absolute", "w-full", "left-0", "h-full", "top-0", "my-1"]
      classes.forEach((name) => this.el.classList.toggle(name))
    })
  }
}
StyleHooks.swipe_discard = {
  mounted() {
    this.startX = 0;
    this.endX = 0;

    this.el.addEventListener('touchstart', (event) => {
      this.startX = event.touches[0].clientX;
    });

    this.el.addEventListener('touchmove', (event) => {
      this.endX = event.touches[0].clientX;
    });

    this.el.addEventListener('touchend', () => {
      this.handleSwipe();
    });
  },

  handleSwipe() {
    const threshold = 100; // Minimum distance to consider a swipe
    if (this.endX === 0) {
      return 0
    }
    const distance = this.endX - this.startX;

    if (distance > threshold) {
      this.animateSwipe("right")
    } else if (distance < -threshold) {
      this.animateSwipe("left")
    }
  },
  animateSwipe(result) {
    const event = this.el.getAttribute("phx-discard-type")
    const item_id = this.el.getAttribute("id")
    const direction = result === 'right' ? 1000 : -1000; // Move right for kept, left for discarded
    this.el.style.transition = 'transform 0.5s ease-out';
    this.el.style.transform = `translateX(${direction}px)`;

    setTimeout(_ => {
      this.el.remove()
      if (typeof event === "string") {
        discard({ event: [item_id] })
      }

    }, 200)

  },

  resetPosition() {
    this.el.style.transition = 'transform 0.5s ease-out';
    this.el.style.transform = 'translateX(0)'; // Reset to original position
  },



};

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
