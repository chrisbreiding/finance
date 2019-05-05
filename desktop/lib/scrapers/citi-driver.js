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

    function sendData (error, data) {
      ipcRenderer.send(`citi-${type}:info`, error, data)
    }

    window.sendData = sendData

    function sendInfo () {
      driver.ensure(() => $(rewardsValueSelector).length)
      .then(() => {
        // const data = isAfterBillPaid() ? {} : {
        //   amount: getAmount(),
        //   date: getDate(),
        // }

        sendData(null, {
          rewardsAmount: getRewardsAmount(),
        })
      })
      .catch(() => {
        sendData({ message: 'Failed trying to ensure rewards amount container' })
      })
    }

    const isLogin = /login/.test(window.location.href)
    const isLoggedOut = /signoff/.test(window.location.href)
    const isMain = /dashboard/.test(window.location.href)

    const localStorageKey = `__finance__numRetriesCiti${type}`

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
      const numRetries = window.localStorage[localStorageKey] || 0
      if (numRetries > 5) {
        window.localStorage[localStorageKey] = 0
        ipcRenderer.send(`citi-${type}:unexpected:page`)
      } else {
        window.localStorage[localStorageKey] = numRetries + 1
        window.location.reload()
      }
    }
  })
}
