import { action, computed, observable } from 'mobx'
import util from './util'

class Goal {
  @observable id
  @observable label = 'Untitled'
  @observable description = ''
  @observable savedAmount = 0
  @observable plannedAmount = 0
  @observable totalAmount = 100

  constructor (props) {
    this.setProps(props)
  }

  @computed get minTotalAmount () {
    return this.savedAmount + this.plannedAmount
  }

  @computed get amountLeft () {
    return this.totalAmount - this.savedAmount - this.plannedAmount
  }

  @action setProps = (props = {}) => {
    if (props.id != null) this.id = props.id
    if (props.label != null) this.label = props.label
    if (props.description != null) this.description = props.description
    if (props.savedAmount != null) this.savedAmount = util.toTwoDecimals(props.savedAmount)
    if (props.plannedAmount != null) this.plannedAmount = util.toTwoDecimals(props.plannedAmount)
    if (props.totalAmount != null) this.totalAmount = util.toTwoDecimals(props.totalAmount)
  }

  serialize () {
    return {
      id: this.id,
      label: this.label,
      description: this.description,
      savedAmount: this.savedAmount,
      plannedAmount: this.plannedAmount,
      totalAmount: this.totalAmount,
    }
  }
}

export default Goal
