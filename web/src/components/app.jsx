import _ from 'lodash'
import cs from 'classnames'
import { action, extendObservable } from 'mobx'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import arrayMove from 'array-move'

import api from '../lib/api'
import state from '../lib/state'

import Accounts from './accounts'
import Goals from './goals'
import Income from './income'
import Loader from './loader'
import Rewards from './rewards'

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

class App extends Component {
  constructor (props) {
    super(props)

    extendObservable(this, {
      isLoading: true,
    })
  }

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
        <Rewards onSave={saveData} />
        <Accounts onSave={saveData} />
        <Income onSave={saveData} />
        <Goals
          goals={state.goals}
          unallocatedSavingsAmount={state.unallocatedSavingsAmount}
          unallocatedMoneyMarketAmount={state.unallocatedMoneyMarketAmount}
          unallocatedIBondsAmount={state.unallocatedIBondsAmount}
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

export default observer(App)
