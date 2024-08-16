import {shapeComponent, ShapeComponent} from "set-state-compare/src/shape-component"
import {memo} from "react"
import {Platform} from "react-native"

export default memo(shapeComponent(class TableTbody extends ShapeComponent {
  render() {
    if (Platform.OS == "web") {
      return <tbody {...this.props} />
    }

    return <View {...this.props} />
  }
}))
