/* global window */

window.addEventListener('load', () => {
  const { ipcRenderer } = require('electron')
  const $ = window.$ = require('jquery')
  const driver = require('./driver')

  function login () {
    ipcRenderer.on('discover:credentials', (event, { username, password }) => {
      $('#login-form-content #userid-content').val(username)
      $('#login-form-content #password-content').val(password)
      $('#login-form-content').submit()
    })

    ipcRenderer.send('get:discover:credentials')
  }

  window.login = login

  // function isAfterBillPaid () {
  //   return Number($('.min-payment-due').text()) === 0
  // }

  // function getAmount () {
  //   const amountText = $('.statement-balance').text()
  //   return driver.amountFromText(amountText)
  // }

  // function getDate () {
  //   return $('.payment-due-date').text()
  // }

  function getRewardsAmount () {
    const amountText = $('.cashback-bonus-amount').text()
    return driver.amountFromText(amountText)
  }

  function sendInfo () {
    // const data = isAfterBillPaid() ? null : {
    //   amount: getAmount(),
    //   date: getDate(),
    // }

    const data = {}

    data.rewardsAmount = getRewardsAmount()

    ipcRenderer.send('discover:info', null, data)
  }

  const shouldIgnore = /signin/.test(window.location.href)

  if (shouldIgnore) {
    return
  }

  const isLogin = !!$('.content-login-wrapper #login-form-content').length
  const isMain = !!$('.cashback-bonus-amount').length

  if (isLogin) {
    login()
  } else if (isMain) {
    sendInfo()
  } else {
    ipcRenderer.send('discover:unexpected:page')
  }
})
