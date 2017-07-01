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

  function isAfterBillPaid () {
    return !!$('h1:contains("Payment not required")').length
  }

  function getAmount () {
    const amountText = $('.balance-container .summary-info span:contains("$"):first').text()
    return Number(amountText.replace(/[\$ ,]+/g, ''))
  }

  function getDate () {
    return $('.payments-container .data-value:first').text()
  }

  function sendBillingInfo () {
    driver.ensure(() => $('.payments-container .header-container').length)
    .then(() => {
      const data = isAfterBillPaid() ? null : {
        amount: getAmount(),
        date: getDate(),
      }

      ipcRenderer.send('amex:billing', null, data)
    })
    .catch(() => {
      ipcRenderer.send('amex:billing', { message: 'Failed trying to ensure payments container' })
    })
  }

  const isLogin = !!$('#lilo_formLogon').length

  if (isLogin) {
    login()
  } else {
    sendBillingInfo()
  }
})
