/* global window */

window.addEventListener('load', () => {
  const { ipcRenderer } = require('electron')
  const $ = window.$ = require('jquery')

  function login () {
    ipcRenderer.on('alliant:credentials', (event, { username, password }) => {
      $('#ctl00_pagePlaceholder_txt_username').val(username)
      $('#ctl00_pagePlaceholder_txt_password').val(password)
      $('#ctl00_pagePlaceholder_btn_logon').click()
    })

    ipcRenderer.send('get:alliant:credentials')
  }

  function answerSecurityQuestion () {
    ipcRenderer.on('alliant:credentials', (event, { questions }) => {
      const question = $('#ctl00_pagePlaceholder_ucSecurityQuestion_lblQuestion').text()
      const [, lastWord = ''] = question.match(/\s(\w+)\?$/) || []

      $('#ctl00_pagePlaceholder_ucSecurityQuestion_txtAnswer').val(questions[lastWord])
      $('#ctl00_pagePlaceholder_btnContinue').click()
    })

    ipcRenderer.send('get:alliant:credentials')
  }

  function getBalance (accountName) {
    const balanceString = (
      $('#ctl00_ctl00_pagePlaceholder_sectionContent_tblAccountSummary')
      .find(`td a:contains("${accountName}")`)
      .closest('td')
      .next()
      .next()
      .text()
    ) || ''

    return Number(balanceString.trim().replace(/[$,]/g, ''))
  }

  function sendBalances () {
    ipcRenderer.send('alliant:balances', null, {
      checkingBalance: getBalance('Checking'),
      savingsBalance: getBalance('Savings Account'),
    })
  }

  const isLogin = !!$('#ctl00_pagePlaceholder_txt_username').length
  const isSecurityQuestion = !!$('#ctl00_pagePlaceholder_ucSecurityQuestion_txtAnswer').length

  debugger

  if (isLogin) {
    login()
  } else if (isSecurityQuestion) {
    answerSecurityQuestion()
  } else {
    sendBalances()
  }
})
