#!/usr/bin/env node

const {spawnSync} = require("node:child_process")

/**
 * @param {string} command
 * @param {string[]} args
 * @returns {{status: number, stdout: string, stderr: string}}
 */
function run(command, args) {
  const result = spawnSync(command, args, {encoding: "utf8", stdio: "pipe"})

  if (result.error) {
    throw result.error
  }

  if (result.status !== 0) {
    throw new Error(result.stderr || `Command failed: ${command} ${args.join(" ")}`)
  }

  return {
    status: result.status ?? 0,
    stdout: result.stdout || "",
    stderr: result.stderr || ""
  }
}

/**
 * @param {string} command
 * @param {string[]} args
 * @returns {number}
 */
function runQuiet(command, args) {
  const result = spawnSync(command, args, {encoding: "utf8", stdio: "ignore"})

  if (result.error) {
    throw result.error
  }

  return result.status ?? 0
}

/** @returns {void} */
function ensureCleanWorktree() {
  const result = run("git", ["status", "--porcelain"])

  if (result.stdout.trim()) {
    throw new Error("Working tree is dirty. Commit or stash changes before releasing.")
  }
}

/** @returns {void} */
function ensureNpmLogin() {
  const status = runQuiet("npm", ["whoami"])

  if (status !== 0) {
    run("npm", ["login"])
  }
}

/** @returns {void} */
function releasePatch() {
  ensureCleanWorktree()
  run("npm", ["version", "patch"])
  run("git", ["push", "origin", "HEAD"])
  run("git", ["push", "origin", "--tags"])
  ensureNpmLogin()
  run("npm", ["publish"])
}

releasePatch()
