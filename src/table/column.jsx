import React, {memo} from "react"
import {shapeComponent, ShapeComponent} from "set-state-compare/build/shape-component"
import dataSetToAttributes from "./data-set-to-attributes.mjs"
import {Platform, View} from "react-native"

export default memo(shapeComponent(class TableColumn extends ShapeComponent {
  render() {
    const {dataSet, ...restProps} = this.props

    if (Platform.OS == "web") {
      return <td {...dataSetToAttributes(dataSet)} {...restProps} />
    }

    return <View dataSet={dataSet} {...restProps} />
  }
}))
