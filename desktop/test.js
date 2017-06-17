/* eslint-disable no-console */

const rp = require('request-promise')

console.log('Testing...')

const log = (header, data) => {
  console.log()
  console.log(`---- ${header} ----`)
  console.log()
  console.log(data)
  console.log()
}

rp.post('http://localhost:4193/refresh')
.then((balances) => {
  log('Success', balances)
})
.catch((err) => {
  log('Error', err)
})
