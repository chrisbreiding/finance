import _ from 'lodash'
import { computed, observable } from 'mobx'

import Goal from './goal-model'
import { newId } from './util'

class State {
  @observable checkingBalance = 0
  @observable savingsBalance = 0
  @observable lastUpdated = null
  @observable incomeAmount = 0
  @observable expensesAmount = 0
  @observable goals = []

  @computed get savingsAllocatedAmount () {
    return _.sum(_.map(this.goals, 'savedAmount'))
  }

  @computed get goalsAmount () {
    return _.sum(_.map(this.goals, 'plannedAmount'))
  }

  updateData = (data) => {
    _.extend(this, _.omit(data, 'goals'))

    if (data.goals) {
      this.goals = data.goals.map((goal) => new Goal(goal))
    }
  }

  addGoal = () => {
    this.goals.push(new Goal({
      id: newId(this.goals),
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
