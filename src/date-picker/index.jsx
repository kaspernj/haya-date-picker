import {Column, HeadColumn, Row, Table, Tbody, Thead} from "../table"
import React, {memo, useMemo} from "react"
import {shapeComponent, ShapeComponent} from "set-state-compare/build/shape-component"
import DateColumn from "./date-column"
import moment from "moment"
import PropTypes from "prop-types"
import propTypesExact from "prop-types-exact"
import {Pressable, Text, View} from "react-native"
import useLocale from "../use-locale"
import WeekRow from "./week-row"

export default memo(shapeComponent(class HayaDatePicker extends ShapeComponent {
  static defaultProps = {
    activeDates: undefined,
    defaultCurrentDate: new Date(),
    onSelect: undefined,
    showWeekNumbers: true,
    styles: {}
  }

  static propTypes = propTypesExact({
    activeDates: PropTypes.arrayOf(Date),
    className: PropTypes.string,
    dateFrom: PropTypes.instanceOf(Date),
    dateTo: PropTypes.instanceOf(Date),
    defaultCurrentDate: PropTypes.instanceOf(Date).isRequired,
    mode: PropTypes.oneOf(["date", "dateRange", "week"]).isRequired,
    onRangeSelect: PropTypes.func,
    onSelect: PropTypes.func,
    showWeekNumbers: PropTypes.bool,
    styles: PropTypes.object,
    weekdayFormatter: PropTypes.func,
    weeksAvailable: PropTypes.object
  })

  debug = false
  weekNumberColumnDataSet = undefined
  weekNumberColumnStyle = undefined

  setup() {
    this.locale = useLocale()
    this.useStates({
      currentDate: this.p.defaultCurrentDate,
      hoverDate: null,
      selectedDate: null
    })
    this.weeksInMonth = useMemo(() => this.getWeeksInMonth(), [this.s.currentDate])
  }

  render() {
    const {locale} = this.tt
    const {className, showWeekNumbers, styles} = this.props
    const {mode} = this.p
    const {currentDate} = this.s
    const weekNumbersVisible = showWeekNumbers !== false

    return (
      <View
        dataSet={{component: "haya-date-picker", class: className}}
        style={this.cache("rootViewStyle", () => this.stylingFor("rootViewStyle", {
          display: "inline-block",
          backgroundColor: "#fff",
          borderRadius: 7,
          paddingTop: 16,
          paddingBottom: 16
        }), [styles?.rootViewStyle])}
      >
        <View style={this.cache("headerViewStyle", () => this.stylingFor("headerViewStyle", {display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between"}), [styles?.headerViewStyle])}>
          <View style={this.cache("previousViewStyle", () => this.stylingFor("previousViewStyle", {paddingLeft: weekNumbersVisible ? 20 : 0}), [styles?.previousViewStyle, weekNumbersVisible])}>
            <Pressable onPress={this.tt.onPreviousMonthClicked} style={this.cache("previousButtonStyle", () => this.stylingFor("previousButtonStyle", {}), [styles?.previousButtonStyle])}>
              <Text style={this.cache("previousTextStyle", () => this.stylingFor("previousTextStyle", {marginTop: -8, fontSize: 27, userSelect: "none"}), [styles?.previousTextStyle])}>
                &lsaquo;
              </Text>
            </Pressable>
          </View>
          <View>
            <Text style={this.cache("titleTextStyle", () => this.stylingFor("titleTextStyle", {}), [styles?.titleTextStyle])}>
              {currentDate.toLocaleString(locale, {month: "long"})} {currentDate.getFullYear()}
            </Text>
          </View>
          <View style={this.cache("nextViewStyle", () => this.stylingFor("nextViewStyle", {paddingRight: 20}), [styles?.nextViewStyle])}>
            <Pressable onPress={this.tt.onNextMonthClicked} style={this.cache("nextButtonStyle", () => this.stylingFor("nextButtonStyle", {}), [styles?.nextButtonStyle])}>
              <Text style={this.cache("nextTextStyle", () => this.stylingFor("nextTextStyle", {marginTop: -8, fontSize: 27, userSelect: "none"}), [styles?.nextTextStyle])}>
                &rsaquo;
              </Text>
            </Pressable>
          </View>
        </View>
        <Table dataSet={this.cache("tableDataSet", {class: "date-picker-table"})} style={this.cache("tableStyle", () => this.stylingFor("tableStyle", {}), [styles?.tableStyle])}>
          <Thead>
            <Row className="day-headers">
              {weekNumbersVisible &&
                <HeadColumn style={this.cache("initialHeadColumnStyle", () => this.stylingFor("initialHeadColumnStyle", {paddingLeft: 20}), [styles?.initialHeadColumnStyle])} />
              }
              {this.weekDays().map(({dayNumber, date, last}) =>
                <HeadColumn
                  className="day-header"
                  key={`day-${dayNumber}`}
                  style={this.cache("dayHeaderHeadColumnStyle", () => this.stylingFor("dayHeaderHeadColumnStyle", {
                    paddingTop: 4,
                    paddingRight: last ? 20 : 4,
                    paddingBottom: 4,
                    paddingLeft: 4
                  }), [styles?.dayHeaderHeadColumnStyle, last])}
                >
                  <Text style={this.cache("dayHeaderHeadColumnTextStyle", () => this.stylingFor("dayHeaderHeadColumnTextStyle", {fontWeight: "bold", textAlign: "center"}), [styles?.dayHeaderHeadColumnTextStyle])}>
                    {this.weekdayLabel({date, dayNumber, locale})}
                  </Text>
                </HeadColumn>
              )}
            </Row>
          </Thead>
          <Tbody>
            {this.weeksInMonth.map(({daysInWeek, weekDate, weekNumber}) =>
              <WeekRow
                key={`week-${weekNumber}`}
                mode={mode}
                onClick={this.tt.onSelectWeek}
                weekActive={this.isWeekActive(weekDate)}
                weekAvailable={this.isWeekAvailable(weekDate)}
                weekDate={weekDate}
                weekNumber={weekNumber}
              >
                {weekNumbersVisible &&
                  <Column dataSet={this.weekNumberColumnDataSet ||= {class: "week-number"}} style={this.weekNumberColumnStyle ||= {paddingLeft: 20}}>
                    <Text style={this.cache("weekNumberTextStyle", () => this.stylingFor("weekNumberTextStyle", {color: this.isWeekActive(weekDate) ? "#fff" : undefined, fontWeight: "bold"}), [styles?.weekNumberTextStyle, weekDate])}>
                      {weekNumber}
                    </Text>
                  </Column>
                }
                {daysInWeek.map(({date, dayNumber, last}) =>
                  <DateColumn
                    active={this.isDateActive(date) || this.isWeekActive(weekDate)}
                    currentDate={currentDate}
                    date={date}
                    dayNumber={dayNumber}
                    focus={this.focusDate(date)}
                    key={`date-column-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`}
                    last={last}
                    mode={mode}
                    rangeEnd={this.props.dateTo}
                    rangePreviewEnd={this.s.hoverDate}
                    rangeStart={this.props.dateFrom || this.s.selectedDate}
                    onPointerEnter={this.tt.onPointerEnterDate}
                    onPointerLeave={this.tt.onPointerLeaveDate}
                    onPress={this.tt.onDatePress}
                    styles={styles}
                  />
                )}
              </WeekRow>
            )}
          </Tbody>
        </Table>
      </View>
    )
  }

  currentWeekNumber = () => this.weekNumberForDate(this.s.currentDate)

  focusDate(date) {
    const {hoverDate, selectedDate} = this.s
    const rangeStart = this.props.dateFrom || selectedDate
    const rangeEnd = this.props.dateTo

    if (!hoverDate || !rangeStart || rangeEnd) {
      return false
    }

    if (hoverDate > rangeStart && date >= rangeStart && date <= hoverDate) {
      return true
    } else if (hoverDate < rangeStart && date <= rangeStart && date >= hoverDate) {
      return true
    }

    return false
  }

  isDateActive(date) {
    const {dateFrom, dateTo} = this.props
    const {defaultCurrentDate, mode} = this.p
    const {selectedDate} = this.s

    if (mode == "dateRange") {
      if (dateFrom && this.sameDate(dateFrom, date)) return true
      if (dateTo && this.sameDate(dateTo, date)) return true
      if (selectedDate && this.sameDate(selectedDate, date)) return true

      return false
    }

    if (dateFrom && this.sameDate(dateFrom, date)) return true
    if (selectedDate && this.sameDate(selectedDate, date)) return true

    if (!selectedDate && defaultCurrentDate && defaultCurrentDate.getFullYear() == date.getFullYear() && defaultCurrentDate.getMonth() == date.getMonth() && defaultCurrentDate.getDate() == date.getDate()) {
      return true
    }

    return false
  }

  isWeekActive(date) {
    const {activeDates} = this.props
    const {mode} = this.p
    const dateWeekNumber = this.weekNumberForDate(date)

    if (!activeDates || mode != "week") {
      this.log("No active dates or mode not week")

      return false
    }

    for (const activeDate of activeDates) {
      if (date.getFullYear() == activeDate.getFullYear() && this.weekNumberForDate(activeDate) == dateWeekNumber) {
        return true
      }
    }

    this.log("isWeekActive return false")

    return false
  }

  isWeekAvailable(date) {
    const {weeksAvailable} = this.props

    if (!weeksAvailable) return true

    const year = date.getFullYear()
    const week = moment(date).isoWeek()

    return Boolean(year in weeksAvailable && week in weeksAvailable[year])
  }

  log(args) {
    if (!this.debug) {
      return
    }

    if (typeof args == "function") {
      args = args()
    }

    if (!Array.isArray(args)) {
      args = [args]
    }

    console.log(...args)
  }

  onDatePress = ({date}) => {
    const {dateFrom, dateTo, onRangeSelect, onSelect} = this.props
    const {mode} = this.p

    if (mode == "date") {
      if (onSelect) onSelect({date})
    } else if (mode == "dateRange") {
      const rangeStart = dateFrom || this.s.selectedDate

      if (rangeStart && !dateTo) {
        const {fromDate, toDate} = rangeStart <= date
          ? {fromDate: rangeStart, toDate: date}
          : {fromDate: date, toDate: rangeStart}

        if (onSelect) onSelect({fromDate, toDate})
        if (onRangeSelect) onRangeSelect({fromDate, toDate})
        this.setState({selectedDate: null})
      } else {
        this.setState({selectedDate: date})
        if (onRangeSelect) onRangeSelect({fromDate: date, toDate: null})
      }
    } else {
      throw new Error(`Unhandled mode: ${mode}`)
    }
  }

  onNextMonthClicked = () => {
    const {currentDate} = this.s
    let nextYear = currentDate.getFullYear()
    let nextMonth

    if (currentDate.getMonth() >= 11) {
      nextYear += 1
      nextMonth = 0
    } else {
      nextMonth = currentDate.getMonth() + 1
    }

    const newCurrentDate = new Date(nextYear, nextMonth, 10)

    this.setState({currentDate: newCurrentDate})
  }

  onPointerEnterDate = ({date}) => {
    this.setState({hoverDate: date})
  }

  onPointerLeaveDate = ({date}) => {
    if (this.s.hoverDate == date) {
      this.setState({hoverDate: null})
    }
  }

  onPreviousMonthClicked = () => {
    const {currentDate} = this.s
    const newCurrentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)

    this.setState({currentDate: newCurrentDate})
  }

  onSelectWeek = ({e, weekDate, weekNumber}) => {
    const {onSelect} = this.props
    const {mode} = this.p

    this.log(() => ["DatePicker onSelectWeek", {weekNumber}])

    if (mode != "week" || !onSelect) {
      this.log("Mode not week or no onSelect")

      return
    }

    if (!this.isWeekAvailable(weekDate)) {
      this.log("Click on date that wasn't available")

      return
    }

    onSelect({weekDate})
    e.preventDefault()
  }

  weekDays() {
    const {currentDate} = this.s
    const firstDayOfWeek = this.firstDayOfWeek()
    const daysInLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate() + 1
    const result = []

    for (let i = 0; i < 7; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, daysInLastMonth - firstDayOfWeek + i + 1)

      result.push({
        dayNumber: i,
        date,
        last: i == 6
      })
    }

    return result
  }

  firstDay = () => new Date(this.s.currentDate.getFullYear(), this.s.currentDate.getMonth(), 1)
  firstDayOfWeek = () => this.firstDay().getDay()
  weekNumberForDate = (date) => moment(date).isoWeek()

  sameDate(firstDate, secondDate) {
    return Boolean(
      firstDate &&
        secondDate &&
        firstDate.getFullYear() == secondDate.getFullYear() &&
        firstDate.getMonth() == secondDate.getMonth() &&
        firstDate.getDate() == secondDate.getDate()
    )
  }

  weekdayLabel({date, dayNumber, locale}) {
    const {weekdayFormatter} = this.props

    if (weekdayFormatter) return weekdayFormatter({date, dayNumber, locale})

    return date.toLocaleString(locale, {weekday: "long"}).substring(0, 1)
  }

  getWeeksInMonth = () => {
    const {currentDate} = this.s
    const firstInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const weeks = []
    const dateCount = moment(firstInMonth).startOf("month").isoWeekday(1)
    let endDateMoment = moment(currentDate).endOf("month")

    if (endDateMoment.isoWeekday() != 7) {
      endDateMoment = endDateMoment.add(7 - endDateMoment.isoWeekday(), "days")
    }

    const endDate = endDateMoment.toDate()

    while (dateCount.toDate() < endDate) {
      const weekDate = dateCount.toDate()
      const weekNumber = dateCount.isoWeek()
      const daysInWeek = []

      for (let i = 0; i < 7; i++) {
        const weekDate = dateCount.toDate()

        daysInWeek.push({
          date: weekDate,
          dayNumber: i,
          last: i == 6
        })
        dateCount.add(1, "day")
      }

      weeks.push({
        weekDate,
        daysInWeek,
        weekNumber
      })
    }

    return weeks
  }
}))
