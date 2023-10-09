import _ from 'lodash'

import remoteStore from './remote-store'

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

const api = {
  authenticate,
  pollData,
  saveData,
}

if (window.Cypress) {
  window.api = api
}

export default api
