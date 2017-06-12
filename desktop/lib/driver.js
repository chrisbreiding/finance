/* global window */

window.addEventListener('load', () => {
  const { ipcRenderer } = require('electron')
  const $ = window.$ = require('jquery')

  function login () {
    ipcRenderer.on('credentials', (event, { username, password }) => {
      $('#userid').val(username)
      $('#password').val(password)
      $('#frmSignon').submit()
    })

    ipcRenderer.send('get:credentials')
  }

  function getBalance (accountName) {
    const balanceString = (
      $(`.account-name:contains("${accountName}")`)
      .closest('.account-tile-header')
      .find('.account-balance a')
      .text()
    ) || ''

    return Number(balanceString.trim().replace(/[$,]/g, ''))
  }

  function sendBalances () {
    ipcRenderer.send('balances', {
      checkingBalance: getBalance('CUSTOM MANAGEMENT(RM)'),
      savingsBalance: getBalance('W2S'),
    })
  }

  const isLogin = !!$('#frmSignon').length

  if (isLogin) {
    login()
  } else {
    sendBalances()
  }
})
