import { action, extendObservable } from 'mobx'
import moment from 'moment'
import * as util from './util'

class Goal {
  constructor (props) {
    extendObservable(this, {
      id: undefined,
      label: 'Untitled',
      description: '',
      savedAmount: 0,
      iBondsAmount: 0,
      plannedAmount: 0,
      totalAmount: 100,
      order: 0,
      showProjection: false,
      projectionAmount: 0,

      get minTotalAmount () {
        return this.savedAmount + this.iBondsAmount + this.plannedAmount
      },

      get amountLeft () {
        return this.totalAmount - this.savedAmount - this.iBondsAmount - this.plannedAmount
      },

      get projection () {
        if (!this.showProjection || this.totalAmount <= 0 || this.plannedAmount <= 0) {
          return null
        }

        const projectionAmount = this.projectionAmount || this.plannedAmount
        const numMonths = Math.ceil(this.amountLeft / projectionAmount)
        return moment().add(numMonths, 'months').format('MMM YYYY')
      },
    })

    this.setProps(props)
  }

  setProps = action((props = {}) => {
    if (props.id != null) this.id = props.id
    if (props.label != null) this.label = props.label
    if (props.description != null) this.description = props.description
    if (props.savedAmount != null) this.savedAmount = util.toTwoDecimals(props.savedAmount)
    if (props.iBondsAmount != null) this.iBondsAmount = util.toTwoDecimals(props.iBondsAmount)
    if (props.plannedAmount != null) this.plannedAmount = util.toTwoDecimals(props.plannedAmount)
    if (props.totalAmount != null) this.totalAmount = util.toTwoDecimals(props.totalAmount)
    if (props.order != null) this.order = props.order
    if (props.showProjection != null) this.showProjection = props.showProjection
    if (props.projectionAmount != null) this.projectionAmount = props.projectionAmount
  })

  serialize () {
    return {
      id: this.id,
      label: this.label,
      description: this.description,
      savedAmount: this.savedAmount,
      iBondsAmount: this.iBondsAmount,
      plannedAmount: this.plannedAmount,
      totalAmount: this.totalAmount,
      order: this.order,
      showProjection: this.showProjection,
      projectionAmount: this.projectionAmount,
    }
  }
}

export default Goal
