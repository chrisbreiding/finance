/* global window */

module.exports = (type) => {
  window.addEventListener('load', () => {
    const { ipcRenderer } = require('electron')
    const $ = window.$ = require('jquery')
    const driver = require('./driver')

    function login () {
      ipcRenderer.on(`citi-${type}:credentials`, (event, { username, password }) => {
        $('#username').val(username)
        $('#password').val(password)
        $('#logInForm').submit()
      })

      ipcRenderer.send(`get:citi-${type}:credentials`)
    }

    window.login = login

    // function getMinimumBalance () {
    //   const amountText = $('.cA-spf-creditCardAccountPanel:first .cA-spf-thirdBalanceElementValue span').text()
    //   return Number(amountText.replace(/[\$ ,]+/g, ''))
    // }

    // function isAfterBillPaid () {
    //   return getMinimumBalance() === 0
    // }

    // function getAmount () {
    //   const amountText = $('.cA-spf-creditCardAccountPanel:first .cA-spf-secondBalanceElementValue span').text()
    //   return driver.amountFromText(amountText)
    // }

    // function getDate () {
    //   const dueDateText = $('.cA-spf-creditCardAccountPanel:first span:contains("Minimum Amount") b').text()
    //   return dueDateText.replace(/Due\s+/, '')
    // }

    function getRewardsAmount () {
      const amountText = $('.cA-spf-rewardsValue').text()
      return driver.amountFromText(amountText)
    }

    function sendInfo () {
      // const data = isAfterBillPaid() ? null : {
      //   amount: getAmount(),
      //   date: getDate(),
      // }

      const data = {}

      data.rewardsAmount = getRewardsAmount()

      ipcRenderer.send(`citi-${type}:info`, null, data)
    }

    const isLogin = /login/.test(window.location.href)
    const isLoggedOut = /signoff/.test(window.location.href)
    const isMain = !!$('.cA-spf-rewardsValue').length

    if (isLogin) {
      const $signOffButton = $('.signOffBtn')
      if ($signOffButton.length) {
        window.location = $signOffButton.attr('href')
      } else {
        login()
      }
    } else if (isLoggedOut) {
      window.location = 'https://online.citi.com/US/login.do'
    } else if (isMain) {
      sendInfo()
    } else {
      setTimeout(() => {
        ipcRenderer.send(`citi-${type}:unexpected:page`)
      }, 5000)
    }
  })
}
