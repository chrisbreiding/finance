import { action, extendObservable } from 'mobx'
import { observer } from 'mobx-react'
import React, { Component } from 'react'

import { Bar, BarPart } from './bar'
import Modal from './modal'
import state from '../lib/state'
import { ensureNumber, format$ } from '../lib/util'

const EditAccounts = observer((props) => {
  // eslint-disable-next-line one-var
  let savingsNode, moneyMarketNode, iBondsAvailableNode, iBondsUnavailableNode, checkingNode

  const save = (e) => {
    e.preventDefault()

    props.onSave({
      savingsBalance: ensureNumber(savingsNode.value),
      moneyMarketBalance: ensureNumber(moneyMarketNode.value),
      iBondsAvailableBalance: ensureNumber(iBondsAvailableNode.value),
      iBondsUnavailableBalance: ensureNumber(iBondsUnavailableNode.value),
      checkingBalance: ensureNumber(checkingNode.value),
    })
  }

  return (
    <Modal className='editor edit-accounts' isShowing={props.isEditing}>
      <button className='close' onClick={props.onClose}>
        <i className='fa fa-fw fa-remove' />
      </button>

      <form onSubmit={save} noValidate>
        <div className={'group edit-savings'}>
          <label>Savings</label>
          <input
            ref={(node) => savingsNode = node}
            defaultValue={state.savingsBalance}
          />
        </div>
        <div className={'group edit-money-market'}>
          <label>Money Market</label>
          <input
            ref={(node) => moneyMarketNode = node}
            defaultValue={state.moneyMarketBalance}
          />
        </div>
        <div className={'group edit-ibonds-available'}>
          <label>I-Bonds (Available)</label>
          <input
            ref={(node) => iBondsAvailableNode = node}
            defaultValue={state.iBondsAvailableBalance}
          />
        </div>
        <div className={'group edit-ibonds-unavailable'}>
          <label>I-Bonds (Unavailable)</label>
          <input
            ref={(node) => iBondsUnavailableNode = node}
            defaultValue={state.iBondsUnavailableBalance}
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
  <article className='savings'>
    <header>
      <h2>
      Savings
        <div className='controls'>
          <button onClick={onEdit}>
            <i className='fa fa-edit' />
          </button>
        </div>
      </h2>
      <div className='spacer' />
      <div className='total'>
        <span className='total-amount'>{format$(state.savingsBalance)}</span>
      </div>
    </header>
    <Bar>
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
  </article>
))

export const MoneyMarket = observer(({ onEdit }) => (
  <article className='money-market'>
    <header>
      <h2>
      Money Market
        <div className='controls'>
          <button onClick={onEdit}>
            <i className='fa fa-edit' />
          </button>
        </div>
      </h2>
      <div className='spacer' />
      <div className='total'>
        <span className='total-amount'>{format$(state.moneyMarketBalance)}</span>
      </div>
    </header>
    <Bar>
      <BarPart
        id='money-market'
        label='allocated'
        type='money-market'
        draggable={false}
        percent={state.allocatedMoneyMarketAmount / state.moneyMarketBalance * 100}
        value={state.allocatedMoneyMarketAmount}
      />
      <BarPart
        id='money-market-left'
        label='left'
        type='left'
        draggable={false}
        percent={(state.moneyMarketBalance - state.allocatedMoneyMarketAmount) / state.moneyMarketBalance * 100}
        value={state.moneyMarketBalance - state.allocatedMoneyMarketAmount}
      />
    </Bar>
  </article>
))

export const IBonds = observer(({ onEdit }) => {
  if (
    state.iBondsAvailableBalance === 0
    && state.iBondsUnavailableBalance === 0
  ) return null

  const totalIBondsBalance = state.iBondsAvailableBalance + state.iBondsUnavailableBalance

  return (
    <article className='i-bonds'>
      <header>
        <h2>
        I-Bonds
          <div className='controls'>
            <button onClick={onEdit}>
              <i className='fa fa-edit' />
            </button>
          </div>
        </h2>
        <div className='spacer' />
        <div className='total'>
          <span className='total-amount'>{format$(totalIBondsBalance)}</span>
        </div>
      </header>
      <Bar>
        <BarPart
          id='i-bonds-unavailable'
          label='unavailable'
          type='i-bonds-unavailable'
          draggable={false}
          percent={state.iBondsUnavailableBalance / totalIBondsBalance * 100}
          value={state.iBondsUnavailableBalance}
        />
        <BarPart
          id='i-bonds-allocated'
          label='allocated'
          type='i-bonds-allocated'
          draggable={false}
          percent={state.allocatedIBondsAmount / totalIBondsBalance * 100}
          value={state.allocatedIBondsAmount}
        />
        <BarPart
          id='i-bonds-left'
          label='left'
          type='left'
          draggable={false}
          percent={(state.iBondsAvailableBalance - state.allocatedIBondsAmount) / totalIBondsBalance * 100}
          value={state.iBondsAvailableBalance - state.allocatedIBondsAmount}
        />
      </Bar>
    </article>
  )
})

export const Checking = observer(({ onEdit }) => {
  if (state.checkingBalance === 0) return null

  return (
    <article className='checking'>
      <header>
        <h2>
        Checking
          <div className='controls'>
            <button onClick={onEdit}>
              <i className='fa fa-edit' />
            </button>
          </div>
        </h2>
        <div className='spacer' />
        <div className='total'>
          <span className='total-amount'>{format$(state.checkingBalance)}</span>
        </div>
      </header>
      <Bar />
    </article>
  )
})

class Accounts extends Component {
  constructor (props) {
    super(props)

    extendObservable(this, {
      isEditing: false,
    })
  }

  render () {
    return (
      <section className='accounts'>
        <Savings onEdit={this._edit(true)} />
        <MoneyMarket onEdit={this._edit(true)} />
        <IBonds onEdit={this._edit(true)} />
        <Checking onEdit={this._edit(true)} />
        <EditAccounts
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

    state.updateData(values)
    this.props.onSave()
  })
}

export default observer(Accounts)
