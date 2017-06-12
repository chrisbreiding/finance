import { action, observable } from 'mobx'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import { render } from 'react-dom'

import api from './lib/api'

import App from './components/app'
import Auth from './components/auth'
import Loader from './components/loader'

@observer
class Main extends Component {
  @observable isAuthenticating = true
  @observable isAuthenticated = false

  componentDidMount () {
    api.authenticate()
    .then(action(() => {
      this.isAuthenticated = true
      this.isAuthenticating = false
    }))
    .catch(action(() => {
      this.isAuthenticating = false
    }))
  }

  render () {
    if (this.isAuthenticating) return <Loader>Authenticating...</Loader>

    if (this.isAuthenticated) {
      return <App />
    } else {
      return <Auth onAuth={action(() => { this.isAuthenticated = true })} />
    }

  }
}

render(<Main />, document.getElementById('app'))
