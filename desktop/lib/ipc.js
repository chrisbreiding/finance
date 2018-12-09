'use strict'

const { ipcMain } = require('electron')
const window = require('./window')

const send = (eventName, ...args) => {
  return window.ensure().then((win) => {
    win.webContents.send(eventName, ...args)
  })
}

const sendDebug = (message) => {
  return send('debug:message', message)
}

const sendInfo = (message, details) => {
  return send('info', message, details)
}

const sendTitle = (title) => {
  return send('title', title)
}

const sendError = (message, err) => {
  return send('error', message, err.stack || err.message || err)
}

module.exports = {
  on: ipcMain.on.bind(ipcMain),
  send,
  sendDebug,
  sendInfo,
  sendTitle,
  sendError,
}
