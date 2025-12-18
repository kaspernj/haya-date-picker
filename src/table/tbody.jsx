import React, {memo} from "react"
import {shapeComponent, ShapeComponent} from "set-state-compare/build/shape-component"
import {Platform, View} from "react-native"

export default memo(shapeComponent(class TableTbody extends ShapeComponent {
  render() {
    if (Platform.OS == "web") {
      return <tbody {...this.props} />
    }

    return <View {...this.props} />
  }
}))
