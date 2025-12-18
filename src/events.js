// @ts-check

import {EventEmitter} from "eventemitter3"

if (!globalThis.hayaDatePickerEvents) {
  globalThis.hayaDatePickerEvents = new EventEmitter()
}

export default globalThis.hayaDatePickerEvents
