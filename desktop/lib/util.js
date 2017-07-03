'use strict'

const chalk = require('chalk')

const isDev = process.env.NODE_ENV === 'development'
const isDebug = !!process.env.DEBUG

function toColor (color, args) {
  return args.map((arg) => typeof arg === 'string' ? chalk[color](arg) : arg)
}

function log (...args) {
  console.log(...args) // eslint-disable-line no-console
}

function logInfo (...args) {
  console.log(...toColor('cyan', args)) // eslint-disable-line no-console
}

function logError (...args) {
  console.error(...toColor('red', args)) // eslint-disable-line no-console
}

module.exports = {
  isDev,
  isDebug,
  log,
  logInfo,
  logError,
}
