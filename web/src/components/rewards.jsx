import React from 'react'

import state from '../lib/state'
import util from '../lib/util'

const rewards = [
  { label: 'Amex', key: 'amex', icon: 'cc-amex' },
  { label: 'Citi MC', key: 'citiMc', icon: 'cc-mastercard' },
  { label: 'Citi Visa', key: 'citiVisa', icon: 'cc-visa' },
  { label: 'Discover', key: 'discover', icon: 'cc-discover' },
]

const Rewards = () => (
  <section className='rewards'>
    <h2>Rewards</h2>
    <ul>
      {rewards.map(({ label, key, icon }) => (
        <li key={key} className={key}>
          <h3><i className={`fa fa-${icon}`} /> {label}</h3>
          <div>{util.format$(state.rewards[key])}</div>
        </li>
      ))}
    </ul>
  </section>
)

export default Rewards
