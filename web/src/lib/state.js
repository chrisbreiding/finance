import _ from 'lodash'
import { action, computed, observable, values } from 'mobx'
import moment from 'moment'

import Goal from './goal-model'
import util from './util'

class State {
  @observable draggingId = null
  @observable checkingBalance = 0
  @observable savingsBalance = 0
  @observable lastUpdated = null
  @observable incomeAmount = 0
  @observable expensesAmount = 0
  @observable savingsTransferAmount = 0
  @observable _goals = observable.map()
  @observable isSorting = false
  @observable rewards = observable.map()

  @computed get isGrabbing () {
    return !!this.draggingId
  }

  @computed get allocatedSavingsAmount () {
    return _.sum(_.map(values(this._goals), 'savedAmount'))
  }

  @computed get unallocatedSavingsAmount () {
    return this.savingsBalance - this.allocatedSavingsAmount
  }

  @computed get goals () {
    return _.sortBy(values(this._goals), 'order')
  }

  @computed get goalsAmount () {
    return _.sum(_.map(this.goals, 'plannedAmount'))
  }

  @computed get availableIncome () {
    return this.incomeAmount + this.savingsTransferAmount - this.expensesAmount - this.goalsAmount
  }

  getGoalById (id) {
    return this._goals.get(id)
  }

  @action setExpensesAmount (amount) {
    this.expensesAmount = util.toTwoDecimals(amount)
  }

  @action updateData = (data) => {
    const props = 'checkingBalance savingsBalance lastUpdated incomeAmount expensesAmount savingsTransferAmount'.split(' ')

    _.extend(this, _.pick(data, props))

    // TODO: if goal exists, use goal.setProps instead of creating new goal
    if (data.goals) {
      _.each(data.goals, (goal) => {
        this._goals.set(goal.id, new Goal(goal))
      })
    }

    if (data.rewards) {
      _.each(data.rewards, (value, key) => {
        if (_.isNumber(value)) {
          value = {
            amount: value,
            lastUpdated: moment().toISOString(),
          }
        }
        this.rewards.set(key, value)
      })
    }
  }

  @action addGoal = () => {
    const id = util.nextNumber(this.goals, 'id')
    const order = util.nextNumber(this.goals, 'order')
    this._goals.set(id, new Goal({ id, order }))
  }

  @action deleteGoal = (goal) => {
    this._goals.delete(goal.id)
  }

  @action setSorting (isSorting) {
    this.isSorting = isSorting
  }

  serialize () {
    return {
      checkingBalance: this.checkingBalance,
      savingsBalance: this.savingsBalance,
      incomeAmount: this.incomeAmount,
      expensesAmount: this.expensesAmount,
      savingsTransferAmount: this.savingsTransferAmount,
      lastUpdated: this.lastUpdated,
      goals: _.map(values(this._goals), (goal) => goal.serialize()),
      rewards: this.rewards.toPOJO(),
    }
  }
}

export default new State()
