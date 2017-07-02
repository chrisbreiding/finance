import _ from 'lodash'
import Promise from 'bluebird'

import remoteStore from './remote-store'

const port = localStorage.port || 4193
const desktopBaseUrl = `http://localhost:${port}`

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

export default {
  authenticate,
  pollData,
  saveData,
  pingDesktop,
  refreshBalances,
}
