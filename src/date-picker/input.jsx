import {memo, useMemo} from "react"
import {Pressable, Text, View} from "react-native"
import DatePicker from "./index"
import PropTypes from "prop-types"
import {ShapeComponent} from "set-state-compare/src/shape-component"

export default memo(shapeComponent(class HayaDatePickerInput extends ShapeComponent {
  static propTypes = propTypesExact({
    datePickerProps: PropTypes.object.isRequired
  })

  setup() {
    this.useStates({
      showDatePicker: false
    })
  }

  render() {
    return (
      <>
        {this.s.showDatePicker &&
          <Modal onRequestClose={this.tt.onDatePickerModalRequestClose}>
            <View>
              <DatePicker {...this.props.datePickerProps} />
            </View>
          </Modal>
        }
        <Pressable onPress={this.tt.onPressed}>
          <View>
            <Text>
              stub
            </Text>
          </View>
        </Pressable>
      </>
    )
  }

  onDatePickerModalRequestClose = () => this.setState({showDatePicker: false})

  onPressed = () => {
    this.setState({showDatePicker: !this.s.showDatePicker})
  }
}))
