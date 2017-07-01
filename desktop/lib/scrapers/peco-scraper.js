'use strict'

const moment = require('moment')
const scraper = require('./scraper')

module.exports = () => {
  return scraper.scrape({
    url: 'https://secure.peco.com/Pages/Login.aspx',
    prefix: 'peco',
    suffix: 'billing',
  })
  .then((billingInfo) => {
    if (billingInfo) {
      billingInfo.date = moment(billingInfo.date, 'MM/DD/YYYY')
    }
    return billingInfo
  })
}
