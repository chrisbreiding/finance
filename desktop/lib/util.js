'use strict'

const _ = require('lodash')
const chalk = require('chalk')
const Config = require('electron-config')
const homedir = require('homedir')()

const appName = require('../package').productName

const isDev = process.env.NODE_ENV === 'development'

const config = new Config()

function isDebug () {
  return !!process.env.DEBUG || !!getSetting('debug')
}

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

function formatBalances ({ savingsBalance, checkingBalance }) {
  return {
    'Savings': savingsBalance,
    'Checking': checkingBalance,
  }
}

function sumMoney (...amounts) {
  const summables = _.map(amounts, (amount) => amount * 100)
  return _.sum(summables) / 100
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

function getSetting (key) {
  return config.get(key)
}

function setSetting (key, value) {
  config.set(key, value)
}

const tildeify = (path) => {
  return path.replace(homedir, '~')
}

module.exports = {
  appName,
  isDev,
  isDebug,
  log,
  logInfo,
  logError,
  formatBalances,
  sumMoney,
  getWindowSettings,
  updateWindowSettings,
  getSetting,
  setSetting,
  tildeify,
}
