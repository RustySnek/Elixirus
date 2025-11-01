const ActiveTab = {
  mounted() {
    this.updateActiveTab();
    this.initScrollCollapse();
    
    // Update on LiveView navigation
    document.addEventListener("phx:navigate", () => {
      setTimeout(() => this.updateActiveTab(), 100);
    });
    // Update on browser navigation (back/forward)
    window.addEventListener("popstate", () => {
      setTimeout(() => this.updateActiveTab(), 100);
    });
  },

  updated() {
    this.updateActiveTab();
  },

  destroyed() {
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    if (this.throttleTimeout) {
      clearTimeout(this.throttleTimeout);
    }
  },

  initScrollCollapse() {
    let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    let ticking = false;
    let isCollapsed = false;
    const nav = this.el.closest('nav');
    
    if (!nav) return;

    // Thresholds to prevent rapid toggling (hysteresis)
    const SCROLL_DOWN_THRESHOLD = 50;  // Minimum pixels scrolled down to trigger collapse
    const SCROLL_UP_THRESHOLD = 30;    // Minimum pixels scrolled up to trigger expand
    const MIN_SCROLL_DISTANCE = 80;    // Only start collapsing after 80px total scroll
    const THROTTLE_DELAY = 100;        // Throttle scroll handler more aggressively

    this.scrollHandler = () => {
      // Additional throttling on top of requestAnimationFrame
      if (this.throttleTimeout) {
        return;
      }
      
      this.throttleTimeout = setTimeout(() => {
        this.throttleTimeout = null;
      }, THROTTLE_DELAY);

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const scrollDifference = scrollTop - lastScrollTop;
          
          // Clear any pending timeout
          if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = null;
          }
          
          // Near top - always show tabs
          if (scrollTop < MIN_SCROLL_DISTANCE) {
            if (isCollapsed) {
              nav.classList.remove('tabs-collapsed');
              isCollapsed = false;
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
            ticking = false;
            return;
          }

          // Determine scroll direction and magnitude
          const isScrollingDown = scrollDifference > 0;
          const scrollMagnitude = Math.abs(scrollDifference);

          // Only toggle if scroll difference exceeds threshold
          if (isScrollingDown && scrollMagnitude >= SCROLL_DOWN_THRESHOLD && !isCollapsed) {
            // Scrolling down - hide tabs
            nav.classList.add('tabs-collapsed');
            isCollapsed = true;
            lastScrollTop = scrollTop;
          } else if (!isScrollingDown && scrollMagnitude >= SCROLL_UP_THRESHOLD && isCollapsed) {
            // Scrolling up - show tabs (with slight delay to prevent bounce)
            this.scrollTimeout = setTimeout(() => {
              if (isCollapsed) {
                const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
                // Only expand if still scrolling up or at rest
                if (currentScroll <= lastScrollTop || Math.abs(currentScroll - lastScrollTop) < 10) {
                  nav.classList.remove('tabs-collapsed');
                  isCollapsed = false;
                }
              }
            }, 50);
            lastScrollTop = scrollTop;
          } else {
            // Small movement - only update lastScrollTop if significant change
            if (scrollMagnitude > 5) {
              lastScrollTop = scrollTop;
            }
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', this.scrollHandler, { passive: true });
  },

  updateActiveTab() {
    const currentPath = window.location.pathname;
    const tabItems = this.el.querySelectorAll('.tab-item');
    
    tabItems.forEach(tab => {
      const href = tab.getAttribute('data-href');
      if (href) {
        let hrefPath;
        try {
          hrefPath = new URL(href, window.location.origin).pathname;
        } catch (e) {
          // If href is already a path, use it directly
          hrefPath = href.startsWith('/') ? href : `/${href}`;
        }
        
        // Check if current path matches or starts with href path
        if (hrefPath === "/student" && currentPath === "/student") {
          tab.classList.add('active');
        } else if (hrefPath !== "/student" && currentPath.startsWith(hrefPath)) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      }
    });
  }
};

export default {
  ActiveTab
};

