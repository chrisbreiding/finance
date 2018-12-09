'use strict'
const debug = require('debug')('finance:alliant')

const scraper = require('./scraper')

module.exports = () => {
  debug('scraping')

  return scraper.scrape({
    url: 'https://www.alliantcreditunion.com/OnlineBanking/Login.aspx',
    prefix: 'alliant',
    suffix: 'balances',
  })
  .tap((result) => {
    debug('succeeded scraping', result)
  })
}
