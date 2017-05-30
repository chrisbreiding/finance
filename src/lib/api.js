import _ from 'lodash'

import ipc from './ipc'

const fetchData = () => {
  return ipc('fetch:data')
}

const saveData = _.debounce((data) => {
  return ipc('save:data', data)
}, 500)

const refreshBalances = () => {
  return ipc('refresh:balances')
}

export default {
  fetchData,
  saveData,
  refreshBalances,
}
