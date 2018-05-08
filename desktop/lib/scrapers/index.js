'use strict'

const Promise = require('bluebird')

const getAlliantBallances = require('./alliant-scraper')
const getWellsFargoBalances = require('./wellsfargo-scraper')
const ipc = require('../ipc')
const util = require('../util')

const getBankBalances = () => {
  return Promise.all([getAlliantBallances(), getWellsFargoBalances()])
  .spread((alliant, wellsFargo) => {
    ipc.sendInfo('Alliant balances', util.formatBalances(alliant))
    ipc.sendInfo('Wells Fargo balances', util.formatBalances(wellsFargo))
    return {
      checkingBalance: alliant.checkingBalance,
      savingsBalance: util.sumMoney(
        alliant.savingsBalance,
        wellsFargo.checkingBalance,
        wellsFargo.savingsBalance
      ),
    }
  })
}

module.exports = {
  getBankBalances,

  getAmexBillingInfo: require('./amex-scraper'),
  getAquaBillingInfo: require('./aqua-scraper'),
  getCitiMcBillingInfo: require('./citi-scraper').bind(null, 'mc'),
  getCitiVisaBillingInfo: require('./citi-scraper').bind(null, 'visa'),
  getDiscoverBillingInfo: require('./discover-scraper'),
  getPecoBillingInfo: require('./peco-scraper'),
}
