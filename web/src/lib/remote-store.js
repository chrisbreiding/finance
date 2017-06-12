import _ from 'lodash'
import firebase from 'firebase'
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

  fetch (keyOrArray) {
    return this._ensureData().then(() => {
      if (_.isArray(keyOrArray)) {
        return _.map(keyOrArray, (key) => this._data[key])
      } else if ((keyOrArray == null)) {
        return this._data
      } else {
        return this._data[keyOrArray]
      }
    })
  }

  save (keyOrObject, value) {
    return this._ensureData().then(() => {
      if (_.isPlainObject(keyOrObject)) {
        _.each(keyOrObject, (value, key) => {
          return this._data[key] = value
        }
        )
      } else {
        this._data[keyOrObject] = value
      }
      return this._save().then(() => value)
    })
  }

  remove (key) {
    return this._ensureData().then(() => {
      delete this._data[key]
      return this._save()
    })
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
