/* global window */

window.addEventListener('load', () => {
  const { ipcRenderer } = require('electron')
  const $ = window.$ = require('jquery')
  const driver = require('./driver')

  function login () {
    ipcRenderer.on('peco:credentials', (event, { username, password }) => {
      driver.ensure(() => $('#SignInController #Username').length)
      .then(() => {
        const formScope = window.angular.element($('#SignInController ng-form')[0]).scope()
        formScope.model.SignInSection.Username = username
        formScope.model.SignInSection.Password = password
        formScope.$broadcast = () => {} // disable validation
        formScope.signIn()
      })
      .catch(() => {
        ipcRenderer.send('peco:billing', { message: 'Failed trying to ensure login container' })
      })
    })

    ipcRenderer.send('get:peco:credentials')
  }

  function isAfterBillPaid () {
    // TODO: need to correctly determine this
    return false
  }

  function getAmount () {
    const amountText = $('.exc-account-data p:contains("Total Amount Due") span').text()
    return Number(amountText.replace(/[\$ ,]+/g, ''))
  }

  function getDate () {
    const dateText = $('.exc-account-data p:contains("Due Date") span').text()
    return dateText.replace(/\*+/g, '')
  }

  function sendBillingInfo () {
    driver.ensure(() => $('.exc-account-data p:contains("Total Amount Due") span').text())
    .then(() => {
      const data = isAfterBillPaid() ? null : {
        amount: getAmount(),
        date: getDate(),
      }

      ipcRenderer.send('peco:billing', null, data)
    })
    .catch(() => {
      ipcRenderer.send('peco:billing', { message: 'Failed trying to ensure account data container' })
    })
  }

  const isLogin = /Login/.test(window.location.href)

  if (isLogin) {
    login()
  } else {
    sendBillingInfo()
  }
})
