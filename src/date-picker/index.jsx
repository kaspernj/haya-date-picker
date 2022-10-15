import "./style"
import classNames from "classnames"
import {digs} from "diggerize"
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
    activeWeek: undefined,
    currentDate: new Date(),
    onSelectWeek: undefined,
    pickWeek: false
  }

  static propTypes = {
    activeWeek: PropTypes.number,
    className: PropTypes.string,
    currentDate: PropTypes.instanceOf(Date).isRequired,
    onSelectWeek: PropTypes.func,
    pickWeek: PropTypes.bool.isRequired
  }

  render() {
    const {activeWeek, className, currentDate, onSelectWeek, pickWeek, ...restProps} = this.props

    return (
      <div className={classNames("haya-date-picker", className)} {...restProps}>
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
              <WeekRow data-active-week={weekNumber == activeWeek} key={`week-${weekNumber}`} onClick={digg(this, "onSelectWeek")} weekDate={date} weekNumber={weekNumber}>
                <td>
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

  onSelectWeek = ({e, weekDate, weekNumber}) => {
    const {onSelectWeek, pickWeek} = digs(this.props, "onSelectWeek", "pickWeek")

    if (!pickWeek || !onSelectWeek) return

    e.preventDefault()

    onSelectWeek({weekDate, weekNumber})
  }

  weekDays() {
    const {currentDate} = digs(this.props, "currentDate")
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

  daysUntilFirstDayOfWeek = () => {
    const {currentDate} = digs(this.props, "currentDate")
    const firstDayOfWeek = this.firstDayOfWeek()
    const daysInLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate() + 1
    const result = []

    for (let i = 0; i < this.firstDayOfWeek() - 1; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, daysInLastMonth - firstDayOfWeek + i + 1)

      result.push({
        dayNumber: i,
        date
      })
    }

    return result
  }

  daysInFirstWeek() {
    const {currentDate} = digs(this.props, "currentDate")
    const firstDay = this.firstDay()
    const firstDayOfWeek = this.firstDayOfWeek()
    const result = []

    for (let i = this.firstDayOfWeek(); i <= 7; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), firstDay.getDate() - firstDayOfWeek + i)

      result.push({
        dayNumber: i,
        date
      })
    }

    return result
  }

  firstDay = () => new Date(this.props.currentDate.getFullYear(), this.props.currentDate.getMonth(), 1)
  firstDayOfWeek = () => this.firstDay().getDay()
  lastDay = () => new Date(this.props.currentDate.getFullYear(), this.props.currentDate.getMonth() + 1, 0)

  weekNumberForDate = (date) => {
    let dayCount = 1
    let dateCount = new Date(date.getFullYear(), 0, dayCount)

    while (dateCount < date) {
      dayCount += 7
      dateCount = new Date(date.getFullYear(), 0, dayCount)
    }

    return Math.floor(dayCount / 7)
  }

  currentWeekNumber = () => this.weekNumberForDate(digg(this, "props", "currentDate"))

  weeksInMonth = () => {
    const {currentDate} = digs(this.props, "currentDate")
    const weeks = []
    let dayCount = 1
    let dateCount = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayCount)


    while (dateCount.getMonth() < currentDate.getMonth() + 1) {
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
