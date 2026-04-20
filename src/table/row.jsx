import React, {memo} from "react"
import {shapeComponent, ShapeComponent} from "set-state-compare/build/shape-component"
import dataSetToAttributes from "./data-set-to-attributes.mjs"
import {Platform, View} from "react-native"

/** @typedef {import("react").ComponentProps<typeof View> & {dataSet?: Record<string, unknown>}} TableRowProps */
/** @typedef {Record<string, never>} TableRowState */

class TableRow extends ShapeComponent {
  render() {
    const {dataSet, ...restProps} = this.props

    if (Platform.OS == "web") {
      return <tr {...dataSetToAttributes(dataSet)} {...restProps} />
    }

    return <View dataSet={dataSet} {...restProps} />
  }
}

export default memo(shapeComponent(TableRow))
