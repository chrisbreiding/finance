import { observer } from 'mobx-react'
import React from 'react'

import { Bar, BarPart } from './bar'
import util from '../lib/util'
import state from '../lib/state'

const Income = observer(() => {
  const income = state.incomeAmount
  const expensesPercent = state.expensesAmount / income * 100
  const goalsPercent = state.goalsAmount / income * 100
  const leftoverPercent = 100 - expensesPercent - goalsPercent
  const maxExpensesAmount = income - state.goalsAmount

  return (
    <section className='income'>
      <h2>Income</h2>
      <Bar total={income}>
        <BarPart
          id='income-budgeted'
          label='budgeted'
          type='expense'
          percent={expensesPercent}
          value={util.rounded(state.expensesAmount, maxExpensesAmount, income)}
          onUpdatePercent={(percent) => {
            const amount = util.percentToAmount(income, percent)
            state.setExpensesAmount(amount > maxExpensesAmount ? maxExpensesAmount : amount)
          }}
          onFinishUpdatingPercent={() => {
            state.setExpensesAmount(util.rounded(state.expensesAmount, maxExpensesAmount, income))
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
    </section>
  )
})

export default Income
