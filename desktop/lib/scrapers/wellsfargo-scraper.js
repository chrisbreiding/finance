'use strict'

const scraper = require('./scraper')

module.exports = () => {
  return scraper.scrape({
    url: 'https://www.wellsfargo.com',
    prefix: 'wellsfargo',
    suffix: 'balances',
  })
}
