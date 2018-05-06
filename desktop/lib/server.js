const express = require('express')
const moment = require('moment')

const ipc = require('./ipc')
const remoteStore = require('./remote-store')
const scraper = require('./scrapers')
const util = require('./util')

const allowedDomains = /^(https?:\/\/finance\.crbapps\.com|http:\/\/localhost:800\d)/
const app = express()
const TIMEOUT = 30000

let remoteStoreReady

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
  ipc.sendTitle(`Refreshing balances - ${moment().format('MM/DD/YY hh:mm:ssa')}`)
  return scraper.getBankBalances()
 .timeout(TIMEOUT)
 .then((balances) => {
   ipc.sendInfo('Totals', util.formatBalances(balances))
   return remoteStoreReady.then(() => {
     return remoteStore.save(Object.assign(balances, {
       lastUpdated: new Date().toISOString(),
     }))
   })
 })
 .then(() => {
   ipc.sendInfo('Succeeded saving balances')
   res.sendStatus(204)
   return null
 })
 .catch((err) => {
   ipc.sendError('Failed scraping balances', err)
   res.status(500).send(err)
   return null
 })
})

const start = () => {
  remoteStoreReady = remoteStore.start()

  const port = util.isDev ? 4194 : 4193
  app.listen(port, () => {
    ipc.sendInfo(`Server listening on ${port}...`)
  })
}

module.exports = {
  start,
}
