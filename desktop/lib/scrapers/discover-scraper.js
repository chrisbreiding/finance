'use strict'
const debug = require('debug')('finance:discover')

// const moment = require('moment')
const scraper = require('./scraper')

module.exports = () => {
  debug('scraping')

  return scraper.scrape({
    url: 'https://www.discover.com/',
    prefix: 'discover',
    suffix: 'info',
  })
  .tap((result) => {
    debug('succeeded scraping', result)
  })
  // .then((billingInfo) => {
  //   if (billingInfo) {
  //     billingInfo.date = moment(billingInfo.date, 'MM/DD/YYYY').date(17)
  //   }
  //   return billingInfo
  // })
}
