import { action, observable } from 'mobx'
import { observer } from 'mobx-react'
import React, { Component } from 'react'

import { Bar, BarPart } from './bar'
import Modal from './modal'
import state from '../lib/state'
import { ensureNumber } from '../lib/util'

const EditAccounts = observer((props) => {
  let savingsNode, checkingNode // eslint-disable-line one-var

  const save = (e) => {
    e.preventDefault()

    props.onSave({
      savingsBalance: ensureNumber(savingsNode.value),
      checkingBalance: ensureNumber(checkingNode.value),
    })
  }

  return (
    <Modal className='editor edit-accounts' isShowing={props.isEditing}>
      <button className='close' onClick={props.onClose}>
        <i className='fa fa-remove' />
      </button>

      <form onSubmit={save} noValidate>
        <div className={'group edit-savings'}>
          <label>Savings</label>
          <input
            ref={(node) => savingsNode = node}
            defaultValue={state.savingsBalance}
          />
        </div>
        <div className={'group edit-checking'}>
          <label>Checking</label>
          <input
            ref={(node) => checkingNode = node}
            defaultValue={state.checkingBalance}
          />
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

export const Savings = observer(({ onEdit }) => (
  <section className='savings'>
    <h2>
      Savings
      <div className='controls'>
        <button onClick={onEdit}>
          <i className='fa fa-edit' />
        </button>
      </div>
    </h2>
    <Bar total={state.savingsBalance}>
      <BarPart
        id='savings'
        label='allocated'
        type='savings'
        draggable={false}
        percent={state.allocatedSavingsAmount / state.savingsBalance * 100}
        value={state.allocatedSavingsAmount}
      />
      <BarPart
        id='savings-left'
        label='left'
        type='left'
        draggable={false}
        percent={(state.savingsBalance - state.allocatedSavingsAmount) / state.savingsBalance * 100}
        value={state.savingsBalance - state.allocatedSavingsAmount}
      />
    </Bar>
  </section>
))

export const Checking = observer(({ onEdit }) => (
  <section className='checking'>
    <h2>
      Checking
      <div className='controls'>
        <button onClick={onEdit}>
          <i className='fa fa-edit' />
        </button>
      </div>

    </h2>
    <Bar total={state.checkingBalance} />
  </section>
))

@observer
class Accounts extends Component {
  @observable isEditing = false

  render () {
    return (
      <>
        <Savings onEdit={this._edit(true)} />
        <Checking onEdit={this._edit(true)} />
        <EditAccounts
          isEditing={this.isEditing}
          onClose={this._edit(false)}
          onSave={this._save}
        />
      </>
    )
  }

  @action _edit = (isEditing) => () => {
    this.isEditing = isEditing
  }

  @action _save = (values) => {
    this._edit(false)()

    state.updateData(values)
    this.props.onSave()
  }
}

export default Accounts
