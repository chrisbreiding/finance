import { observer } from 'mobx-react'
import React from 'react'

const Goal = observer((props) => (
  <li>
    <input
      value={props.label}
      onChange={props.onUpdate('label')}
    />
    :{' '}
    <input
      type='number'
      value={props.savedAmount}
      onChange={props.onUpdate('savedAmount')}
    />
    {' '}+{' '}
    <input
      type='number'
      value={props.plannedAmount}
      onChange={props.onUpdate('plannedAmount')}
    />
    {' '}/{' '}
    <input
      type='number'
      value={props.totalAmount}
      onChange={props.onUpdate('totalAmount')}
    />
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
    <button onClick={onAdd}>Add Goal</button>
  </div>
))

export default Goals
