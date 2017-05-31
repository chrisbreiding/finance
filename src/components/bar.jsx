import _ from 'lodash'
import React from 'react'

import { format$ } from '../lib/util'

export const BarPart = ({ label, percent, value }) => (
  <div className={`bar-part ${_.kebabCase(label)}`} style={{ width: `${percent}%` }}>
    <label>{label}</label>
    <span>{format$(value)}</span>
  </div>
)

export const Bar = ({ children, total }) => (
  <div className='bar'>
    <main>
      {children}
    </main>
    <div className='total'>{format$(total)}</div>
  </div>
)
