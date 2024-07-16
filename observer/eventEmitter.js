export class EventEmitter {
  #subscribers = {}
  subscribe(eventName, callback) {
    if (!this.#subscribers[eventName]) {
      this.#subscribers[eventName] = []
    }
    this.#subscribers[eventName].push(callback)
  }
  emit(eventName, data = null) {
    this.#subscribers[eventName]?.forEach(cb => cb(data))
  }
  unSubscribe(eventName, callback) {
    if (this.#subscribers[eventName]) {
      this.#subscribers[eventName] =  this.#subscribers[eventName]?.filter(cb => cb !== callback)
    }
  }
}
