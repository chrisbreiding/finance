/* global window */

module.exports = (type) => {
  window.addEventListener('load', () => {
    const { ipcRenderer } = require('electron')
    const $ = window.$ = require('jquery')

    function login () {
      ipcRenderer.on(`citi-${type}:credentials`, (event, { username, password }) => {
        $('#username').val(username)
        $('#password').val(password)
        $('#logInForm').submit()
      })

      ipcRenderer.send(`get:citi-${type}:credentials`)
    }

    function getMinimumBalance () {
      const amountText = $('.cA-spf-creditCardAccountPanel:first .cA-spf-thirdBalanceElementValue span').text()
      return Number(amountText.replace(/[\$ ,]+/g, ''))
    }

    function isAfterBillPaid () {
      return getMinimumBalance() === 0
    }

    function getAmount () {
      const amountText = $('.cA-spf-creditCardAccountPanel:first .cA-spf-secondBalanceElementValue span').text()
      return Number(amountText.replace(/[\$ ,]+/g, ''))
    }

    function getDate () {
      const dueDateText = $('.cA-spf-creditCardAccountPanel:first span:contains("Minimum Amount") b').text()
      return dueDateText.replace(/Due\s+/, '')
    }

    function sendBillingInfo () {
      const data = isAfterBillPaid() ? null : {
        amount: getAmount(),
        date: getDate(),
      }

      ipcRenderer.send(`citi-${type}:billing`, null, data)
    }

    const isLogin = /login/.test(window.location.href)

    if (isLogin) {
      login()
    } else {
      sendBillingInfo()
    }
  })
}
