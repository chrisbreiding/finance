import { action, observable } from 'mobx'
import util from './util'

class Goal {
  @observable id
  @observable label = ''
  @observable savedAmount = 0
  @observable plannedAmount = 0
  @observable totalAmount = 0

  constructor (props) {
    this.id = props.id
    this.label = props.label
    this.savedAmount = props.savedAmount
    this.plannedAmount = props.plannedAmount
    this.totalAmount = props.totalAmount
  }

  @action setSavedAmount = (amount) => {
    this.savedAmount = util.toTwoDecimals(amount)
  }

  @action setPlannedAmount = (amount) => {
    this.plannedAmount = util.toTwoDecimals(amount)
  }

  @action setTotalAmount = (amount) => {
    this.totalAmount = util.toTwoDecimals(amount)
  }

  serialize () {
    return {
      id: this.id,
      label: this.label,
      savedAmount: this.savedAmount,
      plannedAmount: this.plannedAmount,
      totalAmount: this.totalAmount,
    }
  }
}

export default Goal
