import {Column} from "../table"
import moment from "moment"
import PropTypes from "prop-types"
import propTypesExact from "prop-types-exact"
import {memo, useMemo} from "react"
import {shapeComponent, ShapeComponent} from "set-state-compare/src/shape-component"
import {Pressable, Text, View} from "react-native"

export default memo(shapeComponent(class DateColumn extends ShapeComponent {
  static propTypes = propTypesExact({
    currentDate: PropTypes.instanceOf(Date).isRequired,
    date: PropTypes.instanceOf(Date).isRequired,
    dayNumber: PropTypes.number.isRequired,
    isWeekActive: PropTypes.bool.isRequired,
    last: PropTypes.bool.isRequired,
    mode: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired
  })

  setup() {
    this.useStates({
      hover: false
    })
  }

  render() {
    const {currentDate, date, dayNumber, isWeekActive, last, mode} = this.p
    const {hover} = this.s
    const style = {}
    const viewStyle = {
      paddingTop: 4,
      paddingRight: 4,
      paddingBottom: 4,
      paddingLeft: 4,
      borderRadius: 4
    }
    const textStyle = {
      textAlign: "center"
    }

    if (isWeekActive) {
      textStyle.color = "#fff"
    } else if (date.getMonth() != currentDate.getMonth()) {
      textStyle.color = "grey"
    }

    if (last) {
      style.paddingRight = 20
    }

    if (mode == "dateRange") {
      viewStyle.cursor = "pointer"

      if (hover) {
        viewStyle.backgroundColor = "#039be5"
        textStyle.color = "#fff"
      }
    }

    const textContent = (
      <Text style={textStyle}>
        {date.getDate()}
      </Text>
    )

    return (
      <Column
        dataSet={{
          class: "day-column",
          dayNumber: dayNumber
        }}
        style={style}
      >
        {mode == "dateRange" &&
          <Pressable
            children={textContent}
            onPointerOver={this.tt.onPointerOver}
            onPointerLeave={this.tt.onPointerLeave}
            onPress={this.tt.onPress}
            style={viewStyle}
          />
        }
        {mode != "dateRange" &&
          <View children={textContent} style={viewStyle} />
        }
      </Column>
    )
  }

  onPointerOver = () => this.setState({hover: true})
  onPointerLeave = () => this.setState({hover: false})

  onPress = () => this.p.onPress({date: this.p.date})
}))
