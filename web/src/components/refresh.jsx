import cs from 'classnames'
import moment from 'moment'
import { action, computed, observable } from 'mobx'
import { observer } from 'mobx-react'
import React, { Component } from 'react'

import api from '../lib/api'
import state from '../lib/state'

@observer
class Refresh extends Component {
  @observable isConnected = false
  @observable isRefreshing = false
  @observable lastUpdatedTrigger = true
  @observable hasAlerts = false

  @computed get lastUpdatedFormatted () {
    this.lastUpdatedTrigger // hack to get this to update
    return state.lastUpdated ? moment(state.lastUpdated).fromNow() : '---'
  }

  componentDidMount () {
    this._pingDesktop()
    setInterval(() => {
      // hack to trigger update of lastUpdatedFormatted
      this.lastUpdatedTrigger = !this.lastUpdatedTrigger

      this._pingDesktop()
    }, 10000)
  }

  _pingDesktop () {
    api.pingDesktop().then(action((isConnected) => {
      this.isConnected = isConnected
    }))
  }

  render () {
    return (
      <section className={cs('refresh', {
        'is-connected': this.isConnected,
      })}>
        <button onClick={this._refresh} disabled={this.isRefreshing}>
          <i className={`fa fa-refresh ${this.isRefreshing ? 'fa-spin' : ''}`} />
          Refresh{this.isRefreshing ? 'ing...' : ''}
        </button>
        {this.isRefreshing ?
          null :
          <label>updated {this.lastUpdatedFormatted}</label>
        }
        {this.hasAlerts ?
          <span className='alert'><i className='fa fa-exclamation-triangle' /> The finance app needs attention</span> :
          null
        }
      </section>
    )
  }

  _refresh = () => {
    this.isRefreshing = true
    const stop = api.pollAlerts((alerts) => {
      this.hasAlerts = alerts > 0
    })

    api.refreshBalances()
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Failed to refresh balances:', err.stack || err)
    })
    .finally(() => {
      stop()
      this.isRefreshing = false
      this.hasAlerts = false
    })
  }
}

export default Refresh
