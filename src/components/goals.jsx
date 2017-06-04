import { observer } from 'mobx-react'
import React from 'react'

import util from '../lib/util'
import { Bar, BarPart } from './bar'

const Goal = observer((props) => {
  const {
    label,
    plannedAmount,
    savedAmount,
    setSavedAmount,
    totalAmount,
    setPlannedAmount,
  } = props.goal
  const maxSavedAmount = Math.min(props.unallocatedSavingsAmount + savedAmount, totalAmount - plannedAmount)
  const maxPlannedAmount = Math.min(props.availableIncome + plannedAmount, totalAmount - savedAmount)

  return (
    <li>
      <h3>{label}</h3>
      <Bar total={totalAmount}>
        <BarPart
          label='saved'
          type='savings'
          percent={savedAmount / totalAmount * 100}
          value={util.rounded(savedAmount, maxSavedAmount, totalAmount)}
          onUpdatePercent={(percent) => {
            const amount = util.percentToAmount(totalAmount, percent)
            setSavedAmount(amount > maxSavedAmount ? maxSavedAmount : amount)
          }}
          onFinishUpdatingPercent={() => {
            setSavedAmount(util.rounded(savedAmount, maxSavedAmount, totalAmount))
            props.onSave()
          }}
        />
        <BarPart
          label='this month'
          type='planned'
          prevPercents={savedAmount / totalAmount * 100}
          percent={plannedAmount / totalAmount * 100}
          value={util.rounded(plannedAmount, maxPlannedAmount, totalAmount)}
          onUpdatePercent={(percent) => {
            const amount = util.percentToAmount(totalAmount, percent)
            setPlannedAmount(amount > maxPlannedAmount ? maxPlannedAmount : amount)
          }}
          onFinishUpdatingPercent={() => {
            setPlannedAmount(util.rounded(plannedAmount, maxPlannedAmount, totalAmount))
            props.onSave()
          }}
        />
      </Bar>
    </li>
  )
})

const Goals = observer((props) => (
  <div className='goals'>
    <h2>Goals</h2>
    {!props.goals.length && <p>No goals yet</p>}
    <ul>
      {props.goals.map((goal) => (
        <Goal
          key={goal.id}
          goal={goal}
          unallocatedSavingsAmount={props.unallocatedSavingsAmount}
          availableIncome={props.availableIncome}
          onSave={props.onSave}
        />
      ))}
    </ul>
    <button onClick={props.onAdd}>
      <i className='fa fa-plus' /> Add Goal
    </button>
  </div>
))

export default Goals
