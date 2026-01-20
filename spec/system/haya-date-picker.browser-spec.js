import "velocious/build/src/testing/test.js"
import timeout from "awaitery/build/timeout.js"
import waitFor from "awaitery/build/wait-for.js"
import SystemTest from "system-testing/build/system-test.js"

SystemTest.rootPath = "/?systemTest=true"
const systemTestArgs = {
  debug: false,
  host: process.env.SYSTEM_TEST_APP_HOST || "localhost",
  port: process.env.SYSTEM_TEST_APP_PORT ? Number(process.env.SYSTEM_TEST_APP_PORT) : 8081,
  httpHost: process.env.SYSTEM_TEST_HTTP_HOST || "localhost",
  httpPort: process.env.SYSTEM_TEST_HTTP_PORT ? Number(process.env.SYSTEM_TEST_HTTP_PORT) : 1984
}
let didStartSystemTest = false

beforeAll(async () => {
  const systemTest = SystemTest.current(systemTestArgs)
  if (!systemTest.isStarted()) {
    await timeout({timeout: 90000}, async () => {
      await systemTest.start()
    })
    didStartSystemTest = true
  }
  systemTest.setBaseSelector("[data-testid='systemTestingComponent']")
})

afterAll(async () => {
  if (!didStartSystemTest) return

  await timeout({timeout: 120000}, async () => {
    await SystemTest.current().stop()
  })
})

/**
 * @param {SystemTest} systemTest
 * @param {string} rootTestId
 * @param {number} dateNumber
 * @returns {Promise<void>}
 */
const clickDate = async (systemTest, rootTestId, dateNumber) => {
  const scoundrel = await systemTest.getScoundrelClient()
  const rootSelector = `[data-testid='${rootTestId}']`
  const cellSelector = `${rootSelector} [data-class='day-column'][data-date='${dateNumber}']`

  await waitFor({timeout: 5000}, async () => {
    const clicked = await scoundrel.evalResult(`
      const root = document.querySelector(${JSON.stringify(rootSelector)})
      if (!root) return false

      const cell = root.querySelector(${JSON.stringify(cellSelector)})
      if (!cell) return false

      const target = cell.querySelector("[role='button']") ||
        cell.querySelector("button") ||
        cell.querySelector("div") ||
        cell

      target.click()
      return true
    `)

    if (!clicked) {
      throw new Error(`Unable to click date ${dateNumber} in ${rootTestId}`)
    }
  })
}

/**
 * @param {SystemTest} systemTest
 * @param {string} testId
 * @returns {Promise<string>}
 */
const textByTestId = async (systemTest, testId) => {
  const element = await systemTest.findByTestID(testId, {timeout: 5000})
  return (await element.getText()).trim()
}

describe("HayaDatePicker", () => {
  it("selects a date in date mode", async () => {
    await timeout({timeout: 90000}, async () => {
      await SystemTest.run(systemTestArgs, async (systemTest) => {
        await systemTest.findByTestID("datePickerDateRoot", {timeout: 60000})

        await clickDate(systemTest, "datePickerDateRoot", 16)

        await waitFor({timeout: 5000}, async () => {
          const valueText = await textByTestId(systemTest, "datePickerDateValue")

          if (valueText !== "2024-01-16") {
            throw new Error(`Unexpected date selection: ${valueText}`)
          }
        })
      })
    })
  })

  it("selects a range in dateRange mode", async () => {
    await timeout({timeout: 90000}, async () => {
      await SystemTest.run(systemTestArgs, async (systemTest) => {
        await systemTest.findByTestID("datePickerRangeRoot", {timeout: 60000})

        await clickDate(systemTest, "datePickerRangeRoot", 10)
        await clickDate(systemTest, "datePickerRangeRoot", 14)

        await waitFor({timeout: 5000}, async () => {
          const valueText = await textByTestId(systemTest, "datePickerRangeValue")

          if (valueText !== "2024-01-10 - 2024-01-14") {
            throw new Error(`Unexpected range selection: ${valueText}`)
          }
        })
      })
    })
  })

  it("selects a week in week mode", async () => {
    await timeout({timeout: 90000}, async () => {
      await SystemTest.run(systemTestArgs, async (systemTest) => {
        await systemTest.findByTestID("datePickerWeekRoot", {timeout: 60000})

        await systemTest.click("[data-testid='datePickerWeekRoot'] [data-class='week-row'][data-week-number='3']")

        await waitFor({timeout: 5000}, async () => {
          const valueText = await textByTestId(systemTest, "datePickerWeekValue")

          if (valueText !== "2024-01-15") {
            throw new Error(`Unexpected week selection: ${valueText}`)
          }
        })
      })
    })
  })
})
