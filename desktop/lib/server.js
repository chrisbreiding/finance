const express = require('express')
const fs = require('fs')
const https = require('https')
const moment = require('moment')
const morgan = require('morgan')
const path = require('path')

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
  ipc.sendTitle(`Refreshing balances - ${moment().format('MM/DD/YY hh:mm:ssa')}`)
  return scraper.getBankBalances()
  .then((balances) => {
    ipc.sendInfo('Balances', util.formatBalances(balances))
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

const options = {
  key: fs.readFileSync(path.join(__dirname, '..', 'certs', 'server.key')),
  cert: fs.readFileSync(path.join(__dirname, '..', 'certs', 'server.crt')),
  ciphers: 'ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA:ECDHE-RSA-AES256-SHA384',
  honorCipherOrder: true,
  secureProtocol: 'TLSv1_2_method',
}

const start = () => {
  remoteStoreReady = remoteStore.start()

  const port = util.isDev ? 4194 : 4193

  https
  .createServer(options, app)
  .listen(port, () => {
    ipc.sendInfo(`Server listening on ${port}...`)
  })
}

module.exports = {
  start,
}
