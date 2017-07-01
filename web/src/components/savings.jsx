import { observer } from 'mobx-react'
import React from 'react'

import { Bar, BarPart } from './bar'
import state from '../lib/state'

const Savings = observer(() => (
  <section className='savings'>
    <h2>Savings</h2>
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

export default Savings
