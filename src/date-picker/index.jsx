import "./style"
import classNames from "classnames"
import {digs} from "diggerize"
import moment from "moment"
import PropTypes from "prop-types"
import React from "react"

class WeekRow extends React.PureComponent {
  render() {
    const {onClick, weekDate, weekNumber, ...restProps} = this.props

    return (
      <tr className="week-row" onClick={digg(this, "onSelectWeek")} {...restProps} />
    )
  }

  onSelectWeek = (e) => {
    const {weekDate, weekNumber} = digs(this.props, "weekDate", "weekNumber")

    this.props.onClick({e, weekDate, weekNumber})
  }
}

export default class HayaDatePicker extends React.PureComponent {
  static defaultProps = {
    activeDates: undefined,
    defaultCurrentDate: new Date(),
    onSelectWeek: undefined,
    pickWeek: false
  }

  static propTypes = {
    activeDates: PropTypes.arrayOf(Date),
    className: PropTypes.string,
    defaultCurrentDate: PropTypes.instanceOf(Date).isRequired,
    onSelectWeek: PropTypes.func,
    pickWeek: PropTypes.bool.isRequired,
    weeksAvailable: PropTypes.object
  }

  state = {
    currentDate: this.props.defaultCurrentDate
  }

  render() {
    const {activeDates, className, defaultCurrentDate, onSelectWeek, pickWeek, weeksAvailable, ...restProps} = this.props
    const {currentDate} = digs(this.state, "currentDate")

    return (
      <div className={classNames("haya-date-picker", className)} {...restProps}>
        <div style={{display: "flex", width: "100%", justifyContent: "space-between"}}>
          <div style={{paddingLeft: "20px"}}>
            <a href="#" onClick={digg(this, "onPreviousMonthClicked")}>
              <i className="fa fa-chevron-left" />
            </a>
          </div>
          <div>
            {currentDate.toLocaleString(I18n.locale, {month: "long"})} {currentDate.getFullYear()}
          </div>
          <div style={{paddingRight: "20px"}}>
            <a href="#" onClick={digg(this, "onNextMonthClicked")}>
              <i className="fa fa-chevron-right" />
            </a>
          </div>
        </div>
        <table className="date-picker-table" data-pick-week={pickWeek}>
          <thead>
            <tr className="day-headers">
              <td />
              {this.weekDays().map(({dayNumber, date}) =>
                <th className="day-header" key={`day-${dayNumber}`}>
                  {date.toLocaleString(I18n.locale, {weekday: "long"}).substring(0, 1)}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {this.weeksInMonth().map(({date, daysInWeek, weekNumber}) =>
              <WeekRow
                data-active-week={this.isWeekActive(date)}
                data-week-available={this.isWeekAvailable(date)}
                data-week-number={weekNumber}
                key={`week-${weekNumber}`}
                onClick={digg(this, "onSelectWeek")}
                weekDate={date}
                weekNumber={weekNumber}
              >
                <td className="week-number">
                  {weekNumber}
                </td>
                {daysInWeek.map(({date, dayNumber}) =>
                  <td
                    className={classNames("day-column", {"day-of-previous-month": date.getMonth() != currentDate.getMonth()})}
                    key={`day-${dayNumber}`}
                  >
                    {date.getDate()}
                  </td>
                )}
              </WeekRow>
            )}
          </tbody>
        </table>
      </div>
    )
  }

  currentWeekNumber = () => this.weekNumberForDate(digg(this, "state", "currentDate"))
  isWeekActive(date) {
    const {activeDates, pickWeek} = digs(this.props, "activeDates", "pickWeek")
    const dateWeekNumber = this.weekNumberForDate(date)

    if (!pickWeek || !activeDates) return false

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

    const {currentDate} = digs(this.state, "currentDate")
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

    const {currentDate} = digs(this.state, "currentDate")
    const newCurrentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)

    this.setState({currentDate: newCurrentDate})
  }

  onSelectWeek = ({e, weekDate, weekNumber}) => {
    const {onSelectWeek, pickWeek} = digs(this.props, "onSelectWeek", "pickWeek")

    if (!pickWeek || !onSelectWeek) return
    if (!this.isWeekAvailable(weekDate)) return

    e.preventDefault()

    onSelectWeek({weekDate, weekNumber})
  }

  weekDays() {
    const {currentDate} = digs(this.state, "currentDate")
    const firstDayOfWeek = this.firstDayOfWeek()
    const daysInLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate() + 1
    const result = []

    for (let i = 0; i < 7; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, daysInLastMonth - firstDayOfWeek + i + 1)

      result.push({
        dayNumber: i,
        date
      })
    }

    return result
  }

  firstDay = () => new Date(this.state.currentDate.getFullYear(), this.state.currentDate.getMonth(), 1)
  firstDayOfWeek = () => this.firstDay().getDay()
  lastDay = () => new Date(this.state.currentDate.getFullYear(), this.state.currentDate.getMonth() + 1, 0)
  weekNumberForDate = (date) => moment(date).isoWeek()

  weeksInMonth = () => {
    const {currentDate} = digs(this.state, "currentDate")
    const weeks = []
    let dayCount = 1
    let dateCount = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayCount)

    while (dateCount.getMonth() == currentDate.getMonth()) {
      const weekNumber = this.weekNumberForDate(dateCount)
      const daysInWeek = []
      const startWeekDay = (weekNumber - 1) * 7 + 1

      for (let i = 0; i < 7; i++) {
        const weekDayInYear = startWeekDay + i
        const weekDate = new Date(currentDate.getFullYear(), 0, weekDayInYear + 2)

        daysInWeek.push({
          date: weekDate,
          dayNumber: i
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
}
