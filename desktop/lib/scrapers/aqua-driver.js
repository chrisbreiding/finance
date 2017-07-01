/* global window */

window.addEventListener('load', () => {
  const { ipcRenderer } = require('electron')
  const $ = window.$ = require('jquery')

  function login () {
    ipcRenderer.on('aqua:credentials', (event, { username, password }) => {
      $('#UserName').val(username)
      $('#Password').val(password)
      $(".login_form form").submit()
    })

    ipcRenderer.send('get:aqua:credentials')
  }

  function isAfterBillPaid () {
    // TODO: need to correctly determine this
    return false
  }

  function getAmount () {
    const amountText = $('span:contains("Due ")').prev().text()
    return Number(amountText.trim().replace(/[\$ ,]+/g, ''))
  }

  function getDate () {
    const dateText = $('span:contains("Due ")').text()
    return dateText.replace(/Due\s+/, '')
  }

  function sendBillingInfo () {
    const data = isAfterBillPaid() ? null : {
      amount: getAmount(),
      date: getDate(),
    }

    ipcRenderer.send('aqua:billing', null, data)
  }

  const isLogin = !!$('.login_form').length

  if (isLogin) {
    login()
  } else {
    sendBillingInfo()
  }
})
