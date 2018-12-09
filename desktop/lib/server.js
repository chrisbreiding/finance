const express = require('express')
const fs = require('fs')
const http = require('http')
const https = require('https')
const moment = require('moment')
const morgan = require('morgan')
const path = require('path')
const Promise = require('bluebird')

const ipc = require('./ipc')
const remoteStore = require('./remote-store')
const scraper = require('./scrapers')
const util = require('./util')

const allowedDomains = /^(https?:\/\/finance\.crbapps\.com|https?:\/\/localhost:800\d)/
const app = express()

let remoteStoreReady

if (util.isDev && util.isDebug()) {
  app.use(morgan('tiny'))
}

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

app.get('/alerts', (req, res) => {
  res.json({ alerts: util.getAlerts() })
})

app.post('/refresh', (req, res) => {
  ipc.sendTitle(`Refreshing balances & rewards - ${moment().format('MM/DD/YY hh:mm:ssa')}`)
  Promise.all([
    scraper.getBankBalances(),
    scraper.getRewards(),
  ])
  .then(([balances, rewards]) => {
    ipc.sendInfo('Balances', util.formatBalances(balances))
    ipc.sendInfo('Rewards', util.formatRewards(rewards))
    return remoteStoreReady.then(() => {
      return remoteStore.save(Object.assign(
        balances,
        { rewards },
        { lastUpdated: new Date().toISOString() }
      ))
    })
  })
  .then(() => {
    ipc.sendInfo('Succeeded saving balances & rewards')
    res.sendStatus(204)
    return null
  })
  .catch((err) => {
    ipc.sendError('Failed scraping balances & rewards', err)
    res.status(500).send(err)
    return null
  })
})

const options = {
  key: fs.readFileSync(path.join(__dirname, '..', 'certs', 'server.key')),
  cert: fs.readFileSync(path.join(__dirname, '..', 'certs', 'server.crt')),
  ciphers: 'ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA:ECDHE-RSA-AES256-SHA384',
  honorCipherOrder: true,
  secureProtocol: 'TLSv1_2_method',
}

const start = () => {
  remoteStoreReady = remoteStore.start()

  if (util.isDev) {
    const port = 4194
    http
    .createServer(app)
    .listen(port, () => {
      ipc.sendInfo(`Server listening on ${port}...`)
    })
  } else {
    const port = 4193
    https
    .createServer(options, app)
    .listen(port, () => {
      ipc.sendInfo(`Server listening on ${port}...`)
    })
  }
}

module.exports = {
  start,
}
