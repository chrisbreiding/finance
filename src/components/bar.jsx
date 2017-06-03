import React, { Children } from 'react'

import { format$ } from '../lib/util'

export const BarPart = ({ label, percent, value, isEven, type = '' }) => (
  <div className={`bar-part ${type} ${isEven ? 'even' : 'odd'}`} style={{ width: `${percent}%` }}>
    <label><span>{format$(value)}</span> {label}</label>
  </div>
)

export const Bar = ({ children, total }) => (
  <div className='bar'>
    <main>
      {Children.map(children, (child, index) => (
        React.cloneElement(child, { isEven: index % 2 === 0 })
      ))}
    </main>
    <div className='total'>{format$(total)}</div>
  </div>
)
