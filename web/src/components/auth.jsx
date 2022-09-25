import React from 'react'

import api from '../lib/api'

const Auth = ({ onAuth }) => {
  let apiKey

  const updateApiKey = (e) => {
    apiKey = e.target.value
  }

  const submit = (e) => {
    e.preventDefault()
    if (!apiKey) return

    api.authenticate(apiKey).then(onAuth).catch(() => {})
  }

  return (
    <div className='auth'>
      <form onSubmit={submit}>
        <h2>Firebase API Key</h2>
        <input placeholder='api key...' onChange={updateApiKey} />
      </form>
    </div>
  )
}

export default Auth
