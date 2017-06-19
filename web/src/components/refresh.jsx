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
      </section>
    )
  }

  _refresh = () => {
    this.isRefreshing = true
    api.refreshBalances()
    .then((data) => {
      state.updateData(data)
      this.props.onSave()
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Failed to refresh balances:', err.stack || err)
    })
    .finally(() => {
      this.isRefreshing = false
    })
  }
}

export default Refresh
