'use strict'

const _ = require('lodash')
const chalk = require('chalk')

function toColor (color, args) {
  return _.map(args, (arg) => _.isString(arg) ? chalk[color](arg) : arg)
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
