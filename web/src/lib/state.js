import _ from 'lodash'
import { action, extendObservable, observable, values } from 'mobx'
import moment from 'moment'

import Goal from './goal-model'
import * as util from './util'

class State {
  constructor () {
    extendObservable(this, {
      draggingId: null,
      checkingBalance: 0,
      iBondsAvailableBalance: 0,
      iBondsUnavailableBalance: 0,
      moneyMarketBalance: 0,
      savingsBalance: 0,
      lastUpdated: null,
      incomeAmount: 0,
      expensesAmount: 0,
      savingsTransferAmount: 0,
      _goals: observable.map(),
      isSorting: false,
      rewards: observable.map(),

      get isGrabbing () {
        return !!this.draggingId
      },

      get allocatedSavingsAmount () {
        return _.sum(_.map(values(this._goals), 'savedAmount'))
      },

      get unallocatedSavingsAmount () {
        return this.savingsBalance - this.allocatedSavingsAmount
      },

      get allocatedMoneyMarketAmount () {
        return _.sum(_.map(values(this._goals), 'moneyMarketAmount'))
      },

      get unallocatedMoneyMarketAmount () {
        return this.moneyMarketBalance - this.allocatedMoneyMarketAmount
      },

      get allocatedIBondsAmount () {
        return _.sum(_.map(values(this._goals), 'iBondsAmount'))
      },

      get unallocatedIBondsAmount () {
        return this.iBondsAvailableBalance - this.allocatedIBondsAmount
      },

      get goals () {
        return _.sortBy(values(this._goals), 'order')
      },

      get goalsAmount () {
        return _.sum(_.map(this.goals, 'plannedAmount'))
      },

      get availableIncome () {
        return this.incomeAmount + this.savingsTransferAmount - this.expensesAmount - this.goalsAmount
      },
    })
  }

  getGoalById (id) {
    return this._goals.get(id)
  }

  getReward (id) {
    const reward = this.rewards.get(id)

    return reward || { amount: 0 }
  }

  setExpensesAmount = action((amount) => {
    this.expensesAmount = util.toTwoDecimals(amount)
  })

  updateData = action((data) => {
    const props = [
      'checkingBalance',
      'savingsBalance',
      'moneyMarketBalance',
      'iBondsAvailableBalance',
      'iBondsUnavailableBalance',
      'lastUpdated',
      'incomeAmount',
      'expensesAmount',
      'savingsTransferAmount',
    ]

    _.extend(this, _.pick(data, props))

    if (data.goals) {
      _.each(data.goals, (props) => {
        const existing = this._goals.get(props.id)

        if (existing) {
          existing.setProps(props)
        } else {
          this._goals.set(props.id, new Goal(props))
        }
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
  })

  addGoal = action(() => {
    const id = util.nextNumber(this.goals, 'id')
    const order = util.nextNumber(this.goals, 'order')
    this._goals.set(id, new Goal({ id, order }))
  })

  deleteGoal = action((goal) => {
    this._goals.delete(goal.id)
  })

  setSorting = action((isSorting) => {
    this.isSorting = isSorting
  })

  serialize () {
    return {
      checkingBalance: this.checkingBalance,
      savingsBalance: this.savingsBalance,
      moneyMarketBalance: this.moneyMarketBalance,
      iBondsAvailableBalance: this.iBondsAvailableBalance,
      iBondsUnavailableBalance: this.iBondsUnavailableBalance,
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
