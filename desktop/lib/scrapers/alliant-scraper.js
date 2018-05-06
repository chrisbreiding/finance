'use strict'

const scraper = require('./scraper')

module.exports = () => {
  return scraper.scrape({
    url: 'https://www.alliantcreditunion.com/OnlineBanking/Login.aspx',
    prefix: 'alliant',
    suffix: 'balances',
  })
}
