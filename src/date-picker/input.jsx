import {Modal, Pressable, Text, View} from "react-native"
import React, {memo, useMemo} from "react"
import {shapeComponent, ShapeComponent} from "set-state-compare/src/shape-component"
import DatePicker from "./index"
import PropTypes from "prop-types"
import propTypesExact from "prop-types-exact"
import strftime from "strftime"

export default memo(shapeComponent(class HayaDatePickerInput extends ShapeComponent {
  static propTypes = propTypesExact({
    datePickerProps: PropTypes.object.isRequired,
    styles: PropTypes.object,
    textStyle: PropTypes.object,
    viewStyle: PropTypes.object
  })

  setup() {
    this.strftime = strftime
    this.useStates({
      showDatePicker: false
    })
  }

  render() {
    const {strftime} = this.tt
    const {datePickerProps = {}, styles} = this.props
    const {dateFrom, dateTo} = datePickerProps
    const {onSelect, ...restDatePickerProps} = datePickerProps

    const actualViewStyle = useMemo(() => {
      return Object.assign(
        {flexDirection: "row"},
        styles.view
      )
    }, [styles.view])

    const actualTextStyle = useMemo(() => {
      return Object.assign(
        {marginLeft: 8},
        styles.text
      )
    }, [styles.text])

    return (
      <>
        {this.s.showDatePicker &&
          <Modal onRequestClose={this.tt.onDatePickerModalRequestClose}>
            <View>
              <DatePicker onSelect={this.tt.onDateSelect} {...restDatePickerProps} />
            </View>
          </Modal>
        }
        <Pressable dataSet={this.pressableDataSet ||= {component: "haya-date-picker--input"}} onPress={this.tt.onPressed}>
          <View style={actualViewStyle}>
            <Text>
              &#x1f4c5;
            </Text>
            <Text dataSet={this.dateTextDataSet ||= {class: "current-value-text"}} style={actualTextStyle}>
              {dateFrom && dateTo &&
                <>{strftime("%Y-%m-%d", dateFrom)} - {strftime("%Y-%m-%d", dateTo)}</>
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
