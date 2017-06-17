'use strict'

const chalk = require('chalk')

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
  log,
  logInfo,
  logError,
}
