import {shapeComponent, ShapeComponent} from "set-state-compare/src/shape-component"
import dataSetToAttributes from "./data-set-to-attributes.mjs"
import {memo} from "react"
import {Platform} from "react-native"

export default memo(shapeComponent(class TableColumn extends ShapeComponent {
  render() {
    const {dataSet, ...restProps} = this.props

    if (Platform.OS == "web") {
      return <table style={{borderSpacing: "0px", borderCollapse: "separate"}} {...dataSetToAttributes(dataSet)} {...restProps} />
    }

    return <View dataSet={dataSet} {...this.props} />
  }
}))
