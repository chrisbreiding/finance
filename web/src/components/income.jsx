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
        <i className='fa fa-remove' />
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
            <span className='value'>Min: {format$(0)}</span>
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
    const {
      availableIncome,
      expensesAmount,
      goalsAmount,
      incomeAmount,
      savingsTransferAmount,
    } = state

    const totalIncomeAmount = savingsTransferAmount + incomeAmount
    const expensesPercent = expensesAmount / totalIncomeAmount * 100
    const savingsTransferPercent = savingsTransferAmount / totalIncomeAmount * 100
    const goalsPercent = goalsAmount / totalIncomeAmount * 100
    const leftoverPercent = 100 - expensesPercent - savingsTransferPercent - goalsPercent
    const maxExpensesAmount = incomeAmount - goalsAmount

    return (
      <section className='income'>
        <h2>
          Income
          <div className='controls'>
            <button onClick={this._edit(true)}>
              <i className='fa fa-edit' />
            </button>
          </div>
        </h2>
        <Bar total={totalIncomeAmount}>
          <BarPart
            id='income-expenses'
            label='expenses'
            type='expense'
            percent={expensesPercent}
            value={rounded(expensesAmount, maxExpensesAmount, incomeAmount)}
            onUpdatePercent={(percent) => {
              const amount = percentToAmount(totalIncomeAmount, percent)
              state.setExpensesAmount(amount > maxExpensesAmount ? maxExpensesAmount : amount)
            }}
            onFinishUpdatingPercent={() => {
              state.setExpensesAmount(rounded(expensesAmount, maxExpensesAmount, incomeAmount))
              this.props.onSave()
            }}
          />
          <BarPart
            id='income-savings-transfer'
            label='savings transfer'
            type='savings-transfer'
            draggable={false}
            percent={savingsTransferPercent}
            value={savingsTransferAmount}
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
          minIncomeAmount={expensesAmount + goalsAmount}
          expensesAmount={expensesAmount}
          maxExpensesAmount={maxExpensesAmount}
          savingsTransferAmount={savingsTransferAmount}
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
