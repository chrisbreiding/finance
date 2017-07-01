'use strict'

const { app } = require('electron')

const getAmexBillingInfo = require('./amex-scraper')
const getAquaBillingInfo = require('./aqua-scraper')
const getCitiBillingInfo = require('./citi-scraper')
const getDiscoverBillingInfo = require('./discover-scraper')
const getPecoBillingInfo = require('./peco-scraper')
const getWellsFargoBalances = require('./wellsfargo-scraper')

// prevent default behavior of quitting when windows are all closed
app.on('window-all-closed', () => {})

module.exports = {
  getAmexBillingInfo,
  getAquaBillingInfo,
  getCitiMcBillingInfo: getCitiBillingInfo.bind(null, 'mc'),
  getCitiVisaBillingInfo: getCitiBillingInfo.bind(null, 'visa'),
  getDiscoverBillingInfo,
  getPecoBillingInfo,
  getWellsFargoBalances,
}
