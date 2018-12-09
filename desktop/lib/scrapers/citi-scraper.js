'use strict'
const debug = require('debug')('finance:citi')

// const moment = require('moment')
const scraper = require('./scraper')

module.exports = (type) => {
  debug('scraping', type)

  return scraper.scrape({
    url: 'https://online.citi.com/US/login.do',
    prefix: `citi-${type}`,
    suffix: 'info',
  })
  .tap((result) => {
    debug('succeeded scraping', result)
  })
  // .then((info) => {
  //   if (info) {
  //     const date = type === 'mc' ? 21 : 22
  //     info.date = moment(info.date, 'MMM. D, YYYY').date(date)
  //   }
  //   return info
  // })
}
