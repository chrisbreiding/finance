'use strict'

const { app } = require('electron')

const getWellsFargoBalances = require('./wellsfargo-scraper')

// prevent default behavior of quitting when windows are all closed
app.on('window-all-closed', () => {})

module.exports = {
  getWellsFargoBalances,
}
