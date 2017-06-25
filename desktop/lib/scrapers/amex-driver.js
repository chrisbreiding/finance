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
    return 'TBD'
    // const amountText = $('.cA-spf-creditCardAccountPanel:first .cA-spf-secondBalanceElementValue span').text()
    // return Number(amountText.replace(/[\$ ,]+/g, ''))
  }

  function getDate () {
    return new Date().toISOString()
    // const dueDateText = $('.cA-spf-creditCardAccountPanel:first span:contains("Minimum Amount") b').text()
    // return dueDateText.replace(/Due\s+/, '')
  }

  function sendBillingInfo () {
    driver.ensureElement(() => $('.payments-container .header-container'))
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
