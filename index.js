'use strict'

const { app } = require('electron')

const db = require('./lib/db')
const ipc = require('./lib/ipc')
const scrape = require('./lib/scrape')
const util = require('./lib/util')
const window = require('./lib/window')

app.on('activate', window.ensure)
app.on('ready', window.ensure)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipc.on('balances', (respond) => {
  db.fetchBalances()
  .then((data) => {
    respond(null, data)
  })
  .catch((error) => {
    util.logError('Error fetching balances:')
    util.logError(error.stack)
    respond(error.stack)
  })
})

ipc.on('refresh', (respond) => {
  scrape.getBalances()
  .timeout(10000)
  .then((balances) => {
    return db.saveBalances(balances)
  })
  .then((data) => {
    respond(null, data)
  })
  .catch((error) => {
    util.logError('Error refreshing balances:')
    util.logError(error.stack)
    respond(error.stack)
  })
})
