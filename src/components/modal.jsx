import cs from 'classnames'
import React from 'react'

import Portal from './portal'

const Modal = ({ children, className, isShowing }) => (
  <Portal isShowing={isShowing}>
    <div className={cs('modal', className)}>
      <div className='modal-container'>
        {children}
      </div>
    </div>
  </Portal>
)

export default Modal
