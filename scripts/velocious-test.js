#!/usr/bin/env node

const fs = require("node:fs")
const path = require("node:path")

const INCLUDE_TAG_FLAGS = new Set(["--tag", "--include-tag", "-t"])
const EXCLUDE_TAG_FLAGS = new Set(["--exclude-tag", "--skip-tag", "-x"])

/**
 * @param {string} value
 * @returns {string[]}
 */
const splitTags = (value) => {
  if (!value) return []

  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
}

/**
 * @param {string[]} processArgs
 * @returns {{includeTags: string[], excludeTags: string[], filteredProcessArgs: string[]}}
 */
const parseTagFilters = (processArgs) => {
  const includeTags = []
  const excludeTags = []
  const filteredProcessArgs = processArgs.length > 0 ? [processArgs[0]] : []
  let inRestArgs = false

  for (let i = 1; i < processArgs.length; i++) {
    const arg = processArgs[i]

    if (arg === "--") {
      inRestArgs = true
      filteredProcessArgs.push(arg)
      continue
    }

    if (!inRestArgs) {
      if (INCLUDE_TAG_FLAGS.has(arg)) {
        const nextValue = processArgs[i + 1]

        if (nextValue && !nextValue.startsWith("-")) {
          includeTags.push(...splitTags(nextValue))
          i++
        }

        continue
      }

      if (EXCLUDE_TAG_FLAGS.has(arg)) {
        const nextValue = processArgs[i + 1]

        if (nextValue && !nextValue.startsWith("-")) {
          excludeTags.push(...splitTags(nextValue))
          i++
        }

        continue
      }

      if (arg.startsWith("--tag=")) {
        includeTags.push(...splitTags(arg.slice("--tag=".length)))
        continue
      }

      if (arg.startsWith("--include-tag=")) {
        includeTags.push(...splitTags(arg.slice("--include-tag=".length)))
        continue
      }

      if (arg.startsWith("--exclude-tag=")) {
        excludeTags.push(...splitTags(arg.slice("--exclude-tag=".length)))
        continue
      }

      if (arg.startsWith("--skip-tag=")) {
        excludeTags.push(...splitTags(arg.slice("--skip-tag=".length)))
        continue
      }
    }

    filteredProcessArgs.push(arg)
  }

  return {
    includeTags: Array.from(new Set(includeTags)),
    excludeTags: Array.from(new Set(excludeTags)),
    filteredProcessArgs
  }
}

/** @returns {Promise<void>} */
const main = async () => {
  const [
    {default: Configuration},
    {default: EnvironmentHandlerNode},
    {default: TestFilesFinder},
    {default: TestRunner},
    {default: SqliteDriver},
    {default: AsyncTrackedPool}
  ] = await Promise.all([
    import("velocious/build/src/configuration.js"),
    import("velocious/build/src/environment-handlers/node.js"),
    import("velocious/build/src/testing/test-files-finder.js"),
    import("velocious/build/src/testing/test-runner.js"),
    import("velocious/build/src/database/drivers/sqlite/index.js"),
    import("velocious/build/src/database/pool/async-tracked-multi-connection.js")
  ])

  const rootDir = process.cwd()
  const dbDir = path.join(rootDir, "db")

  fs.mkdirSync(dbDir, {recursive: true})

  const databaseConfig = {
    driver: SqliteDriver,
    name: "haya-date-picker-test",
    poolType: AsyncTrackedPool,
    type: "sqlite"
  }

  const configuration = new Configuration({
    database: {
      development: {
        default: databaseConfig
      },
      test: {
        default: databaseConfig
      }
    },
    directory: rootDir,
    environmentHandler: new EnvironmentHandlerNode()
  })

  configuration.setEnvironment("test")
  configuration.setCurrent()

  const processArgs = process.argv.slice(2)
  let directory
  const directories = []

  if (process.env.VELOCIOUS_TEST_DIR) {
    directory = process.env.VELOCIOUS_TEST_DIR
    directories.push(process.env.VELOCIOUS_TEST_DIR)
  } else {
    directory = process.cwd()
    directories.push(path.join(process.cwd(), "__tests__"))
    directories.push(path.join(process.cwd(), "tests"))
    directories.push(path.join(process.cwd(), "spec"))
  }

  const {includeTags, excludeTags, filteredProcessArgs} = parseTagFilters(processArgs)
  const testFilesFinder = new TestFilesFinder({
    directory,
    directories,
    processArgs: filteredProcessArgs
  })
  const testFiles = await testFilesFinder.findTestFiles()
  const testRunner = new TestRunner({configuration, excludeTags, includeTags, testFiles})

  let signalHandled = false
  const handleSignal = async (signal) => {
    if (signalHandled) return

    signalHandled = true
    console.error(`\nReceived ${signal}, running afterAll hooks before exit...`)

    try {
      await testRunner.runAfterAllsForActiveScopes()
    } catch (error) {
      console.error("Failed while running afterAll hooks:", error)
    } finally {
      process.exit(130)
    }
  }

  process.once("SIGINT", () => {
    void handleSignal("SIGINT")
  })
  process.once("SIGTERM", () => {
    void handleSignal("SIGTERM")
  })

  await testRunner.prepare()

  if (testRunner.getTestsCount() === 0) {
    throw new Error(`${testRunner.getTestsCount()} tests was found in ${testFiles.length} file(s)`)
  }

  await testRunner.run()

  const executedTests = testRunner.getExecutedTestsCount()

  if ((includeTags.length > 0 || excludeTags.length > 0) && executedTests === 0) {
    console.error("\nNo tests matched the provided tag filters")
    process.exit(1)
  }

  if (testRunner.isFailed()) {
    console.error(
      `\nTest run failed with ${testRunner.getFailedTests()} failed tests and ${testRunner.getSuccessfulTests()} successfull`
    )
    process.exit(1)
  } else if (testRunner.areAnyTestsFocussed()) {
    console.error(
      `\nFocussed run with ${testRunner.getFailedTests()} failed tests and ${testRunner.getSuccessfulTests()} successfull`
    )
    process.exit(1)
  } else {
    console.log(`\nTest run succeeded with ${testRunner.getSuccessfulTests()} successful tests`)
    process.exit(0)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
