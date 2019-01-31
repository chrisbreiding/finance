'use strict'

const _ = require('lodash')
const chalk = require('chalk')
const Store = require('electron-store')
const homedir = require('homedir')()
const moment = require('moment')

const appName = require('../package').productName

const timeout = 30000 // 30 seconds
const isDev = process.env.NODE_ENV === 'development'

const store = new Store()

function isBrowserDebug () {
  return !!process.env.DEBUG_BROWSER || !!getSetting('debug:browser')
}

function isDebug () {
  return !!process.env.DEBUG
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

function formatRewards ({ amex, citiMc, citiVisa, discover }) {
  return {
    'Amex': amex,
    'Citi MC': citiMc,
    'Citi Visa': citiVisa,
    'Discover': discover,
  }
}

function sumMoney (...amounts) {
  const summables = _.map(amounts, (amount) => amount * 100)
  return _.sum(summables) / 100
}

function getWindowSettings () {
  return store.get('window') || {
    width: 600,
    height: (isDev ? 700 : 400),
  }
}

function updateWindowSettings (newSettings) {
  store.set('window', _.extend(getWindowSettings(), newSettings))
}

function getSetting (key) {
  return store.get(key)
}

function setSetting (key, value) {
  store.set(key, value)
}

const tildeify = (path) => {
  return path.replace(homedir, '~')
}

const durationToPhrase = (ms) => {
  const duration = moment.duration(ms)
  if (ms < 60000) {
    return `${duration.seconds()}s`
  } else {
    const minutes = duration.asMinutes()
    const seconds = _.isInteger(minutes) ? '' : `${duration.subtract(minutes, 'm').seconds()}s`
    return `${minutes}m ${seconds}`
  }
}

const timedOutError = (message) => {
  const error = new Error(message)
  error.timedOut = true
  return error
}

let alerts = 0

const addAlert = () => {
  alerts++
}

const removeAlert = () => {
  alerts--
  if (alerts < 0) alerts = 0
}

const getAlerts = () => alerts

module.exports = {
  appName,
  timeout,
  isDev,
  isBrowserDebug,
  isDebug,
  log,
  logInfo,
  logError,
  formatBalances,
  formatRewards,
  sumMoney,
  getWindowSettings,
  updateWindowSettings,
  getSetting,
  setSetting,
  tildeify,
  durationToPhrase,
  timedOutError,

  addAlert,
  removeAlert,
  getAlerts,
}
