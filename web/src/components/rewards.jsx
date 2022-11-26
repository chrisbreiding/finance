import _ from 'lodash'
import React, { Component } from 'react'
import { action, extendObservable } from 'mobx'
import { observer } from 'mobx-react'
import moment from 'moment'

import state from '../lib/state'
import { ensureNumber, format$ } from '../lib/util'
import Modal from './modal'

const rewards = [
  { label: 'Amazon Visa', key: 'amazonVisa', icon: 'cc-visa' },
  { label: 'Amex', key: 'amex', icon: 'cc-amex' },
  { label: 'Citi MC', key: 'citiMc', icon: 'cc-mastercard' },
  { label: 'Discover', key: 'discover', icon: 'cc-discover' },
]

const EditRewards = observer((props) => {
  let nodes = {}

  const save = (e) => {
    e.preventDefault()

    const values = _.transform(rewards, (memo, { key }) => {
      memo[key] = ensureNumber(nodes[key].value)
    }, {})

    props.onSave(values)
  }

  return (
    <Modal className='editor edit-rewards' isShowing={props.isEditing}>
      <button className='close' onClick={props.onClose}>
        <i className='fa fa-fw fa-remove' />
      </button>

      <form onSubmit={save} noValidate>
        {rewards.map(({ label, key, icon }) => (
          <div className={`group edit-${key}`} key={key}>
            <label><i className={`fa fa-${icon}`} /> {label}</label>
            <input
              ref={(node) => nodes[key] = node}
              defaultValue={state.getReward(key).amount}
            />
          </div>
        ))}
        <div className='group controls'>
          <button className='save' type='submit'>
            <i className='fa fa-check' /> Save
          </button>
        </div>
      </form>
    </Modal>
  )
})

class Rewards extends Component {
  constructor (props) {
    super(props)

    extendObservable(this, {
      isEditing: false,
    })
  }

  render () {
    return (
      <section className='rewards'>
        <h2>
          Rewards
          <div className='controls'>
            <button onClick={this._edit(true)}>
              <i className='fa fa-edit' />
            </button>
          </div>
        </h2>
        <ul>
          {rewards.map(({ label, key, icon }) => (
            <li key={key} className={key}>
              <h3><i className={`fa fa-${icon}`} /> {label}</h3>
              <div className='amount'>{format$(state.getReward(key).amount)}</div>
            </li>
          ))}
        </ul>
        <EditRewards
          isEditing={this.isEditing}
          onClose={this._edit(false)}
          onSave={this._save}
        />
      </section>
    )
  }

  _edit = action((isEditing) => () => {
    this.isEditing = isEditing
  })

  _save = action((values) => {
    this._edit(false)()

    const rewards = _.transform(values, (memo, amount, key) => {
      if (amount !== state.getReward(key).amount) {
        memo[key] = {
          amount,
          lastUpdated: moment().toISOString(),
        }
      }
    }, {})

    state.updateData({ rewards })
    this.props.onSave()
  })
}

export default observer(Rewards)
