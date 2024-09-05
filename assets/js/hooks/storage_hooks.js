let StorageHooks = {};
StorageHooks.set_local_storage = {
  updated() {
    if (this.el.value !== "") {
      localStorage.setItem(this.el.name, this.el.value)
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
