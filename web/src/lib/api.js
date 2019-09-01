import _ from 'lodash'
import Promise from 'bluebird'

import remoteStore from './remote-store'

const desktopBaseUrl = localStorage.baseUrl || 'https://finance.crbapps.dev:4193'

const authenticate = (apiKey = localStorage.apiKey) => {
  if (!apiKey) return Promise.reject(new Error(''))

  localStorage.apiKey = apiKey

  return remoteStore.auth(apiKey).catch((err) => {
    console.error('Failed to authenticate:') // eslint-disable-line no-console
    console.error(err) // eslint-disable-line no-console
    throw err
  })
}

const pollData = (cb) => {
  remoteStore.poll(cb)
}

const pollAlerts = (cb) => {
  const intervalId = setInterval(() => {
    request(`${desktopBaseUrl}/alerts`)
    .then((response) => response.json())
    .catch(() => ({ alerts: 0 }))
    .then(({ alerts }) => cb(alerts))
  }, 1000)

  return () => {
    clearInterval(intervalId)
  }
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
}

const api = {
  authenticate,
  pollData,
  pollAlerts,
  saveData,
  pingDesktop,
  refreshBalances,
}

if (window.Cypress) {
  window.api = api
}

export default api
