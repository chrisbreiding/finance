const Promise = require('bluebird')

const browser = require('./browser')
const db = require('../db')
const util = require('../util')


module.exports = {
  scrape ({ prefix, suffix, url }) {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(util.timedOutError(`Getting ${prefix} ${suffix} timed out after ${util.durationToPhrase(util.timeout)}`))
      }, util.timeout)

      browser.bus.on(`get:${prefix}:credentials`, (event) => {
        db.fetchCredentials(prefix).then((credentials) => {
          event.sender.send(`${prefix}:credentials`, credentials)
        })
      })

      browser.bus.once(`${prefix}:${suffix}`, (event, err, data) => {
        browser.bus.removeAllListeners(`get:${prefix}:credentials`)
        browser.close(win).then(() => {
          if (err) {
            reject(Object.assign(new Error(), err))
          } else {
            resolve(data)
          }
        })
      })

      const win = browser.window({ preload: `${prefix}-driver.js` })

      browser.bus.on(`${prefix}:unexpected:page`, () => {
        clearTimeout(timeoutId)
        util.addAlert()
        win.show()
      })

      win.loadURL(url)
    })
  },
}
