'use strict'
const debug = require('debug')('finance:amex')

// const moment = require('moment')
const scraper = require('./scraper')

module.exports = () => {
  debug('scraping')

  return scraper.scrape({
    url: 'https://global.americanexpress.com/myca/logon/us/action?request_type=LogLogoffHandler&Face=en_US',
    prefix: 'amex',
    suffix: 'info',
  })
  .tap((result) => {
    debug('succeeded scraping', result)
  })
  // .then((billingInfo) => {
  //   if (billingInfo) {
  //     billingInfo.date = moment(billingInfo.date, 'MMMM D').date(13)
  //   }
  //   return billingInfo
  // })
}
