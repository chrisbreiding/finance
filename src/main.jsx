import { computed, observable } from 'mobx'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import { render } from 'react-dom'
import moment from 'moment'

import api from './lib/api'
import { format$ } from './lib/util'
import state from './lib/state'

import Goals from './components/goals'

const saveData = () => {
  api.saveData(state.serialize())
}

const refresh = () => {
  api.refreshBalances().then(state.updateData)
}

const addGoal = () => {
  state.addGoal()
  saveData()
}

@observer
class App extends Component {
  @observable _lastUpdatedTrigger = true
  @computed get lastUpdatedFormatted () {
    this._lastUpdatedTrigger // hack to get this to update
    return state.lastUpdated ? moment(state.lastUpdated).fromNow() : '---'
  }

  componentDidMount () {
    api.fetchData().then(state.updateData)

    setInterval(() => {
      // hack to trigger update of lastUpdatedFormatted
      this._lastUpdatedTrigger = !this._lastUpdatedTrigger
    }, 10000)
  }

  render () {
    return (
      <div>
        <button onClick={refresh}>Refresh</button>
        <p>Last updated: {this.lastUpdatedFormatted}</p>
        <p>Checking: {format$(state.checkingBalance)}</p>
        <p>Savings: {format$(state.savingsBalance)}</p>
        <p>Income: {format$(state.expensesAmount)} + {format$(state.incomeAllocatedAmount)} / {format$(state.incomeAmount)}</p>
        <Goals
          goals={state.goals}
          onAdd={addGoal}
          onUpdate={saveData}
          onSave={saveData}
        />
      </div>
    )
  }
}

render(<App />, document.getElementById('app'))
