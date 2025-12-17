// @ts-check

export default class HayaDatePickerConfig {
  /** @returns {HayaDatePickerConfig} */
  static current() {
    if (!globalThis.hayaDatePickerConfig) {
      globalThis.hayaDatePickerConfig = new HayaDatePickerConfig()
    }

    return globalThis.hayaDatePickerConfig
  }

  constructor() {
    this._locale = "en"
  }

  /** @returns {string} */
  getLocale() {
    return this._locale
  }

  /**
   * @param {string} newLocale
   * @returns {void}
   */
  setLocale(newLocale) {
    this._locale = newLocale
  }

  /**
   * @param {import("./types.js").TranslateFunction} callback
   * @returns {void}
   */
  setTranslate(callback) {
    this._translateCallback = callback
  }

  /**
   * @param {string} msgID
   * @returns {string}
   */
  translate(msgID) {
    if (this._translateCallback) {
      return this._translateCallback(msgID)
    }

    return msgID
  }
}
