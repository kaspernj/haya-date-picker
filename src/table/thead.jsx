import {shapeComponent, ShapeComponent} from "set-state-compare/src/shape-component"
import {memo} from "react"
import {Platform} from "react-native"

export default memo(shapeComponent(class TableThead extends ShapeComponent {
  render() {
    if (Platform.OS == "web") {
      return <thead {...this.props} />
    }

    return <View {...this.props} />
  }
}))
