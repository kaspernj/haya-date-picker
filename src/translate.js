// @ts-check

import Config from "./config.js"

/**
 * @param {string} msgID
 * @returns {string}
 */
export default function translate(msgID) {
  return Config.current().translate(msgID)
}
