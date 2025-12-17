import PropTypes from "prop-types"
import propTypesExact from "prop-types-exact"
import React, {memo, useMemo} from "react"
import {shapeComponent, ShapeComponent} from "set-state-compare/build/shape-component"
import {Row} from "../table"

export default memo(shapeComponent(class WeekRow extends ShapeComponent {
  static propTypes = propTypesExact({
    children: PropTypes.node,
    dataSet: PropTypes.object,
    mode: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    weekActive: PropTypes.bool.isRequired,
    weekAvailable: PropTypes.bool.isRequired,
    weekDate: PropTypes.instanceOf(Date),
    weekNumber: PropTypes.number
  })

  setup() {
    this.useStates({pointerOver: false})
  }

  render() {
    const {dataSet, mode, onClick, weekActive, weekAvailable, weekDate, weekNumber, ...restProps} = this.props
    const actualDataSet = useMemo(() => {
      return Object.assign(
        {
          class: "week-row",
          activeWeek: weekActive,
          weekAvailable: weekAvailable,
          weekNumber
        },
        dataSet
      )
    }, [dataSet, weekActive, weekAvailable, weekNumber])

    const style = useMemo(() => {
      const style = {}

      if (mode == "week") {
        if (weekAvailable) {
          style.cursor = "pointer"
        } else {
          style.cursor = "not-allowed"
        }
      }

      if (mode == "week" && this.s.pointerOver) {
        style.backgroundColor = "#f1f3f4"
      }

      if (weekActive) {
        style.backgroundColor = "#039be5"
        style.color = "#fff"
      }

      return style
    }, [mode, weekActive, weekAvailable, this.s.pointerOver])

    return (
      <Row
        dataSet={actualDataSet}
        onClick={this.tt.onSelectWeek}
        onPointerEnter={this.tt.onPointerEnter}
        onPointerLeave={this.tt.onPointerLeave}
        style={style}
        {...restProps}
      />
    )
  }

  onPointerEnter = () => this.setState({pointerOver: true})
  onPointerLeave = () => this.setState({pointerOver: false})

  onSelectWeek = (e) => {
    const {weekDate, weekNumber} = this.p

    this.props.onClick({e, weekDate, weekNumber})
  }
}))