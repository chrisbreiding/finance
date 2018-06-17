const firebase = require('firebase')
const Promise = require('bluebird')

const db = require('./db')
const ipc = require('./ipc')
const { isDev } = require('./util')

const account = isDev ? 'firebase-dev' : 'firebase'

class RemoteStore {
  start () {
    return db.fetchCredentials(account).then(({ appName, apiKey }) => {
      ipc.sendDebug({ appName, apiKey })

      this._app = firebase.initializeApp({
        apiKey,
        authDomain: `${appName}.firebaseapp.com`,
        databaseURL: `https://${appName}.firebaseio.com`,
        storageBucket: `${appName}.appspot.com`,
      })

      return firebase.auth().signInAnonymously()
    })
  }

  save (data) {
    return new Promise((resolve) => {
      return this._ref().child('/').update(data, resolve)
    })
  }

  _ref () {
    return this._app.database().ref()
  }
}

module.exports = new RemoteStore()
