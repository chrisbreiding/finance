import React from 'react'

const Loader = ({ children, theme }) => (
  <span className={`loader theme-${theme || 'light'}`}>
    <span className="spinner"></span>
    {children}
  </span>
)

export default Loader
