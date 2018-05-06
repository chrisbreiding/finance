'use strict'

const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs-extra'))

const ipc = require('./ipc')
const util = require('./util')

function read () {
  const dbPath = util.getDataFile()

  if (!dbPath) {
    ipc.sendError('Error getting data', 'No data file path set')
    return
  }

  return fs.readJsonAsync(dbPath)
  .catch((err) => {
    ipc.sendErr(`Error reading data file (${util.tildeify(dbPath)})`, err)
  })
}

module.exports = {
  fetchCredentials (account) {
    return read().then((data) => {
      return data[account] || {}
    })
  },
}
