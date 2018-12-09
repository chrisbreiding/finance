/* global window */

window.addEventListener('load', () => {
  const { ipcRenderer } = require('electron')
  const $ = window.$ = require('jquery')
  const driver = require('./driver')

  function login () {
    ipcRenderer.on('amex:credentials', (event, { username, password }) => {
      $('#lilo_userName').val(username)
      $('#lilo_password').val(password)
      $("#lilo_formLogon").submit()
    })

    ipcRenderer.send('get:amex:credentials')
  }

  window.login = login

  // function isAfterBillPaid () {
  //   return !!$('h1:contains("Payment not required")').length
  // }

  // function getAmount () {
  //   const amountText = $('.balance-container .summary-info span:contains("$"):first').text()
  //   return driver.amountFromText(amountText)
  // }

  // function getDate () {
  //   return $('.payments-container .data-value:first').text()
  // }

  function getRewardsAmount () {
    const amountText = $('.loyalty-tile-title').parent().siblings('.data-value').text()
    return driver.amountFromText(amountText)
  }

  function sendInfo () {
    // driver.ensure(() => $('.payments-container .header-container').length)
    driver.ensure(() => $('.loyalty-tile-title').length)
    .then(() => {
      // const data = isAfterBillPaid() ? {} : {
      //   amount: getAmount(),
      //   date: getDate(),
      // }
      const data = {}

      data.rewardsAmount = getRewardsAmount()

      ipcRenderer.send('amex:info', null, data)
    })
    .catch(() => {
      ipcRenderer.send('amex:info', { message: 'Failed trying to ensure payments container' })
    })
  }

  const isLogin = !!$('#lilo_formLogon').length
  const isMainPage = !!$('.balance-container .summary-info').length

  if (isLogin) {
    login()
  } else if (isMainPage) {
    sendInfo()
  } else {
    ipcRenderer.send('amex:unexpected:page')
  }
})
