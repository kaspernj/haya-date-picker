import PropTypes from "prop-types"
import propTypesExact from "prop-types-exact"
import {memo} from "react"
import {Row} from "../table"
import {ShapeComponent} from "set-state-compare/src/shape-component"

export default memo(shapeComponent(class WeekRow extends ShapeComponent {
  static propTypes = propTypesExact({
    children: PropTypes.node,
    dataSet: PropTypes.object,
    onClick: PropTypes.func,
    pickWeek: PropTypes.bool.isRequired,
    weekActive: PropTypes.bool.isRequired,
    weekAvailable: PropTypes.bool.isRequired,
    weekDate: PropTypes.instanceOf(Date),
    weekNumber: PropTypes.number
  })

  setup() {
    this.useStates({pointerOver: false})
  }

  render() {
    const {dataSet, onClick, pickWeek, weekActive, weekAvailable, weekDate, weekNumber, ...restProps} = this.props
    const actualDataSet = Object.assign(
      {
        class: "week-row",
        activeWeek: weekActive,
        weekAvailable: weekAvailable,
        weekNumber
      },
      dataSet
    )

    const style = {}

    if (pickWeek) {
      if (weekAvailable) {
        style.cursor = "pointer"
      } else {
        style.cursor = "not-allowed"
      }
    }

    if (pickWeek && this.s.pointerOver) {
      style.backgroundColor = "#f1f3f4"
    }

    if (weekActive) {
      style.backgroundColor = "#039be5"
      style.color = "#fff"
    }

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