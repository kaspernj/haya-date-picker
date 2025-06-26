import Config from "./config.js"

export default function translate(msgID) {
  return Config.current().translate(msgID)
}
