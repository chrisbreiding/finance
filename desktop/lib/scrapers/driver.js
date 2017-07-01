const Promise = require('bluebird')

const GET_EL_TIMEOUT = 10000

module.exports = {
  // resolve $el if found, otherwise try again in 100ms
  // until GET_EL_TIMEOUT is reached
  ensure (check) {
    return new Promise((resolve) => {
      function test () {
        if (check()) {
          resolve()
        } else {
          setTimeout(test, 100)
        }
      }
      test()
    })
    .timeout(GET_EL_TIMEOUT)
  },
}
