/* global window */

window.addEventListener('load', () => {
  const { ipcRenderer } = require('electron')
  const $ = window.$ = require('jquery')

  function login () {
    ipcRenderer.on('wellsfargo:credentials', (event, { username, password }) => {
      $('#userid').val(username)
      $('#password').val(password)
      $('#frmSignon').submit()
    })

    ipcRenderer.send('get:wellsfargo:credentials')
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
    ipcRenderer.send('wellsfargo:balances', null, {
      checkingBalance: getBalance('CUSTOM MANAGEMENT(RM)'),
      savingsBalance: getBalance('W2S'),
    })
  }

  const isLogin = !!$('#frmSignon').length
  const isBalances = !!$('.account-tile-header .account-name').length

  debugger

  if (isLogin) {
    login()
  } else if (isBalances) {
    sendBalances()
  } else {
    ipcRenderer.send('wellsfargo:unexpected:page')
  }
})
