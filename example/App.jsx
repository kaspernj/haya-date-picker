import Text from "@kaspernj/api-maker/build/utils/text"
import React, {memo, useCallback, useEffect, useMemo, useState} from "react"
import {Platform, ScrollView, View} from "react-native"
import SystemTestBrowserHelper from "system-testing/build/system-test-browser-helper.js"
import strftime from "strftime"

import DatePicker from "../src/date-picker/index.jsx"

const styles = {}
const dataSets = {}
const baseDate = new Date(2024, 0, 15)

/**
 * @param {Date} date
 * @returns {string}
 */
const formatDate = (date) => strftime("%Y-%m-%d", date)

const App = memo(function App() {
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedWeek, setSelectedWeek] = useState(null)
  const [selectedRange, setSelectedRange] = useState({fromDate: null, toDate: null})

  useEffect(() => {
    if (Platform.OS !== "web" || typeof window === "undefined") return

    const params = new URLSearchParams(window.location.search)
    if (params.get("systemTest") !== "true") return

    const helper = new SystemTestBrowserHelper()
    helper.enableOnBrowser()
  }, [])

  const onDateSelect = useCallback(({date}) => {
    setSelectedDate(date)
  }, [])

  const onRangeSelect = useCallback(({fromDate, toDate}) => {
    setSelectedRange({fromDate, toDate})
  }, [])

  const onWeekSelect = useCallback(({weekDate}) => {
    setSelectedWeek(weekDate)
  }, [])

  const selectedDateText = useMemo(() => {
    if (!selectedDate) return ""

    return formatDate(selectedDate)
  }, [selectedDate])

  const selectedRangeText = useMemo(() => {
    if (!selectedRange.fromDate || !selectedRange.toDate) return ""

    return `${formatDate(selectedRange.fromDate)} - ${formatDate(selectedRange.toDate)}`
  }, [selectedRange.fromDate, selectedRange.toDate])

  const selectedWeekText = useMemo(() => {
    if (!selectedWeek) return ""

    return formatDate(selectedWeek)
  }, [selectedWeek])

  const activeWeekDates = useMemo(() => (selectedWeek ? [selectedWeek] : []), [selectedWeek])

  const containerStyle = styles.container ||= {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: 16
  }

  const cardStyle = styles.card ||= {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 20
  }

  const valueStyle = styles.value ||= {
    marginTop: 12,
    fontSize: 14
  }

  return (
    <View
      dataSet={dataSets.systemTestingComponent ||= {focussed: "true"}}
      style={containerStyle}
      testID="systemTestingComponent"
    >
      <ScrollView>
        <Text
          style={styles.blankText ||= {height: 1, opacity: 0.01, width: 1}}
          testID="blankText"
        >
          {" "}
        </Text>
        <View
          style={cardStyle}
          testID="datePickerDateRoot"
        >
          <DatePicker
            defaultCurrentDate={baseDate}
            mode="date"
            onSelect={onDateSelect}
          />
          <Text
            style={valueStyle}
            testID="datePickerDateValue"
          >
            {selectedDateText}
          </Text>
        </View>
        <View
          style={cardStyle}
          testID="datePickerRangeRoot"
        >
          <DatePicker
            defaultCurrentDate={baseDate}
            mode="dateRange"
            onSelect={onRangeSelect}
          />
          <Text
            style={valueStyle}
            testID="datePickerRangeValue"
          >
            {selectedRangeText}
          </Text>
        </View>
        <View
          style={cardStyle}
          testID="datePickerWeekRoot"
        >
          <DatePicker
            activeDates={activeWeekDates}
            defaultCurrentDate={baseDate}
            mode="week"
            onSelect={onWeekSelect}
          />
          <Text
            style={valueStyle}
            testID="datePickerWeekValue"
          >
            {selectedWeekText}
          </Text>
        </View>
      </ScrollView>
    </View>
  )
})

export default App
