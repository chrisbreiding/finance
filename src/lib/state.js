import _ from 'lodash'
import { action, computed, observable } from 'mobx'

import Goal from './goal-model'
import util from './util'

class State {
  @observable isGrabbing = false
  @observable checkingBalance = 0
  @observable savingsBalance = 0
  @observable lastUpdated = null
  @observable incomeAmount = 0
  @observable expensesAmount = 0
  @observable goals = []

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
    this.goals.push(new Goal({
      id: util.newId(this.goals),
      label: 'Untitled',
      savedAmount: 0,
      plannedAmount: 50,
      totalAmount: 100,
    }))
  }

  serialize () {
    return {
      incomeAmount: this.incomeAmount,
      expensesAmount: this.expensesAmount,
      goals: this.goals.map((goal) => goal.serialize()),
    }
  }
}

export default new State()
