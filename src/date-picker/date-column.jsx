import {Column} from "../table"
import PropTypes from "prop-types"
import propTypesExact from "prop-types-exact"
import {memo} from "react"
import {shapeComponent, ShapeComponent} from "set-state-compare/src/shape-component"
import {Pressable, Text, View} from "react-native"

export default memo(shapeComponent(class DateColumn extends ShapeComponent {
  static propTypes = propTypesExact({
    currentDate: PropTypes.instanceOf(Date).isRequired,
    date: PropTypes.instanceOf(Date).isRequired,
    dayNumber: PropTypes.number.isRequired,
    focus: PropTypes.bool.isRequired,
    isWeekActive: PropTypes.bool.isRequired,
    last: PropTypes.bool.isRequired,
    mode: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    onPointerEnter: PropTypes.func.isRequired,
    onPointerLeave: PropTypes.func.isRequired
  })

  setup() {
    this.useStates({
      hover: false
    })
  }

  render() {
    const {currentDate, date, dayNumber, focus, isWeekActive, last, mode} = this.p
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
      } else if (focus) {
        viewStyle.backgroundColor = "#d7e4ea"
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
        {(() => {
          if (mode == "dateRange") {
            return (
              <Pressable
                children={textContent}
                onPointerEnter={this.tt.onPointerEnter}
                onPointerLeave={this.tt.onPointerLeave}
                onPress={this.tt.onPress}
                style={viewStyle}
              />
            )
          } else if (mode != "dateRange") {
            return (
              <View children={textContent} style={viewStyle} />
            )
          } else {
            throw new Error(`Unknown mode: ${mode}`)
          }
        })()}
      </Column>
    )
  }

  onPointerEnter = () => {
    this.p.onPointerEnter({date: this.p.date})
    this.setState({hover: true})
  }

  onPointerLeave = () => {
    this.p.onPointerLeave({date: this.p.date})
    this.setState({hover: false})
  }

  onPress = () => this.p.onPress({date: this.p.date})
}))
