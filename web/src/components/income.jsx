import { action, extendObservable } from 'mobx'
import { observer } from 'mobx-react'
import React, { Component } from 'react'

import { Bar, BarPart } from './bar'
import { ensureNumber, format$, rounded, percentToAmount } from '../lib/util'
import state from '../lib/state'

import Modal from './modal'

// round tiny value like -7.105427357601002e-15 to 0 because CSS can't handle it
const roundNearZeroValue = (num) => {
  return `${num}`.includes('e') ? 0 : num
}

const EditIncome = observer((props) => {
  let expensesAmount
  let incomeAmount
  let savingsTransferAmount

  const saveGoal = (e) => {
    e.preventDefault()

    props.onSave({
      expensesAmount: ensureNumber(expensesAmount.value),
      incomeAmount: ensureNumber(incomeAmount.value),
      savingsTransferAmount: ensureNumber(savingsTransferAmount.value),
    })
  }

  return (
    <Modal className='editor edit-income' isShowing={props.isEditing}>
      <button className='close' onClick={props.onClose}>
        <i className='fa fa-fw fa-remove' />
      </button>

      <form onSubmit={saveGoal} noValidate>
        <div className='group'>
          <label>Expenses</label>
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
          <label>Savings Transfer</label>
          <input
            ref={(node) => savingsTransferAmount = node}
            type='number'
            defaultValue={props.savingsTransferAmount}
          />
          <div className='limits'>
            <span className='value'>Min: {format$(props.minSavingsTransferAmount)}</span>
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

class Income extends Component {
  constructor (props) {
    super(props)

    extendObservable(this, {
      isEditing: false,
    })
  }

  render () {
    const {
      availableIncome,
      expensesAmount,
      goalsAmount,
      incomeAmount,
      savingsTransferAmount,
    } = state

    const totalIncomeAmount = savingsTransferAmount + incomeAmount
    const expensesPercent = expensesAmount / totalIncomeAmount * 100
    const goalsPercent = goalsAmount / totalIncomeAmount * 100
    const leftoverPercent = roundNearZeroValue(100 - expensesPercent - goalsPercent)
    const maxExpensesAmount = totalIncomeAmount - goalsAmount

    return (
      <section className='income'>
        <header>
          <h2>
            Income
            <div className='controls'>
              <button onClick={this._edit(true)}>
                <i className='fa fa-edit' />
              </button>
            </div>
          </h2>
          <p>{this._incomeInfo()}</p>
          <div className='spacer' />
          <div className='total'>
            <span className='total-amount'>{format$(totalIncomeAmount)}</span>
          </div>
        </header>
        <Bar>
          <BarPart
            id='income-expenses'
            label='expenses'
            type='expense'
            percent={expensesPercent}
            value={rounded(expensesAmount, maxExpensesAmount, totalIncomeAmount)}
            onUpdatePercent={(percent) => {
              const amount = percentToAmount(totalIncomeAmount, percent)
              state.setExpensesAmount(amount > maxExpensesAmount ? maxExpensesAmount : amount)
            }}
            onFinishUpdatingPercent={() => {
              state.setExpensesAmount(rounded(expensesAmount, maxExpensesAmount, totalIncomeAmount))
              this.props.onSave()
            }}
          />
          <BarPart
            id='income-planned'
            label='this month'
            type='planned'
            draggable={false}
            percent={goalsPercent}
            value={goalsAmount}
          />
          <BarPart
            id='income-left'
            label='left'
            type='left'
            draggable={false}
            percent={leftoverPercent}
            value={availableIncome}
          />
        </Bar>
        <EditIncome
          isEditing={this.isEditing}
          incomeAmount={incomeAmount}
          minIncomeAmount={expensesAmount + goalsAmount - savingsTransferAmount}
          expensesAmount={expensesAmount}
          maxExpensesAmount={maxExpensesAmount}
          savingsTransferAmount={savingsTransferAmount}
          minSavingsTransferAmount={expensesAmount + goalsAmount - incomeAmount}
          onClose={this._edit(false)}
          onSave={this._save}
        />
      </section>
    )
  }

  _incomeInfo () {
    const {
      incomeAmount,
      savingsTransferAmount,
    } = state

    if (!savingsTransferAmount) return null

    return `${format$(incomeAmount)} income + ${format$(savingsTransferAmount)} savings transfer`
  }

  _edit = action((isEditing) => () => {
    this.isEditing = isEditing
  })

  _save = action((props) => {
    this._edit(false)()
    state.updateData(props)
    this.props.onSave()
  })
}

export default observer(Income)
