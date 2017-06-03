import _ from 'lodash'
import { format } from 'currency-formatter'

function format$ (amount) {
  return format(amount, { code: 'USD' }).replace(/\.\d+$/, '')
}

function newId (itemsWithIds) {
  return (_(itemsWithIds).map('id').sort().last() || 0) + 1
}

export default {
  format$,
  newId,
}
