import { action, computed, observable } from 'mobx'
import moment from 'moment'
import util from './util'

class Goal {
  @observable id
  @observable label = 'Untitled'
  @observable description = ''
  @observable savedAmount = 0
  @observable plannedAmount = 0
  @observable totalAmount = 100
  @observable order = 0
  @observable showProjection = false
  @observable projectionAmount = 0

  constructor (props) {
    this.setProps(props)
  }

  @computed get minTotalAmount () {
    return this.savedAmount + this.plannedAmount
  }

  @computed get amountLeft () {
    return this.totalAmount - this.savedAmount - this.plannedAmount
  }

  @computed get projection () {
    if (!this.showProjection || this.totalAmount <= 0 || this.plannedAmount <= 0) {
      return null
    }

    const projectionAmount = this.projectionAmount || this.plannedAmount
    const numMonths = Math.ceil((this.totalAmount - this.savedAmount) / projectionAmount)
    return moment().add(numMonths, 'months').format('MMM YYYY')
  }

  @action setProps = (props = {}) => {
    if (props.id != null) this.id = props.id
    if (props.label != null) this.label = props.label
    if (props.description != null) this.description = props.description
    if (props.savedAmount != null) this.savedAmount = util.toTwoDecimals(props.savedAmount)
    if (props.plannedAmount != null) this.plannedAmount = util.toTwoDecimals(props.plannedAmount)
    if (props.totalAmount != null) this.totalAmount = util.toTwoDecimals(props.totalAmount)
    if (props.order != null) this.order = props.order
    if (props.showProjection != null) this.showProjection = props.showProjection
    if (props.projectionAmount != null) this.projectionAmount = props.projectionAmount
  }

  serialize () {
    return {
      id: this.id,
      label: this.label,
      description: this.description,
      savedAmount: this.savedAmount,
      plannedAmount: this.plannedAmount,
      totalAmount: this.totalAmount,
      order: this.order,
      showProjection: this.showProjection,
      projectionAmount: this.projectionAmount,
    }
  }
}

export default Goal
