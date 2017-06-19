import _ from 'lodash'
import { action, computed, observable } from 'mobx'

import Goal from './goal-model'
import util from './util'

class State {
  @observable draggingId = null
  @observable checkingBalance = 0
  @observable savingsBalance = 0
  @observable lastUpdated = null
  @observable incomeAmount = 0
  @observable expensesAmount = 0
  @observable goals = []

  @computed get isGrabbing () {
    return !!this.draggingId
  }

  @computed get allocatedSavingsAmount () {
    return _.sum(_.map(this.goals, 'savedAmount'))
  }

  @computed get unallocatedSavingsAmount () {
    return this.savingsBalance - this.allocatedSavingsAmount
  }

  @computed get goalsAmount () {
    return _.sum(_.map(this.goals, 'plannedAmount'))
  }

  @computed get availableIncome () {
    return this.incomeAmount - this.expensesAmount - this.goalsAmount
  }

  @action setExpensesAmount (amount) {
    this.expensesAmount = util.toTwoDecimals(amount)
  }

  @action updateData = (data) => {
    const props = 'checkingBalance savingsBalance lastUpdated incomeAmount expensesAmount'.split(' ')
    _.extend(this, _.pick(data, props))

    if (data.goals) {
      this.goals = data.goals.map((goal) => new Goal(goal))
    }
  }

  @action addGoal = () => {
    this.goals.push(new Goal({ id: util.newId(this.goals) }))
  }

  @action deleteGoal = (goal) => {
    const index = _.findIndex(this.goals, { id: goal.id })
    if (index > -1) {
      this.goals.splice(index, 1)
    }
  }

  serialize () {
    return {
      checkingBalance: this.checkingBalance,
      savingsBalance: this.savingsBalance,
      incomeAmount: this.incomeAmount,
      expensesAmount: this.expensesAmount,
      lastUpdated: this.lastUpdated,
      goals: this.goals.map((goal) => goal.serialize()),
    }
  }
}

export default new State()
