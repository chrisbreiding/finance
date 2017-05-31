import { computed, observable } from 'mobx'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import { render } from 'react-dom'
import moment from 'moment'

import api from './lib/api'
import { format$ } from './lib/util'
import state from './lib/state'

import Goals from './components/goals'
import { Bar, BarPart } from './components/bar'

const saveData = () => {
  api.saveData(state.serialize())
}

const addGoal = () => {
  state.addGoal()
  saveData()
}

@observer
class Refresh extends Component {
  @observable isRefreshing = false
  @observable lastUpdatedTrigger = true

  @computed get lastUpdatedFormatted () {
    this.lastUpdatedTrigger // hack to get this to update
    return state.lastUpdated ? moment(state.lastUpdated).fromNow() : '---'
  }

  componentDidMount () {
    setInterval(() => {
      // hack to trigger update of lastUpdatedFormatted
      this.lastUpdatedTrigger = !this.lastUpdatedTrigger
    }, 10000)
  }

  render () {
    return (
      <section className='refresh'>
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
    api.refreshBalances().then((data) => {
      state.updateData(data)
      this.isRefreshing = false
    })
  }
}

const Savings = observer(() => (
  <section className='savings'>
    <h2>Savings</h2>
    <Bar total={state.savingsBalance}>
      <BarPart
        label='Allocated'
        percent={state.savingsAllocatedAmount / state.savingsBalance * 100}
        value={state.savingsAllocatedAmount}
      />
    </Bar>
  </section>
))

const Income = observer(() => {
  const income = state.incomeAmount
  const expensesPercent = Math.floor(state.expensesAmount / income * 100)
  const goalsPercent = Math.floor(state.goalsAmount / income * 100)
  const leftoverPercent = 100 - expensesPercent - goalsPercent

  return (
    <section className='income'>
      <h2>Income</h2>
      <Bar total={income}>
        <BarPart
          label='Expenses'
          percent={expensesPercent}
          value={state.expensesAmount}
        />
        <BarPart
          label='Goals'
          percent={goalsPercent}
          value={state.goalsAmount}
        />
        <BarPart
          label='Left'
          percent={leftoverPercent}
          value={income - state.expensesAmount - state.goalsAmount}
        />
      </Bar>
    </section>
  )
})

@observer
class App extends Component {
  componentDidMount () {
    api.fetchData().then(state.updateData)
  }

  render () {
    return (
      <div className='container'>
        <Refresh />
        <p>Checking: {format$(state.checkingBalance)}</p>
        <Savings />
        <Income />
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
