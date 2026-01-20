import {AppRegistry} from "react-native"

import App from "./App"

AppRegistry.registerComponent("hayaDatePickerExample", () => App)

const rootTag = document.getElementById("root")

if (!rootTag) {
  throw new Error("Root element not found")
}

AppRegistry.runApplication("hayaDatePickerExample", {rootTag})
