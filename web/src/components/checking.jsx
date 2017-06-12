import { observer } from 'mobx-react'
import React from 'react'

import { Bar } from './bar'
import state from '../lib/state'

const Checking = observer(() => (
  <section className='checking'>
    <h2>Checking</h2>
    <Bar total={state.checkingBalance} />
  </section>
))

export default Checking
