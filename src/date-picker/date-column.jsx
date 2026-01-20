import {Pressable, Text, View} from "react-native"
import React, {memo, useMemo} from "react"
import {shapeComponent, ShapeComponent} from "set-state-compare/build/shape-component"
import {Column} from "../table"
import PropTypes from "prop-types"
import propTypesExact from "prop-types-exact"

export default memo(shapeComponent(class DateColumn extends ShapeComponent {
  static defaultProps = {
    styles: {}
  }

  static propTypes = propTypesExact({
    active: PropTypes.bool.isRequired,
    currentDate: PropTypes.instanceOf(Date).isRequired,
    date: PropTypes.instanceOf(Date).isRequired,
    dayNumber: PropTypes.number.isRequired,
    focus: PropTypes.bool.isRequired,
    last: PropTypes.bool.isRequired,
    mode: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    onPointerEnter: PropTypes.func.isRequired,
    onPointerLeave: PropTypes.func.isRequired,
    rangeEnd: PropTypes.instanceOf(Date),
    rangePreviewEnd: PropTypes.instanceOf(Date),
    rangeStart: PropTypes.instanceOf(Date),
    styles: PropTypes.object
  })

  setup() {
    this.useStates({
      hover: false
    })
  }

  render() {
    const {active, currentDate, date, dayNumber, focus, last, mode} = this.p
    const {rangeEnd, rangePreviewEnd, rangeStart, styles} = this.props
    const {hover} = this.s
    const isOutsideMonth = date.getMonth() != currentDate.getMonth()
    const isRangeStart = this.sameDate(rangeStart, date)
    const isRangeEnd = this.sameDate(rangeEnd, date)
    const hasRange = Boolean(rangeStart && rangeEnd)
    const isInRange = hasRange
      ? this.isBetweenDates(date, rangeStart, rangeEnd) && !isRangeStart && !isRangeEnd
      : false
    const previewStart = rangeStart
    const hasPreviewRange = Boolean(previewStart && rangePreviewEnd && !rangeEnd)
    const isInPreviewRange = hasPreviewRange ? this.isBetweenDates(date, previewStart, rangePreviewEnd) : false
    const isRangeEdge = isRangeStart || isRangeEnd
    const isSelected = Boolean(active || isRangeEdge)

    const viewStyle = useMemo(() => {
      const viewStyle = this.stylingFor("dayCellStyle", {
        paddingTop: 4,
        paddingRight: 4,
        paddingBottom: 4,
        paddingLeft: 4,
        borderRadius: 4
      })

      if (mode == "date" || mode == "dateRange") {
        viewStyle.cursor = "pointer"

        if (isSelected || hover) {
          Object.assign(viewStyle, {backgroundColor: "#039be5"})
          this.stylingFor("dayCellSelectedStyle", viewStyle)
        } else if (focus || isInPreviewRange) {
          Object.assign(viewStyle, {backgroundColor: "#d7e4ea"})
          this.stylingFor("dayCellPreviewStyle", viewStyle)
        }
      }

      if (isInRange) {
        Object.assign(viewStyle, {backgroundColor: "#d7e4ea"})
        this.stylingFor("dayCellRangeStyle", viewStyle)
      } else if (isInPreviewRange) {
        Object.assign(viewStyle, {backgroundColor: "#d7e4ea"})
        this.stylingFor("dayCellPreviewRangeStyle", viewStyle)
      }

      if (isRangeStart) {
        this.stylingFor("dayCellRangeStartStyle", viewStyle)
      }

      if (isRangeEnd) {
        this.stylingFor("dayCellRangeEndStyle", viewStyle)
      }

      if (active) {
        this.stylingFor("dayCellActiveStyle", viewStyle)
      }

      return viewStyle
    }, [active, focus, hover, isInPreviewRange, isInRange, isRangeEnd, isRangeStart, isSelected, mode, styles, hasPreviewRange])

    const textStyle = useMemo(() => {
      const textStyle = this.stylingFor("dayCellTextStyle", {
        textAlign: "center"
      })

      if (isSelected) {
        Object.assign(textStyle, {color: "#fff"})
        this.stylingFor("dayCellSelectedTextStyle", textStyle)
      } else if (isInRange || isInPreviewRange) {
        this.stylingFor("dayCellRangeTextStyle", textStyle)
      } else if (isOutsideMonth) {
        Object.assign(textStyle, {color: "grey"})
        this.stylingFor("dayCellOutsideTextStyle", textStyle)
      }

      if (mode == "dateRange" && hover) {
        Object.assign(textStyle, {color: "#fff"})
        this.stylingFor("dayCellHoverTextStyle", textStyle)
      }

      return textStyle
    }, [hover, isInPreviewRange, isInRange, isOutsideMonth, isSelected, mode, styles])

    const style = useMemo(() => {
      return this.stylingFor("dayColumnStyle", {
        paddingRight: last ? 20 : undefined
      })
    }, [last, styles])

    const textContent = (
      <Text style={textStyle}>
        {date.getDate()}
      </Text>
    )

    const dataSet = useMemo(() => ({
      class: "day-column",
      date: date.getDate(),
      dayNumber: dayNumber,
      inRange: isInRange,
      rangeEnd: isRangeEnd,
      rangeStart: isRangeStart,
      weekActive: active
    }), [active, date.getDate(), isInRange, isRangeEnd, isRangeStart])

    return (
      <Column
        dataSet={dataSet}
        style={style}
      >
        {(() => {
          if (mode == "date" || mode == "dateRange") {
            return (
              <Pressable
                onPointerEnter={this.tt.onPointerEnter}
                onPointerLeave={this.tt.onPointerLeave}
                onPress={this.tt.onPress}
                style={viewStyle}
              >
                {textContent}
              </Pressable>
            )
          } else if (mode != "dateRange") {
            return (
              <View style={viewStyle}>
                {textContent}
              </View>
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

  isBetweenDates(date, firstDate, secondDate) {
    if (!firstDate || !secondDate) return false

    const start = firstDate.getTime() <= secondDate.getTime() ? firstDate : secondDate
    const end = firstDate.getTime() <= secondDate.getTime() ? secondDate : firstDate

    return date.getTime() >= start.getTime() && date.getTime() <= end.getTime()
  }

  sameDate(firstDate, secondDate) {
    return Boolean(
      firstDate &&
        secondDate &&
        firstDate.getFullYear() == secondDate.getFullYear() &&
        firstDate.getMonth() == secondDate.getMonth() &&
        firstDate.getDate() == secondDate.getDate()
    )
  }
}))
