import cs from 'classnames'
import { action, observable } from 'mobx'
import { observer } from 'mobx-react'
import React, { Component } from 'react'

import { ensureNumber, format$ } from '../lib/util'
import Modal from './modal'

@observer
class EditGoal extends Component {
  @observable showProjectionAmount

  @action componentDidMount () {
    this.showProjectionAmount = this.props.goal.showProjection
  }

  render () {
    const { goal } = this.props

    return (
      <Modal className='editor edit-goal' isShowing={this.props.isEditing}>
        <button className='close' onClick={this.props.onClose}>
          <i className='fa fa-remove' />
        </button>

        <form onSubmit={this._saveGoal} noValidate>
          <div className='group'>
            <label>Label</label>
            <input
              ref='label'
              defaultValue={goal.label}
            />
          </div>
          <div className='group'>
            <label>Description</label>
            <textarea
              ref='description'
              defaultValue={goal.description}
            />
          </div>
          <div className='group'>
            <label>Saved</label>
            <input
              ref='savedAmount'
              type='number'
              defaultValue={goal.savedAmount}
            />
            <div className='limits'>
              <span className='value'>Min: {format$(0)}</span>
              <span className='value'>Max: {format$(this.props.maxSavedAmount)}</span>
            </div>
          </div>
          <div className='group'>
            <label>This Month</label>
            <input
              ref='plannedAmount'
              type='number'
              defaultValue={goal.plannedAmount}
            />
            <div className='limits'>
              <span className='value'>Min: {format$(0)}</span>
              <span className='value'>Max: {format$(this.props.maxPlannedAmount)}</span>
            </div>
          </div>
          <div className='group'>
            <label>Total</label>
            <input
              ref='totalAmount'
              type='number'
              defaultValue={goal.totalAmount}
            />
            <div className='limits'>
              <span className='value'>Min: {format$(goal.minTotalAmount)}</span>
            </div>
          </div>
          <div className={cs('group edit-projection', {
            'show-projection-amount': this.showProjectionAmount,
          })}>
            <label>Projection</label>
            <input
              ref='showProjection'
              type='checkbox'
              defaultChecked={goal.showProjection}
              onChange={this._onChangeShowProjection}
            />
            <label>Amount</label>
            <input
              ref='projectionAmount'
              type='number'
              defaultValue={goal.projectionAmount}
            />
          </div>
          <div className='group controls'>
            <a className='button delete' onClick={this._deleteGoal} href='#'>
              <i className='fa fa-ban' /> Delete
            </a>
            <button className='save' type='submit'>
              <i className='fa fa-check' /> Save
            </button>
          </div>
        </form>
      </Modal>
    )
  }

  @action _onChangeShowProjection = (e) => {
    this.showProjectionAmount = e.currentTarget.checked
  }

  _saveGoal = (e) => {
    e.preventDefault()

    this.props.onSave({
      label: this.refs.label.value,
      description: (this.refs.description.value || '').replace('\n', ' '),
      savedAmount: ensureNumber(this.refs.savedAmount.value),
      plannedAmount: ensureNumber(this.refs.plannedAmount.value),
      totalAmount: ensureNumber(this.refs.totalAmount.value),
      showProjection: this.refs.showProjection.checked,
      projectionAmount: ensureNumber(this.refs.projectionAmount.value),
    })
  }

  _deleteGoal = (e) => {
    e.preventDefault()
    this.props.onDelete()
  }
}

export default EditGoal
