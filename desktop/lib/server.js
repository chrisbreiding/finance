const express = require('express')

const db = require('./db')
const scrape = require('./scrape')
const util = require('./util')

const allowedDomains = /^(https?:\/\/finance\.crbapps\.com|http:\/\/localhost:800\d)/
const app = express()

// cors
app.use((req, res, next) => {
  const origin = req.get('Origin')
  if (allowedDomains.test(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    next()
  } else {
    res.sendStatus(403)
  }
})

app.get('/ping', (req, res) => {
  res.sendStatus(200)
})

app.post('/refresh', (req, res) => {
  util.logInfo('Refreshing balances')
  scrape.getBalances()
 .timeout(10000)
 .then((balances) => {
   return db.saveBalances(balances)
 })
 .then((balances) => {
   util.logInfo('Succeeded scraping balances')
   res.status(200).send(balances)
 })
 .catch((err) => {
   util.logInfo('Failed scraping balances:', err.stack || err)
   res.status(500).send(err)
 })
})

app.listen(4193, () => {
  util.logInfo('Listening on 4193...')
})
