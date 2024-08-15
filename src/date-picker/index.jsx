import "./style"
import {Column, HeadColumn, Row, Table, Tbody, Thead} from "../table"
import classNames from "classnames"
import moment from "moment"
import PropTypes from "prop-types"
import {memo, useMemo} from "react"
import {shapeComponent, ShapeComponent} from "set-state-compare/src/shape-component"
import {Pressable, Text, View} from "react-native"
import WeekRow from "./week-row"

export default memo(shapeComponent(class HayaDatePicker extends ShapeComponent {
  static defaultProps = {
    activeDates: undefined,
    defaultCurrentDate: new Date(),
    onSelectWeek: undefined,
    pickWeek: false
  }

  static propTypes = propTypesExact({
    activeDates: PropTypes.arrayOf(Date),
    className: PropTypes.string,
    defaultCurrentDate: PropTypes.instanceOf(Date).isRequired,
    mode: PropTypes.string.isRequired,
    onSelectWeek: PropTypes.func,
    pickWeek: PropTypes.bool.isRequired,
    weeksAvailable: PropTypes.object
  })

  setup() {
    this.useStates({
      currentDate: this.props.defaultCurrentDate
    })

    this.weeksInMonth = useMemo(() => this.getWeeksInMonth(), [this.s.currentDate])
  }

  render() {
    const {className, pickWeek} = this.props
    const {currentDate} = this.s

    return (
      <View
        dataSet={{component: "haya-date-picker", class: className}}
        style={{
          display: "inline-block",
          backgroundColor: "#fff",
          borderRadius: 7,
          paddingTop: 16,
          paddingBottom: 16
        }}
      >
        <View style={{display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between"}}>
          <View style={{paddingLeft: "20px"}}>
            <Pressable onPress={this.tt.onPreviousMonthClicked}>
              <Text style={{marginTop: -8, fontSize: 27}}>
                &lsaquo;
              </Text>
            </Pressable>
          </View>
          <View>
            <Text>
              {currentDate.toLocaleString(I18n.locale, {month: "long"})} {currentDate.getFullYear()}
            </Text>
          </View>
          <View style={{paddingRight: "20px"}}>
            <Pressable onPress={this.tt.onNextMonthClicked}>
              <Text style={{marginTop: -8, fontSize: 27}}>
                &rsaquo;
              </Text>
            </Pressable>
          </View>
        </View>
        <Table dataSet={{class: "date-picker-table", pickWeek: "pickWeek"}}>
          <Thead>
            <Row className="day-headers">
              <HeadColumn style={{paddingLeft: 20}} />
              {this.weekDays().map(({dayNumber, date, last}) =>
                <HeadColumn
                  className="day-header"
                  key={`day-${dayNumber}`}
                  style={{
                    paddingTop: 4,
                    paddingRight: last ? 20 : 4,
                    paddingBottom: 4,
                    paddingLeft: 4
                  }}
                >
                  <Text style={{textAlign: "center"}}>
                    {date.toLocaleString(I18n.locale, {weekday: "long"}).substring(0, 1)}
                  </Text>
                </HeadColumn>
              )}
            </Row>
          </Thead>
          <Tbody>
            {this.weeksInMonth.map(({date, daysInWeek, weekNumber}) =>
              <WeekRow
                dataSet={{
                  activeWeek: this.isWeekActive(date),
                  weekNumber: weekNumber
                }}
                key={`week-${weekNumber}`}
                onClick={this.tt.onSelectWeek}
                pickWeek={pickWeek}
                weekAvailable={this.isWeekAvailable(date)}
                weekDate={date}
                weekNumber={weekNumber}
              >
                <Column dataSet={{class: "week-number"}} style={{paddingLeft: 20}}>
                  <Text style={{fontWeight: "bold"}}>
                    {weekNumber}
                  </Text>
                </Column>
                {daysInWeek.map(({date, dayNumber, last}) =>
                  <Column
                    dataSet={{
                      class: "day-column",
                      dayNumber: dayNumber
                    }}
                    key={`day-${dayNumber}`}
                    style={{
                      paddingTop: 4,
                      paddingRight: last ? 20 : 4,
                      paddingBottom: 4,
                      paddingLeft: 4
                    }}
                  >
                    <Text
                      style={{
                        color: date.getMonth() == currentDate.getMonth() ? undefined : "grey",
                        textAlign: "center"
                      }}
                    >
                      {date.getDate()}
                    </Text>
                  </Column>
                )}
              </WeekRow>
            )}
          </Tbody>
        </Table>
      </View>
    )
  }

  currentWeekNumber = () => this.weekNumberForDate(this.s.currentDate)
  isWeekActive(date) {
    const {activeDates, mode, pickWeek} = this.p
    const dateWeekNumber = this.weekNumberForDate(date)

    if (!pickWeek || !activeDates || mode != "week") return false

    for (const activeDate of activeDates) {
      if (date.getFullYear() == activeDate.getFullYear() && this.weekNumberForDate(activeDate) == dateWeekNumber) {
        return true
      }
    }

    return false
  }

  isWeekAvailable(date) {
    const {weeksAvailable} = this.props

    if (!weeksAvailable) return true

    const year = date.getFullYear()
    const week = moment(date).isoWeek()

    return Boolean(year in weeksAvailable && week in weeksAvailable[year])
  }

  onNextMonthClicked = (e) => {
    e.preventDefault()

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

  onPreviousMonthClicked = (e) => {
    e.preventDefault()

    const {currentDate} = this.s
    const newCurrentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)

    this.setState({currentDate: newCurrentDate})
  }

  onSelectWeek = ({e, weekDate, weekNumber}) => {
    const {onSelectWeek, pickWeek} = this.p

    if (!pickWeek || !onSelectWeek) return
    if (!this.isWeekAvailable(weekDate)) return

    e.preventDefault()

    onSelectWeek({weekDate, weekNumber})
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
    const weeks = []
    let dayCount = 1
    let dateCount = moment(currentDate).startOf("month").weekday(1).toDate()

    while (dateCount.getMonth() <= currentDate.getMonth()) {
      const weekNumber = this.weekNumberForDate(dateCount)
      const daysInWeek = []
      const startWeekDay = (weekNumber - 1) * 7 + 1

      for (let i = 0; i < 7; i++) {
        const weekDayInYear = startWeekDay + i
        const weekDate = new Date(currentDate.getFullYear(), 0, weekDayInYear)

        daysInWeek.push({
          date: weekDate,
          dayNumber: i,
          last: i == 6
        })
      }

      weeks.push({
        date: dateCount,
        daysInWeek,
        weekNumber
      })

      dayCount += 7
      dateCount = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayCount)
    }

    return weeks
  }
}))
