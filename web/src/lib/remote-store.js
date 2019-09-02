import _ from 'lodash'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import Promise from 'bluebird'

class RemoteStore {
  auth (apiKey) {
    if (this._app) {
      return this._app.delete().then(() => this._signIn(apiKey))
    } else {
      return this._signIn(apiKey)
    }
  }

  _signIn = (apiKey) => {
    const appName = localStorage.appName || 'finance-c9d71'

    this._app = firebase.initializeApp({
      apiKey,
      authDomain: `${appName}.firebaseapp.com`,
      databaseURL: `https://${appName}.firebaseio.com`,
      storageBucket: `${appName}.appspot.com`,
    })

    return firebase.auth().signInAnonymously()
  }

  poll (cb) {
    this._ref().child('/').on('value', (snapshot) => {
      const data = snapshot.val() || {}
      this._data = this._data || {}
      _.extend(this._data, data)
      cb(data)
    })
  }

  save (data) {
    return this._ensureData()
    .then(() => {
      _.extend(this._data, data)
      return this._save()
    })
    .return(data)
  }

  _ref () {
    return this._app.database().ref()
  }

  _ensureData () {
    return new Promise((resolve) => {
      if (this._data) { return resolve() }

      return this._ref().child('/').once('value', (snapshot) => {
        this._data = snapshot.val() || {}
        return resolve()
      })
    })
  }

  _save () {
    return new Promise((resolve) => {
      return this._ref().child('/').update(this._data, resolve)
    })
  }
}

export default new RemoteStore()
