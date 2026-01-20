#!/usr/bin/env node

const esbuild = require("esbuild")
const fs = require("node:fs/promises")
const path = require("node:path")

const distDir = path.join(process.cwd(), "dist")
const entryPoint = path.join(process.cwd(), "example", "index.jsx")
const htmlPath = path.join(process.cwd(), "example", "index.html")
const outputFile = path.join(distDir, "index.js")

/** @returns {Promise<void>} */
const buildExample = async () => {
  await fs.rm(distDir, {recursive: true, force: true})
  await fs.mkdir(distDir, {recursive: true})
  await fs.copyFile(htmlPath, path.join(distDir, "index.html"))

  await esbuild.build({
    entryPoints: [entryPoint],
    bundle: true,
    format: "esm",
    jsx: "automatic",
    outfile: outputFile,
    platform: "browser",
    sourcemap: true,
    target: "es2020",
    alias: {
      "react-native": "react-native-web"
    },
    define: {
      "process.env.NODE_ENV": '"production"'
    }
  })
}

buildExample().catch((error) => {
  console.error(error)
  process.exit(1)
})
