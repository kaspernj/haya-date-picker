# haya-date-picker

React Native-friendly date picker with support for date, date range, and ISO week selection.

## Install

```sh
npm install haya-date-picker
```

```sh
yarn add haya-date-picker
```

```sh
pnpm add haya-date-picker
```

## Usage

The package ships compiled files under `build/`. Import the components you need from there.

### Date picker

```jsx
import React from "react"
import DatePicker from "haya-date-picker/build/date-picker"

export default function Example() {
  return (
    <DatePicker
      mode="date"
      defaultCurrentDate={new Date()}
      onSelect={({date}) => {
        console.log("Selected date", date)
      }}
    />
  )
}
```

### Date range input

`HayaDatePickerInput` renders a pressable field that opens the date picker in a modal and displays the chosen range.

```jsx
import React from "react"
import DatePickerInput from "haya-date-picker/build/date-picker/input"

export default function ExampleRangeInput() {
  const [range, setRange] = React.useState({dateFrom: null, dateTo: null})

  return (
    <DatePickerInput
      datePickerProps={{
        mode: "dateRange",
        dateFrom: range.dateFrom,
        dateTo: range.dateTo,
        onSelect: ({fromDate, toDate}) => setRange({dateFrom: fromDate, dateTo: toDate})
      }}
      styles={{
        view: {alignItems: "center"},
        text: {marginLeft: 8}
      }}
    />
  )
}
```

### ISO week selection

```jsx
import React from "react"
import DatePicker from "haya-date-picker/build/date-picker"

export default function ExampleWeekPicker() {
  return (
    <DatePicker
      mode="week"
      activeDates={[new Date()]}
      weeksAvailable={{
        2024: {
          1: true,
          2: true,
          3: true
        }
      }}
      onSelect={({weekDate}) => {
        console.log("Selected week date", weekDate)
      }}
    />
  )
}
```

## Props

### DatePicker

- `mode` (string, required): "date", "dateRange", or "week".
- `defaultCurrentDate` (Date, required): starting month for the calendar view.
- `onSelect` (function): callback for selection changes.
  - `mode="date"`: `({date})`.
  - `mode="dateRange"`: `({fromDate, toDate})` after two clicks.
  - `mode="week"`: `({weekDate})` when a week row is selected.
- `activeDates` (Date[]): used to highlight active weeks in week mode.
- `weeksAvailable` (object): map of `{[year]: {[isoWeekNumber]: truthy}}` to control which weeks are selectable.
- `className` (string): stored in the root `dataSet` for styling hooks.
- `dateFrom` / `dateTo` (Date): accepted props, used by the input wrapper for display.

### DatePickerInput

- `datePickerProps` (object, required): passed to `DatePicker`; `onSelect` is wrapped to close the modal.
- `styles` (object): optional styles `{view, text}` for the pressable field contents.

## Locale and translation

The date picker uses `toLocaleString` for month and weekday names. To change locale:

```js
import Config from "haya-date-picker/build/config"
import events from "haya-date-picker/build/events"

Config.current().setLocale("da-DK")
events.emit("localeChanged")
```

You can also inject a translation callback if you use `translate(msgID)` in your app:

```js
import Config from "haya-date-picker/build/config"

Config.current().setTranslate((msgID) => {
  return msgID
})
```

## Development

```sh
npm run build
npm run test:dist
npm run typecheck
npm run watch
```
