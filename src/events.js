import EventEmitter from "events"

if (!globalThis.hayaDatePickerEvents) {
  globalThis.hayaDatePickerEvents = new EventEmitter()
}

export default globalThis.hayaDatePickerEvents
