let StorageHooks = {};

export function discard(events) {
  let discarded_items = localStorage.getItem("discards");
  try {
    discarded_items = discarded_items ? JSON.parse(discarded_items) : {};
  } catch {
    discarded_items = {};
  }
  if (!(discarded_items instanceof Object)) {
    discarded_items = {};
  }

  const updatedDiscardedItems = { ...discarded_items };

  Object.entries(events).forEach(([_event, item_ids]) => {
    const discards = updatedDiscardedItems[_event] || [];
    const newDiscards = item_ids.filter(id => !discards.includes(id));

    newDiscards.forEach(id => {
      const elem = document.getElementById(id);
      elem.remove()
    })
    if (newDiscards.length > 0) {
      updatedDiscardedItems[_event] = [...discards, ...newDiscards];
    }
  });

  localStorage.setItem("discards", JSON.stringify(updatedDiscardedItems));
};

StorageHooks.set_local_storage = {
  updated() {
    if (this.el.value !== "") {
      localStorage.setItem(this.el.name, JSON.stringify(this.el.value))
    }
  }
}

StorageHooks.retrieve_local_storage = {
  mounted() {
    let name = this.el.getAttribute("name")
    let item = localStorage.getItem(name)
    try {
      item = JSON.parse(item)
    } catch {
      console.warn("Error in retrieving local storage key")
    }
    if (name === "semester" && item === undefined || name === "semester" && item === null) {
      let currentMonth = new Date().getMonth() + 1
      let result = (currentMonth >= 2 && currentMonth < 9) ? "1" : "0"
      this.pushEventTo(this.el, "retrieve_local_storage", { [name]: result })
    } else {
      this.pushEventTo(this.el, "retrieve_local_storage", { [name]: item })
    }
  }
}

export default StorageHooks;
