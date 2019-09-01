import _ from 'lodash'
import { format } from 'currency-formatter'

function ensureNumber (numberString = '') {
  if (typeof numberString === 'number') return numberString
  if (typeof numberString !== 'string') return 0

  numberString = numberString.replace(/[^0-9\.]/g, '')
  const maybeNumber = Number(numberString)
  return isNaN(maybeNumber) ? 0 : maybeNumber
}

function format$ (amount) {
  return format(amount, { code: 'USD' }).replace(/\.\d+$/, '')
}

function nextNumber (items, property) {
  if (!items.length) return 0

  return Math.max(..._.map(items, property)) + 1
}

function percentToAmount (total, percent) {
  return toTwoDecimals(total * (percent / 100))
}

function rounded (amount, max = Infinity, barMax = 0) {
  if (amount < 0) return 0

  const roundToNearest = (
    barMax > 20000 ? 100 :
      barMax > 5000 ? 50 :
        10
  )
  const roundedAmount = Math.round(amount / roundToNearest) * roundToNearest
  return roundedAmount > max ? max : roundedAmount
}

function toTwoDecimals (amount) {
  return Number((amount).toFixed(2))
}

export default {
  ensureNumber,
  format$,
  nextNumber,
  percentToAmount,
  rounded,
  toTwoDecimals,
}
