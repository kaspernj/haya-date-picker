import React, {memo} from "react"
import {shapeComponent, ShapeComponent} from "set-state-compare/src/shape-component"
import dataSetToAttributes from "./data-set-to-attributes.mjs"
import {Platform} from "react-native"

export default memo(shapeComponent(class TableRow extends ShapeComponent {
  render() {
    const {dataSet, ...restProps} = this.props

    if (Platform.OS == "web") {
      return <tr {...dataSetToAttributes(dataSet)} {...restProps} />
    }

    return <View dataSet={dataSet} {...restProps} />
  }
}))
