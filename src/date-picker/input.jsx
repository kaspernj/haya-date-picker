import {memo, useMemo} from "react"
import {Pressable, Text, View} from "react-native"
import DatePicker from "./index"
import PropTypes from "prop-types"
import {ShapeComponent} from "set-state-compare/src/shape-component"

export default memo(shapeComponent(class HayaDatePickerInput extends ShapeComponent {
  static propTypes = propTypesExact({
    datePickerProps: PropTypes.object.isRequired,
    textStyle: PropTypes.object,
    viewStyle: PropTypes.object
  })

  setup() {
    this.useStates({
      showDatePicker: false
    })
  }

  render() {
    const {datePickerProps = {}, styles} = this.props
    const {dateFrom, dateTo} = datePickerProps
    const {onSelect, ...restDatePickerProps} = datePickerProps
    const actualViewStyle = Object.assign(
      {flexDirection: "row"},
      styles.view
    )
    const actualTextStyle = Object.assign(
      {marginLeft: 8},
      styles.text
    )

    return (
      <>
        {this.s.showDatePicker &&
          <Modal onRequestClose={this.tt.onDatePickerModalRequestClose}>
            <View>
              <DatePicker onSelect={this.tt.onDateSelect} {...restDatePickerProps} />
            </View>
          </Modal>
        }
        <Pressable onPress={this.tt.onPressed}>
          <View style={actualViewStyle}>
            <Text>
              &#x1f4c5;
            </Text>
            <Text style={actualTextStyle}>
              {dateFrom && dateTo &&
                <>{I18n.strftime("%Y-%m-%d", dateFrom)} - {I18n.strftime("%Y-%m-%d", dateTo)}</>
              }
            </Text>
          </View>
        </Pressable>
      </>
    )
  }

  onDatePickerModalRequestClose = () => this.setState({showDatePicker: false})

  onDateSelect = (...args) => {
    this.setState({showDatePicker: false})
    this.props.datePickerProps.onSelect(...args)
  }

  onPressed = () => {
    this.setState({showDatePicker: true})
  }
}))
