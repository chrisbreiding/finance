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

  function isAfterBillPaid () {
    return Number($('.min-payment-due').text()) === 0
  }

  function getAmount () {
    const amountText = $('.statement-balance').text()
    return Number(amountText.replace(/[\$ ,]+/g, ''))
  }

  function getDate () {
    return $('.payment-due-date').text()
  }

  function sendBillingInfo () {
    const data = isAfterBillPaid() ? null : {
      amount: getAmount(),
      date: getDate(),
    }

    ipcRenderer.send('discover:billing', null, data)
  }

  const shouldIgnore = /signin/.test(window.location.href)

  if (shouldIgnore) {
    return
  }

  const isLogin = !!$('.content-login-wrapper #login-form-content').length

  if (isLogin) {
    login()
  } else {
    sendBillingInfo()
  }
})
