import { action, observable } from 'mobx'
import { observer } from 'mobx-react'
import React, { Component } from 'react'

import { format$, rounded, percentToAmount } from '../lib/util'
import { Bar, BarPart } from './bar'
import Modal from './modal'

const EditGoal = observer(({ goal, maxSavedAmount, maxPlannedAmount, isEditing, onClose, onSave, onDelete }) => (
  <Modal className='edit-goal' isShowing={isEditing}>
    <button className='close' onClick={onClose}>
      <i className='fa fa-remove' />
    </button>

    <form onSubmit={onSave}>
      <div className='group'>
        <label>Label</label>
        <input
          value={goal.label}
          onChange={(e) => {
            goal.setProps({ label: e.target.value })
          }}
        />
      </div>
      <div className='group'>
        <label>Description</label>
        <input
          value={goal.description}
          onChange={(e) => {
            goal.setProps({ description: e.target.value })
          }}
        />
      </div>
      <div className='group'>
        <label>Saved</label>
        <input
          type='number'
          value={goal.savedAmount}
          step='50'
          onChange={(e) => {
            const amount = Number(e.target.value)
            goal.setProps({
              savedAmount: amount > maxSavedAmount ? maxSavedAmount : amount,
            })
          }}
        />
        <div className='limits'>
          <span className='value'>Min: {format$(0)}</span>
          <span className='value'>Max: {format$(maxSavedAmount)}</span>
        </div>
      </div>
      <div className='group'>
        <label>This Month</label>
        <input
          type='number'
          value={goal.plannedAmount}
          step='50'
          onChange={(e) => {
            const amount = Number(e.target.value)
            goal.setProps({
              plannedAmount: amount > maxPlannedAmount ? maxPlannedAmount : amount,
            })
          }}
        />
        <div className='limits'>
          <span className='value'>Min: {format$(0)}</span>
          <span className='value'>Max: {format$(maxPlannedAmount)}</span>
        </div>
      </div>
      <div className='group'>
        <label>Total</label>
        <input
          type='number'
          value={goal.totalAmount}
          onChange={(e) => {
            const amount = Number(e.target.value)
            goal.setProps({
              totalAmount: amount < goal.minTotalAmount ? goal.minTotalAmount : amount,
            })
          }}
        />
        <div className='limits'>
          <span className='value'>Min: {format$(goal.minTotalAmount)}</span>
        </div>
      </div>
      <div className='group controls'>
        <a className='button delete' onClick={onDelete} href='#'>
          <i className='fa fa-ban' /> Delete
        </a>
        <button className='save' type='submit'>
          <i className='fa fa-check' /> Save
        </button>
      </div>
    </form>
  </Modal>
))

@observer
class Goal extends Component {
  @observable isEditing = false

  render () {
    const { goal } = this.props
    const maxSavedAmount = Math.min(this.props.unallocatedSavingsAmount + goal.savedAmount, goal.totalAmount - goal.plannedAmount)
    const maxPlannedAmount = Math.min(this.props.availableIncome + goal.plannedAmount, goal.totalAmount - goal.savedAmount)

    return (
      <li className='goal'>
        <h3>
          {goal.label}
          <button onClick={this._edit(true)}>
            <i className='fa fa-edit' />
          </button>
        </h3>
        {goal.description && <p>{goal.description}</p>}
        <Bar total={goal.totalAmount}>
          <BarPart
            label='saved'
            type='savings'
            percent={goal.savedAmount / goal.totalAmount * 100}
            value={rounded(goal.savedAmount, maxSavedAmount, goal.totalAmount)}
            onUpdatePercent={(percent) => {
              const amount = percentToAmount(goal.totalAmount, percent)
              goal.setProps({
                savedAmount: amount > maxSavedAmount ? maxSavedAmount : amount,
              })
            }}
            onFinishUpdatingPercent={() => {
              goal.setProps({
                savedAmount: rounded(goal.savedAmount, maxSavedAmount, goal.totalAmount),
              })
              this.props.onSave()
            }}
          />
          <BarPart
            label='this month'
            type='planned'
            prevPercents={goal.savedAmount / goal.totalAmount * 100}
            percent={goal.plannedAmount / goal.totalAmount * 100}
            value={rounded(goal.plannedAmount, maxPlannedAmount, goal.totalAmount)}
            onUpdatePercent={(percent) => {
              const amount = percentToAmount(goal.totalAmount, percent)
              goal.setProps({
                plannedAmount: amount > maxPlannedAmount ? maxPlannedAmount : amount,
              })
            }}
            onFinishUpdatingPercent={() => {
              goal.setProps({
                plannedAmount: rounded(goal.plannedAmount, maxPlannedAmount, goal.totalAmount),
              })
              this.props.onSave()
            }}
          />
        </Bar>
        <EditGoal
          goal={goal}
          maxSavedAmount={maxSavedAmount}
          maxPlannedAmount={maxPlannedAmount}
          isEditing={this.isEditing}
          onClose={this._edit(false)}
          onSave={this._save}
          onDelete={this._delete}
        />
      </li>
    )
  }

  @action _edit = (isEditing) => () => {
    this.isEditing = isEditing
  }

  @action _save = (e) => {
    e.preventDefault()
    this._edit(false)()
    this.props.onSave()
  }

  @action _delete = (e) => {
    e.preventDefault()
    this.props.onDelete(this.props.goal)
  }
}

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
          onDelete={props.onDelete}
        />
      ))}
    </ul>
    <button className='add-goal' onClick={props.onAdd}>
      <i className='fa fa-plus' /> Add Goal
    </button>
  </div>
))

export default Goals
