import React, { Component } from 'react'
import { render } from 'react-dom'
import { format } from 'currency-formatter'
import moment from 'moment'

import ipc from './lib/ipc'

class App extends Component {
  state = {
    checkingBalance: 0,
    savingsBalance: 0,
    lastUpdated: null,
    lastUpdatedFormatted: '---',
  }

  componentDidMount () {
    ipc('balances').then(this._updateData)

    setInterval(() => {
      const { lastUpdated } = this.state

      this.setState({
        lastUpdatedFormatted: lastUpdated ? moment(lastUpdated).fromNow() : '---',
      })
    }, 5000)
  }

  render () {
    return (
      <div>
        <button onClick={this._refresh}>Refresh</button>
        <p>Last updated: {this.state.lastUpdatedFormatted}</p>
        <p>Checking: {format(this.state.checkingBalance, { code: 'USD' })}</p>
        <p>Savings: {format(this.state.savingsBalance, { code: 'USD' })}</p>
      </div>
    )
  }

  _refresh = () => {
    ipc('refresh').then(this._updateData)
  }

  _updateData = (data) => {
    this.setState({
      ...data,
      lastUpdatedFormatted: data.lastUpdated ? moment(data.lastUpdated).fromNow() : '---',
    })
  }
}

render(<App />, document.getElementById('app'))
