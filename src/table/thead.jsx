import React, {memo} from "react"
import {shapeComponent, ShapeComponent} from "set-state-compare/build/shape-component"
import {Platform, View} from "react-native"

/** @typedef {import("react").ComponentProps<typeof View>} TableTheadProps */
/** @typedef {Record<string, never>} TableTheadState */

class TableThead extends ShapeComponent {
  render() {
    if (Platform.OS == "web") {
      return <thead {...this.props} />
    }

    return <View {...this.props} />
  }
}

export default memo(shapeComponent(TableThead))
