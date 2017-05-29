'use strict'

const express = require('express')
const fs = require('fs-extra')

const db = require('./db')
const scrape = require('./scrape')
const util = require('./util')

const app = express()

// TODO: check access to data and fail immediately if denied?

app.get('/balances', (req, res) => {
  db.fetchBalances()
  .then((data) => {
    res.status(200).json(data)
  })
  .catch((error) => {
    util.logError('Error fetching balances:')
    util.logError(error.stack)
    res.status(500).send(error.stack)
  })
})

app.post('/refresh', (req, res) => {
  scrape.getBalances()
  .timeout(10000)
  .then((balances) => {
    util.logInfo('got balances:', balances)
    return db.saveBalances(balances)
  })
  .then((data) => {
    util.logInfo('saved balances:', data)
    res.status(200).json(data)
  })
  .catch((error) => {
    util.logError('Error refreshing balances:')
    util.logError(error.stack)
    res.status(500).send(error.stack)
  })
})

const port = 8080

app.listen(port, () => {
  util.logInfo(`Listening on ${port}...`)
})
