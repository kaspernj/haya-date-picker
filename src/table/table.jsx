import React, {memo} from "react"
import {shapeComponent, ShapeComponent} from "set-state-compare/build/shape-component"
import dataSetToAttributes from "./data-set-to-attributes.mjs"
import {Platform, View} from "react-native"

/** @typedef {import("react").ComponentProps<typeof View> & {dataSet?: Record<string, unknown>}} TableProps */
/** @typedef {Record<string, never>} TableState */

class TableComponent extends ShapeComponent {
  render() {
    const {dataSet, ...restProps} = this.props

    if (Platform.OS == "web") {
      return <table style={{borderSpacing: "0px", borderCollapse: "separate"}} {...dataSetToAttributes(dataSet)} {...restProps} />
    }

    return <View dataSet={dataSet} {...this.props} />
  }
}

export default memo(shapeComponent(TableComponent))
