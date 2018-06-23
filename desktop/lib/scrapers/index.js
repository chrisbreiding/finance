'use strict'

module.exports = {
  getBankBalances: require('./alliant-scraper'),

  getAmexBillingInfo: require('./amex-scraper'),
  getAquaBillingInfo: require('./aqua-scraper'),
  getCitiMcBillingInfo: require('./citi-scraper').bind(null, 'mc'),
  getCitiVisaBillingInfo: require('./citi-scraper').bind(null, 'visa'),
  getDiscoverBillingInfo: require('./discover-scraper'),
  getPecoBillingInfo: require('./peco-scraper'),
}
