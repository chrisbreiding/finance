import { action, extendObservable } from 'mobx'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc'

import { rounded, percentToAmount } from '../lib/util'
import { Bar, BarPart } from './bar'
import EditGoal from './edit-goal'

const SortHandle = SortableHandle(() => (
  <span className='sort-handle'>
    <i className='fa fa-ellipsis-v'></i>
    <i className='fa fa-ellipsis-v'></i>
  </span>
))

class Goal extends Component {
  constructor (props) {
    super(props)

    extendObservable(this, {
      isEditing: false,
    })
  }

  render () {
    const { goal } = this.props
    const maxSavedAmount = Math.min(
      this.props.unallocatedSavingsAmount + goal.savedAmount,
      goal.totalAmount - goal.plannedAmount - goal.moneyMarketAmount - goal.iBondsAmount,
    )
    const maxMoneyMarketAmount = Math.min(
      this.props.unallocatedMoneyMarketAmount + goal.moneyMarketAmount,
      goal.totalAmount - goal.plannedAmount - goal.savedAmount - goal.iBondsAmount,
    )
    const maxIBondsAmount = Math.min(
      this.props.unallocatedIBondsAmount + goal.iBondsAmount,
      goal.totalAmount - goal.plannedAmount - goal.savedAmount - goal.moneyMarketAmount,
    )
    const maxPlannedAmount = Math.min(
      this.props.availableIncome + goal.plannedAmount,
      goal.totalAmount - goal.savedAmount - goal.iBondsAmount - goal.moneyMarketAmount,
    )

    return (
      <li className='goal'>
        <header>
          <h3>
            {goal.label}
            <div className='controls'>
              <button onClick={this._edit(true)}>
                <i className='fa fa-edit' />
              </button>
              <SortHandle />
            </div>
          </h3>
          {goal.description && <p className='description'>{goal.description}</p>}
          {goal.projection && <p className='spacer' />}
          {goal.projection && <p className='projection'>
            <i className='fa fa-calendar' />
            {goal.projection}
          </p>}
        </header>
        <Bar total={goal.totalAmount}>
          <BarPart
            id={`goal-${goal.id}-i-bonds`}
            label='i-bonds'
            type='i-bonds-allocated'
            percent={goal.iBondsAmount / goal.totalAmount * 100}
            value={rounded(goal.iBondsAmount, maxIBondsAmount, goal.totalAmount)}
            onUpdatePercent={(percent) => {
              const amount = percentToAmount(goal.totalAmount, percent)
              goal.setProps({
                iBondsAmount: amount > maxIBondsAmount ? maxIBondsAmount : amount,
              })
            }}
            onFinishUpdatingPercent={() => {
              goal.setProps({
                iBondsAmount: rounded(goal.iBondsAmount, maxIBondsAmount, goal.totalAmount),
              })
              this.props.onSave()
            }}
          />
          <BarPart
            id={`goal-${goal.id}-money-market`}
            label='money-market'
            type='money-market'
            prevPercents={goal.iBondsAmount / goal.totalAmount * 100}
            percent={goal.moneyMarketAmount / goal.totalAmount * 100}
            value={rounded(goal.moneyMarketAmount, maxMoneyMarketAmount, goal.totalAmount)}
            onUpdatePercent={(percent) => {
              const amount = percentToAmount(goal.totalAmount, percent)
              goal.setProps({
                moneyMarketAmount: amount > maxMoneyMarketAmount ? maxMoneyMarketAmount : amount,
              })
            }}
            onFinishUpdatingPercent={() => {
              goal.setProps({
                moneyMarketAmount: rounded(goal.moneyMarketAmount, maxMoneyMarketAmount, goal.totalAmount),
              })
              this.props.onSave()
            }}
          />
          <BarPart
            id={`goal-${goal.id}-saved`}
            label='savings'
            type='savings'
            prevPercents={(goal.iBondsAmount + goal.moneyMarketAmount) / goal.totalAmount * 100}
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
            id={`goal-${goal.id}-planned`}
            label='this month'
            type='planned'
            prevPercents={(goal.iBondsAmount + goal.savedAmount) / goal.totalAmount * 100}
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
          <BarPart
            id={`goal-${goal.id}-left`}
            label='left'
            type='left'
            draggable={false}
            percent={goal.amountLeft / goal.totalAmount * 100}
            value={goal.amountLeft}
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

  _edit = action((isEditing) => () => {
    this.isEditing = isEditing
  })

  _save = action((props) => {
    this._edit(false)()
    this.props.goal.setProps(props)
    this.props.onSave()
  })

  _delete = action(() => {
    this.props.onDelete(this.props.goal)
  })
}

const SortableGoal = SortableElement(observer(Goal))

const Goals = observer((props) => (
  <section className='goals'>
    <h2>Goals</h2>
    {!props.goals.length && <p>No goals yet</p>}
    <ul>
      {props.goals.map((goal, index) => (
        <SortableGoal
          key={goal.id}
          index={index}
          goal={goal}
          unallocatedIBondsAmount={props.unallocatedIBondsAmount}
          unallocatedSavingsAmount={props.unallocatedSavingsAmount}
          unallocatedMoneyMarketAmount={props.unallocatedMoneyMarketAmount}
          availableIncome={props.availableIncome}
          onSave={props.onSave}
          onDelete={props.onDelete}
        />
      ))}
    </ul>
    <button className='add-goal' onClick={props.onAdd}>
      <i className='fa fa-plus' /> Add Goal
    </button>
  </section>
))

const SortableGoals = SortableContainer(Goals)

const SortableGoalsContainer = (props) => (
  <SortableGoals
    {...props}
    helperClass='sorting-helper'
    useDragHandle={true}
    onSortStart={props.onSortStart}
    onSortEnd={props.onSortEnd}
    useWindowAsScrollContainer={true}
  />
)

export default SortableGoalsContainer
