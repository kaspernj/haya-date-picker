import {Column, HeadColumn, Row, Table, Tbody, Thead} from "../table"
import React, {memo, useMemo} from "react"
import {shapeComponent, ShapeComponent} from "set-state-compare/src/shape-component"
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
    onSelect: undefined
  }

  static propTypes = propTypesExact({
    activeDates: PropTypes.arrayOf(Date),
    className: PropTypes.string,
    dateFrom: PropTypes.instanceOf(Date),
    dateTo: PropTypes.instanceOf(Date),
    defaultCurrentDate: PropTypes.instanceOf(Date).isRequired,
    mode: PropTypes.string.isRequired,
    onSelect: PropTypes.func,
    weeksAvailable: PropTypes.object
  })

  debug = false

  setup() {
    this.locale = useLocale()
    this.useStates({
      currentDate: this.props.defaultCurrentDate,
      hoverDate: null,
      selectedDate: null
    })
    this.weeksInMonth = useMemo(() => this.getWeeksInMonth(), [this.s.currentDate])
  }

  render() {
    const {locale} = this.tt
    const {className} = this.props
    const {mode} = this.p
    const {currentDate} = this.s

    return (
      <View
        dataSet={{component: "haya-date-picker", class: className}}
        style={this.rootViewStyle ||= {
          display: "inline-block",
          backgroundColor: "#fff",
          borderRadius: 7,
          paddingTop: 16,
          paddingBottom: 16
        }}
      >
        <View style={this.headerViewStyle ||= {display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between"}}>
          <View style={this.previousViewStyle ||= {paddingLeft: 20}}>
            <Pressable onPress={this.tt.onPreviousMonthClicked}>
              <Text style={this.previousTextStyle ||= {marginTop: -8, fontSize: 27, userSelect: "none"}}>
                &lsaquo;
              </Text>
            </Pressable>
          </View>
          <View>
            <Text>
              {currentDate.toLocaleString(locale, {month: "long"})} {currentDate.getFullYear()}
            </Text>
          </View>
          <View style={this.nextViewStyle ||= {paddingRight: 20}}>
            <Pressable onPress={this.tt.onNextMonthClicked}>
              <Text style={this.nextTextStyle ||= {marginTop: -8, fontSize: 27, userSelect: "none"}}>
                &rsaquo;
              </Text>
            </Pressable>
          </View>
        </View>
        <Table dataSet={this.tableDataSet ||= {class: "date-picker-table"}}>
          <Thead>
            <Row className="day-headers">
              <HeadColumn style={this.initialHeadColumnStyle ||= {paddingLeft: 20}} />
              {this.weekDays().map(({dayNumber, date, last}) =>
                <HeadColumn
                  className="day-header"
                  key={`day-${dayNumber}`}
                  style={this.dayHeaderHeadColumnStyle ||= {
                    paddingTop: 4,
                    paddingRight: last ? 20 : 4,
                    paddingBottom: 4,
                    paddingLeft: 4
                  }}
                >
                  <Text style={this.dayHeaderHeadColumnTextStyle ||= {fontWeight: "bold", textAlign: "center"}}>
                    {date.toLocaleString(locale, {weekday: "long"}).substring(0, 1)}
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
                <Column dataSet={this.weekNumberColumnDataSet ||= {class: "week-number"}} style={this.weekNumberColumnStyle ||= {paddingLeft: 20}}>
                  <Text style={{color: this.isWeekActive(weekDate) ? "#fff" : undefined, fontWeight: "bold"}}>
                    {weekNumber}
                  </Text>
                </Column>
                {daysInWeek.map(({date, dayNumber, last}) =>
                  <DateColumn
                    currentDate={currentDate}
                    date={date}
                    dayNumber={dayNumber}
                    focus={this.focusDate(date)}
                    isWeekActive={this.isWeekActive(weekDate)}
                    key={`day-${dayNumber}`}
                    last={last}
                    mode={mode}
                    onPointerEnter={this.tt.onPointerEnterDate}
                    onPointerLeave={this.tt.onPointerLeaveDate}
                    onPress={this.tt.onDatePress}
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

    if (!hoverDate || !selectedDate) {
      return false
    }

    if (hoverDate > selectedDate && date >= selectedDate && date <= hoverDate) {
      return true
    } else if (hoverDate < selectedDate && date <= selectedDate && date >= hoverDate) {
      return true
    }

    return false
  }

  isWeekActive(date) {
    const {activeDates, mode} = this.p
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
    if (this.p.mode == "date") {
      this.p.onSelect({date})
    } else if (this.p.mode == "dateRange") {
      if (this.s.selectedDate) {
        let fromDate
        let toDate

        if (this.s.selectedDate < date) {
          fromDate = this.s.selectedDate
          toDate = date
        } else {
          fromDate = date
          toDate = this.s.selectedDate
        }

        this.p.onSelect({fromDate, toDate})
        this.setState({selectedDate: null})
      } else {
        this.setState({selectedDate: date})
      }
    } else {
      throw new Error(`Unhandled mode: ${this.p.mode}`)
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
    const {onSelect, mode} = this.p

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

  firstDay = () => new Date(this.state.currentDate.getFullYear(), this.state.currentDate.getMonth(), 1)
  firstDayOfWeek = () => this.firstDay().getDay()
  weekNumberForDate = (date) => moment(date).isoWeek()

  getWeeksInMonth = () => {
    const {currentDate} = this.s
    const firstInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const weeks = []
    let dateCount = moment(firstInMonth).startOf("month").isoWeekday(1)
    let endDate = moment(currentDate).endOf("month")

    if (endDate.isoWeekday() != 7) {
      endDate = endDate.add(7 - endDate.isoWeekday(), "days")
    }

    endDate = endDate.toDate()

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
