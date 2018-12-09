import _ from 'lodash'
import cs from 'classnames'
import { action, observable } from 'mobx'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import { arrayMove } from 'react-sortable-hoc'

import api from '../lib/api'
import state from '../lib/state'

import Checking from './checking'
import Goals from './goals'
import Income from './income'
import Loader from './loader'
import Refresh from './refresh'
import Rewards from './rewards'
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

const onSortStart = () => {
  state.setSorting(true)
}

const onSortEnd = ({ oldIndex, newIndex }) => {
  state.setSorting(false)
  if (oldIndex === newIndex) return

  const ids = _.map(state.goals, 'id')
  const sortedIds = arrayMove(ids, oldIndex, newIndex)

  _.each(sortedIds, (id, order) => {
    state.getGoalById(id).setProps({ order })
  })
  saveData()
}

@observer
class App extends Component {
  @observable isLoading = true

  componentDidMount () {
    api.pollData(action((data) => {
      state.updateData(data)
      this.isLoading = false
    }))
  }

  render () {
    if (this.isLoading) return <Loader>Loading...</Loader>

    return (
      <div className={cs('container', {
        'is-grabbing': state.isGrabbing,
        'is-sorting': state.isSorting,
      })}>
        <Refresh onSave={saveData} />
        <Rewards />
        <Checking />
        <Savings />
        <Income onSave={saveData} />
        <Goals
          goals={state.goals}
          unallocatedSavingsAmount={state.unallocatedSavingsAmount}
          availableIncome={state.availableIncome}
          onAdd={addGoal}
          onDelete={deleteGoal}
          onSortStart={onSortStart}
          onSortEnd={onSortEnd}
          onSave={saveData}
        />
      </div>
    )
  }
}

export default App
