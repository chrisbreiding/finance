'use strict'

const moment = require('moment')
const scraper = require('./scraper')

module.exports = () => {
  return scraper.scrape({
    url: 'https://global.americanexpress.com/myca/logon/us/action?request_type=LogLogoffHandler&Face=en_US',
    prefix: 'amex',
    suffix: 'billing',
  })
  .then((billingInfo) => {
    if (billingInfo) {
      billingInfo.date = moment(billingInfo.date, 'MMMM D').date(13)
    }
    return billingInfo
  })
}
