const _ = require('lodash')
const chalk = require('chalk')

function toColor (color, args) {
  return _.map(args, (arg) => _.isString(arg) ? chalk[color](arg) : arg)
}

module.exports = {
  log (...args) {
    console.log(...args)
  },

  logInfo (...args) {
    console.log(...toColor('cyan', args))
  },

  logError (...args) {
    console.error(...toColor('red', args))
  },
}
