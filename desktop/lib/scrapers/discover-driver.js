/* global window */

window.addEventListener('load', () => {
  const { ipcRenderer } = require('electron')
  const $ = window.$ = require('jquery')

  function login () {
    ipcRenderer.on('discover:credentials', (event, { username, password }) => {
      $('.content-login-wrapper #userid').val(username)
      $('.content-login-wrapper #password').val(password)
      $('.content-login-wrapper #login-form-content').submit()
    })

    ipcRenderer.send('get:discover:credentials')
  }

  window.login = login

  // Date format: 06/22/2017

  // Last statement balance
  // $('.statement-balance').text()
  // $('.last-statement-bal-date').text()

  // $('.min-payment-due').text()

  // Next payment due: $('.payment-due-date').text()
  // $('.last-payment-amount').text()
  // $('.last-payment-date').text()

  function isAfterBillPaid () {
    return Number($('.min-payment-due').text()) === 0
  }

  function getAmount () {
    return 'TBD'
  }

  function getDate () {
    return 'TBD'
  }

  function sendBillingInfo () {
    const data = isAfterBillPaid() ? null : {
      amount: getAmount(),
      date: getDate(),
    }

    ipcRenderer.send('discover:billing', null, data)
  }

  const isLogin = !!$('#login-form-content').length

  if (isLogin) {
    login()
  } else {
    sendBillingInfo()
  }
})
