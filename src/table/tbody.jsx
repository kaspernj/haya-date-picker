import React, {memo} from "react"
import {shapeComponent, ShapeComponent} from "set-state-compare/build/shape-component"
import {Platform, View} from "react-native"

/** @typedef {import("react").ComponentProps<typeof View>} TableTbodyProps */
/** @typedef {Record<string, never>} TableTbodyState */

class TableTbody extends ShapeComponent {
  render() {
    if (Platform.OS == "web") {
      return <tbody {...this.props} />
    }

    return <View {...this.props} />
  }
}

export default memo(shapeComponent(TableTbody))
