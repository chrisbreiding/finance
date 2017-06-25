const Promise = require('bluebird')

const GET_EL_TIMEOUT = 10000

module.exports = {
  // resolve $el if found, otherwise try again in 100ms
  // until GET_EL_TIMEOUT is reached
  ensureElement (getEl) {
    return new Promise((resolve) => {
      function get () {
        const $el = getEl()
        console.log('-- try:', $el.length)
        if ($el.length) {
          resolve($el)
        } else {
          setTimeout(get, 100)
        }
      }
      get()
    })
    .timeout(GET_EL_TIMEOUT)
  },
}
