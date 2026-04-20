import React, {memo} from "react"
import {shapeComponent, ShapeComponent} from "set-state-compare/build/shape-component"
import {Platform, View} from "react-native"

/** @typedef {import("react").ComponentProps<typeof View>} TableHeadColumnProps */
/** @typedef {Record<string, never>} TableHeadColumnState */

class TableHeadColumn extends ShapeComponent {
  render() {
    if (Platform.OS == "web") {
      return <th {...this.props} />
    }

    return <View {...this.props} />
  }
}

export default memo(shapeComponent(TableHeadColumn))
