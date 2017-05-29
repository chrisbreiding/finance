'use strict'

const _ = require('lodash')
const chalk = require('chalk')
const Config = require('electron-config')

const appName = require('../package').productName

const config = new Config()
const isDev = process.env.NODE_ENV === 'development'

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

function getWindowSettings () {
  return config.get('window') || {
    width: 600,
    height: (isDev ? 700 : 400),
  }
}

function updateWindowSettings (newSettings) {
  config.set('window', _.extend(getWindowSettings(), newSettings))
}

module.exports = {
  appName,
  isDev,

  log,
  logInfo,
  logError,

  getWindowSettings,
  updateWindowSettings,
}
