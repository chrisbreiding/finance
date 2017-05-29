const _ = require('lodash')
const path = require('path')
const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs-extra'))

const util = require('./util')

const dbPath = path.join(__dirname, 'data.json')

function read () {
  return fs.readJsonAsync(dbPath)
  .catch((error) => {
    util.logError('Error reading data.json')
    throw error
  })
}

function write (data) {
  return fs.outputJsonAsync(dbPath, data, { spaces: 2 })
  .catch((error) => {
    util.logError('Error writing data.json')
    throw error
  })
}

function fetchProps (...props) {
  return read().then((data) => {
    return _.pick(data, props)
  })
}

function saveProps (props) {
  return read().then((data) => {
    return write(_.extend(data, props))
  })
}

module.exports = {
  fetchCredentials () {
    return fetchProps('username', 'password')
  },

  fetchBalances () {
    return fetchProps('checkingBalance', 'savingsBalance', 'lastUpdated')
  },

  saveBalances (balances) {
    const data = _.extend({}, balances, {
      lastUpdated: new Date().toISOString(),
    })
    return saveProps(data).return(data)
  },
}
