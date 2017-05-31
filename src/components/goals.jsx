import { observer } from 'mobx-react'
import React from 'react'

import { Bar, BarPart } from './bar'

const Goal = observer((props) => (
  <li>
    <h3>{props.label}</h3>
    <Bar total={props.totalAmount}>
      <BarPart
        label='Saved'
        percent={props.savedAmount / props.totalAmount * 100}
        value={props.savedAmount}
      />
      <BarPart
        label='This Month'
        percent={props.plannedAmount / props.totalAmount * 100}
        value={props.plannedAmount}
      />
    </Bar>
  </li>
))

const updateGoal = (goal, save) => (propName) => (e) => {
  if (propName === 'label') {
    goal[propName] = e.target.value
  } else {
    const numberValue = Number(e.target.value)
    goal[propName] = isNaN(numberValue) ? 0 : numberValue
  }

  save()
}

const Goals = observer(({ goals, onAdd, onSave }) => (
  <div className='goals'>
    <h2>Goals</h2>
    {!goals.length && <p>No goals yet</p>}
    <ul>
      {goals.map((goal) => (
        <Goal
          key={goal.id}
          {...goal}
          onUpdate={updateGoal(goal, onSave)}
        />
      ))}
    </ul>
    <button onClick={onAdd}>
      <i className='fa fa-plus' /> Add Goal
    </button>
  </div>
))

export default Goals
