export default class HayaDatePickerConfig {
  static current() {
    if (!globalThis.hayaDatePickerConfig) {
      globalThis.hayaDatePickerConfig = new HayaDatePickerConfig()
    }

    return globalThis.hayaDatePickerConfig
  }

  constructor() {
    this._locale = "en"
  }

  getLocale() {
    return this._locale
  }

  setLocale(newLocale) {
    this._locale = newLocale
  }

  setTranslate(callback) {
    this._translateCallback = callback
  }

  translate(msgID) {
    if (this._translateCallback) {
      return this._translateCallback(msgID)
    }

    return msgID
  }
}
