'use strict'

const moment = require('moment')
const scraper = require('./scraper')

module.exports = (type) => {
  return scraper.scrape({
    url: 'https://online.citi.com/US/login.do',
    prefix: `citi-${type}`,
    suffix: 'billing',
  })
  .then((billingInfo) => {
    if (billingInfo) {
      billingInfo.date = moment(billingInfo.date, 'MMM. D, YYYY')
    }
    return billingInfo
  })
}
