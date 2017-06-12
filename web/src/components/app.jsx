import { action, observable } from 'mobx'
import { observer } from 'mobx-react'
import React, { Component } from 'react'

import api from '../lib/api'
import state from '../lib/state'

import Checking from './checking'
import Goals from './goals'
import Income from './income'
import Loader from './loader'
import Refresh from './refresh'
import Savings from './savings'

const saveData = () => {
  api.saveData(state.serialize())
}

const addGoal = () => {
  state.addGoal()
  saveData()
}

const deleteGoal = (goal) => {
  state.deleteGoal(goal)
  saveData()
}

@observer
class App extends Component {
  @observable isLoading = true

  componentDidMount () {
    api.fetchData().then(action((data) => {
      state.updateData(data)
      this.isLoading = false
    }))
  }

  render () {
    if (this.isLoading) return <Loader>Loading...</Loader>

    return (
      <div className={`container ${state.isGrabbing ? 'is-grabbing' : ''}`}>
        <Refresh />
        <Checking />
        <Savings />
        <Income onSave={saveData} />
        <Goals
          goals={state.goals}
          unallocatedSavingsAmount={state.unallocatedSavingsAmount}
          availableIncome={state.availableIncome}
          onAdd={addGoal}
          onDelete={deleteGoal}
          onSave={saveData}
        />
      </div>
    )
  }
}

export default App
