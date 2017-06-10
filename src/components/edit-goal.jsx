import { observer } from 'mobx-react'
import React from 'react'

import { ensureNumber, format$ } from '../lib/util'
import Modal from './modal'

const EditGoal = observer(({ goal, maxSavedAmount, maxPlannedAmount, isEditing, onClose, onSave, onDelete }) => {
  let label, description, savedAmount, plannedAmount, totalAmount // eslint-disable-line one-var
  const saveGoal = (e) => {
    e.preventDefault()

    onSave({
      label: label.value,
      description: (description.value || '').replace('\n', ' '),
      savedAmount: ensureNumber(savedAmount.value),
      plannedAmount: ensureNumber(plannedAmount.value),
      totalAmount: ensureNumber(totalAmount.value),
    })
  }

  const deleteGoal = (e) => {
    e.preventDefault()
    onDelete()
  }

  return (
    <Modal className='edit-goal' isShowing={isEditing}>
      <button className='close' onClick={onClose}>
        <i className='fa fa-remove' />
      </button>

      <form onSubmit={saveGoal} noValidate>
        <div className='group'>
          <label>Label</label>
          <input
            ref={(node) => label = node}
            defaultValue={goal.label}
          />
        </div>
        <div className='group'>
          <label>Description</label>
          <textarea
            ref={(node) => description = node}
            defaultValue={goal.description}
          />
        </div>
        <div className='group'>
          <label>Saved</label>
          <input
            ref={(node) => savedAmount = node}
            type='number'
            defaultValue={goal.savedAmount}
          />
          <div className='limits'>
            <span className='value'>Min: {format$(0)}</span>
            <span className='value'>Max: {format$(maxSavedAmount)}</span>
          </div>
        </div>
        <div className='group'>
          <label>This Month</label>
          <input
            ref={(node) => plannedAmount = node}
            type='number'
            defaultValue={goal.plannedAmount}
          />
          <div className='limits'>
            <span className='value'>Min: {format$(0)}</span>
            <span className='value'>Max: {format$(maxPlannedAmount)}</span>
          </div>
        </div>
        <div className='group'>
          <label>Total</label>
          <input
            ref={(node) => totalAmount = node}
            type='number'
            defaultValue={goal.totalAmount}
          />
          <div className='limits'>
            <span className='value'>Min: {format$(goal.minTotalAmount)}</span>
          </div>
        </div>
        <div className='group controls'>
          <a className='button delete' onClick={deleteGoal} href='#'>
            <i className='fa fa-ban' /> Delete
          </a>
          <button className='save' type='submit'>
            <i className='fa fa-check' /> Save
          </button>
        </div>
      </form>
    </Modal>
  )
})

export default EditGoal
