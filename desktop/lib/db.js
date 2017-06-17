'use strict'

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

module.exports = {
  fetchCredentials (account) {
    return read().then((data) => {
      return data[account] || {}
    })
  },
}
