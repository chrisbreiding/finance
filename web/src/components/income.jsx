import { action, observable } from 'mobx'
import { observer } from 'mobx-react'
import React, { Component } from 'react'

import { Bar, BarPart } from './bar'
import { ensureNumber, format$, rounded, percentToAmount } from '../lib/util'
import state from '../lib/state'

import Modal from './modal'

const EditIncome = observer((props) => {
  let expensesAmount
  let incomeAmount

  const saveGoal = (e) => {
    e.preventDefault()

    props.onSave({
      expensesAmount: ensureNumber(expensesAmount.value),
      incomeAmount: ensureNumber(incomeAmount.value),
    })
  }

  return (
    <Modal className='editor edit-income' isShowing={props.isEditing}>
      <button className='close' onClick={props.onClose}>
        <i className='fa fa-remove' />
      </button>

      <form onSubmit={saveGoal} noValidate>
        <div className='group'>
          <label>Budgeted</label>
          <input
            ref={(node) => expensesAmount = node}
            type='number'
            defaultValue={props.expensesAmount}
          />
          <div className='limits'>
            <span className='value'>Min: {format$(0)}</span>
            <span className='value'>Max: {format$(props.maxExpensesAmount)}</span>
          </div>
        </div>
        <div className='group'>
          <label>Income</label>
          <input
            ref={(node) => incomeAmount = node}
            type='number'
            defaultValue={props.incomeAmount}
          />
          <div className='limits'>
            <span className='value'>Min: {format$(props.minIncomeAmount)}</span>
          </div>
        </div>
        <div className='group controls'>
          <button className='save' type='submit'>
            <i className='fa fa-check' /> Save
          </button>
        </div>
      </form>
    </Modal>
  )
})

@observer
class Income extends Component {
  @observable isEditing = false

  render () {
    const incomeAmount = state.incomeAmount
    const expensesPercent = state.expensesAmount / incomeAmount * 100
    const goalsPercent = state.goalsAmount / incomeAmount * 100
    const leftoverPercent = 100 - expensesPercent - goalsPercent
    const maxExpensesAmount = incomeAmount - state.goalsAmount

    return (
      <section className='income'>
        <h2>
          Income
          <button onClick={this._edit(true)}>
            <i className='fa fa-edit' />
          </button>
        </h2>
        <Bar total={incomeAmount}>
          <BarPart
            id='income-budgeted'
            label='budgeted'
            type='expense'
            percent={expensesPercent}
            value={rounded(state.expensesAmount, maxExpensesAmount, incomeAmount)}
            onUpdatePercent={(percent) => {
              const amount = percentToAmount(incomeAmount, percent)
              state.setExpensesAmount(amount > maxExpensesAmount ? maxExpensesAmount : amount)
            }}
            onFinishUpdatingPercent={() => {
              state.setExpensesAmount(rounded(state.expensesAmount, maxExpensesAmount, incomeAmount))
              this.props.onSave()
            }}
          />
          <BarPart
            id='income-planned'
            label='this month'
            type='planned'
            draggable={false}
            percent={goalsPercent}
            value={state.goalsAmount}
          />
          <BarPart
            id='income-left'
            label='left'
            draggable={false}
            percent={leftoverPercent}
            value={state.availableIncome}
          />
        </Bar>
        <EditIncome
          isEditing={this.isEditing}
          incomeAmount={incomeAmount}
          minIncomeAmount={state.expensesAmount + state.goalsAmount}
          expensesAmount={state.expensesAmount}
          maxExpensesAmount={maxExpensesAmount}
          onClose={this._edit(false)}
          onSave={this._save}
        />
      </section>
    )
  }

  @action _edit = (isEditing) => () => {
    this.isEditing = isEditing
  }

  @action _save = (props) => {
    this._edit(false)()
    state.updateData(props)
    this.props.onSave()
  }
}

export default Income
