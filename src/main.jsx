import { computed, observable } from 'mobx'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import { render } from 'react-dom'
import moment from 'moment'

import api from './lib/api'
import state from './lib/state'
import util from './lib/util'

import Goals from './components/goals'
import { Bar, BarPart } from './components/bar'

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
    api.refreshBalances()
    .then((data) => {
      state.updateData(data)
    })
    .catch(() => {}) // ignore failure to refresh
    .finally(() => {
      this.isRefreshing = false
    })
  }
}

const Checking = observer(() => (
  <section className='checking'>
    <h2>Checking</h2>
    <Bar total={state.checkingBalance} />
  </section>
))

const Savings = observer(() => (
  <section className='savings'>
    <h2>Savings</h2>
    <Bar total={state.savingsBalance}>
      <BarPart
        label='saved'
        type='savings'
        draggable={false}
        percent={state.allocatedSavingsAmount / state.savingsBalance * 100}
        value={state.allocatedSavingsAmount}
      />
    </Bar>
  </section>
))

const Income = observer(() => {
  const income = state.incomeAmount
  const expensesPercent = state.expensesAmount / income * 100
  const goalsPercent = state.goalsAmount / income * 100
  const leftoverPercent = 100 - expensesPercent - goalsPercent
  const maxExpensesAmount = income - state.goalsAmount

  return (
    <section className='income'>
      <h2>Income</h2>
      <Bar total={income}>
        <BarPart
          label='budgeted'
          type='expense'
          percent={expensesPercent}
          value={util.rounded(state.expensesAmount, maxExpensesAmount, income)}
          onUpdatePercent={(percent) => {
            const amount = util.percentToAmount(income, percent)
            state.setExpensesAmount(amount > maxExpensesAmount ? maxExpensesAmount : amount)
          }}
          onFinishUpdatingPercent={() => {
            state.setExpensesAmount(util.rounded(state.expensesAmount, maxExpensesAmount))
            saveData()
          }}
        />
        <BarPart
          label='this month'
          type='planned'
          draggable={false}
          percent={goalsPercent}
          value={state.goalsAmount}
        />
        <BarPart
          label='left'
          draggable={false}
          percent={leftoverPercent}
          value={state.availableIncome}
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
      <div className={`container ${state.isGrabbing ? 'is-grabbing' : ''}`}>
        <Refresh />
        <Checking />
        <Savings />
        <Income />
        <Goals
          goals={state.goals}
          unallocatedSavingsAmount={state.unallocatedSavingsAmount}
          availableIncome={state.availableIncome}
          onAdd={addGoal}
          onDelete={deleteGoal}
          onUpdate={saveData}
          onSave={saveData}
        />
      </div>
    )
  }
}

render(<App />, document.getElementById('app'))
