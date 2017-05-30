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

const sendResponse = (respond) => (data) => {
  respond(null, data)
}

const sendError = (respond, label) => (error) => {
  util.logError(label)
  util.logError(error.stack)
  respond(error)
}

ipc.on('fetch:data', (respond) => {
  db.fetchData()
  .then(sendResponse(respond))
  .catch(sendError(respond, 'Error fetching balances:'))
})

ipc.on('save:data', (respond, data) => {
  db.saveData(data)
  .then(sendResponse(respond))
  .catch(sendError(respond, 'Error fetching balances:'))
})

ipc.on('refresh:balances', (respond) => {
  scrape.getBalances()
  .timeout(10000)
  .then((balances) => {
    return db.saveBalances(balances)
  })
  .then(sendResponse(respond))
  .catch(sendError(respond, 'Error refreshing balances:'))
})
