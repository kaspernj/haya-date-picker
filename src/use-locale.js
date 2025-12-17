// @ts-check

import Config from "./config.js"
import events from "./events.js"
import React from "react"
import useEventEmitter from "@kaspernj/api-maker/build/use-event-emitter.js"

export default function useLocale() {
  const [locale, setLocale] = React.useState(Config.current().getLocale())

  const onLocaleChanged = React.useCallback(() => {
    setLocale(Config.current().getLocale())
  }, [])

  useEventEmitter(events, "localeChanged", onLocaleChanged)

  return locale
}
