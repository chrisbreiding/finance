'use strict'
const Promise = require('bluebird')

function getRewards () {
  const invoke = (fn) => fn()

  return Promise.map([
    require('./amex-scraper'),
    require('./citi-scraper').bind(null, 'mc'),
    require('./citi-scraper').bind(null, 'visa'),
    require('./discover-scraper'),
  ], invoke, { concurrency: 1 })
  .spread((amex, citiMc, citiVisa, discover) => {
    return {
      amex: amex.rewardsAmount,
      citiMc: citiMc.rewardsAmount,
      citiVisa: citiVisa.rewardsAmount,
      discover: discover.rewardsAmount,
    }
  })
}

module.exports = {
  getBankBalances: require('./alliant-scraper'),
  getRewards,

  getAmexInfo: require('./amex-scraper'),
  getAquaInfo: require('./aqua-scraper'),
  getCitiMcInfo: require('./citi-scraper').bind(null, 'mc'),
  getCitiVisaInfo: require('./citi-scraper').bind(null, 'visa'),
  getDiscoverInfo: require('./discover-scraper'),
  getPecoInfo: require('./peco-scraper'),
}
