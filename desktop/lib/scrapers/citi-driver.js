/* global window */

module.exports = (type) => {
  window.addEventListener('load', () => {
    const { ipcRenderer } = require('electron')
    const $ = window.$ = require('jquery')
    const driver = require('./driver')

    if (window.debug) {
      debugger
    }

    window.ipcRenderer = ipcRenderer

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

    const rewardsValueSelector = '.cA-mrc-rewardsvalue'

    function getRewardsAmount () {
      const amountText = $(rewardsValueSelector).text()
      return driver.amountFromText(amountText)
    }

    function sendRewardsAmount (rewardsAmount) {
      ipcRenderer.send(`citi-${type}:info`, null, { rewardsAmount })
    }

    window.sendRewardsAmount = sendRewardsAmount

    function sendInfo () {
      // const data = isAfterBillPaid() ? null : {
      //   amount: getAmount(),
      //   date: getDate(),
      // }

      sendRewardsAmount(getRewardsAmount())
    }

    const isLogin = /login/.test(window.location.href)
    const isLoggedOut = /signoff/.test(window.location.href)
    const isMain = !!$(rewardsValueSelector).length

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
