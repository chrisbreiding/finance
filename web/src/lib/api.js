import _ from 'lodash'
import Promise from 'bluebird'

import remoteStore from './remote-store'

const desktopBaseUrl = 'http://localhost:4193'

const authenticate = (apiKey = localStorage.apiKey) => {
  if (!apiKey) return Promise.reject(new Error(''))

  localStorage.apiKey = apiKey

  return remoteStore.auth(apiKey).catch((err) => {
    console.error('Failed to authenticate:') // eslint-disable-line no-console
    console.error(err) // eslint-disable-line no-console
    throw err
  })
}

const fetchData = () => {
  return remoteStore.fetch()
}

const saveData = _.debounce((data) => {
  return remoteStore.save(data)
}, 500)

const request = (...args) => Promise.resolve(fetch(...args))

const pingDesktop = () => {
  return request(`${desktopBaseUrl}/ping`)
  .then((response) => response.ok)
  .catch(() => false)
}

const refreshBalances = () => {
  return request(`${desktopBaseUrl}/refresh`, {
    method: 'POST',
    mode: 'cors',
  })
  .then((response) => response.json())
  .then((balances) => {
    return _.extend(balances, {
      lastUpdated: new Date().toISOString(),
    })
  })
}

export default {
  authenticate,
  fetchData,
  saveData,
  pingDesktop,
  refreshBalances,
}
