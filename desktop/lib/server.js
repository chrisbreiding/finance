const express = require('express')
const moment = require('moment')

const remoteStore = require('./remote-store')
const scraper = require('./scrapers')
const util = require('./util')

const allowedDomains = /^(https?:\/\/finance\.crbapps\.com|http:\/\/localhost:800\d)/
const app = express()
const TIMEOUT = 30000

const remoteStoreReady = remoteStore.start()

// cors
app.use((req, res, next) => {
  const origin = req.get('Origin')

  if (!origin) {
    return next()
  }

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
  util.logInfo('-----', moment().format('MM/DD/YY hh:mm:ssA'), '-----')
  util.logInfo('Refreshing balances')
  scraper.getWellsFargoBalances()
 .timeout(TIMEOUT)
 .then((balances) => {
   util.logInfo('Succeeded scraping balances:', balances)
   return remoteStoreReady.then(() => {
     return remoteStore.save(Object.assign(balances, {
       lastUpdated: new Date().toISOString(),
     }))
   })
 })
 .then(() => {
   util.logInfo('Succeeded saving balances')
   res.sendStatus(204)
 })
 .catch((err) => {
   util.logError('Failed scraping balances:', err.stack || err)
   res.status(500).send(err)
 })
})

const port = util.isDev ? 4194 : 4193
app.listen(port, () => {
  util.logInfo(`Listening on ${port}...`)
})
