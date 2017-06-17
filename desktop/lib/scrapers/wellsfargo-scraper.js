'use strict'

const { BrowserWindow, ipcMain } = require('electron')
const contextMenu = require('electron-context-menu')
const path = require('path')
const Promise = require('bluebird')

const db = require('../db')

module.exports = () => {
  return new Promise((resolve) => {
    ipcMain.on('get:wellsfargo:credentials', (event) => {
      db.fetchCredentials('wellsfargo').then((credentials) => {
        event.sender.send('wellsfargo:credentials', credentials)
      })
    })

    ipcMain.once('wellsfargo:balances', (event, balances) => {
      ipcMain.removeAllListeners('get:wellsfargo:credentials')
      win.close()
      resolve(balances)
    })

    const win = new BrowserWindow({
      show: false,
      webPreferences: {
        preload: path.join(__dirname, 'wellsfargo-driver.js'),
        nodeIntegration: false,
      },
    })

    contextMenu({ window: win })

    win.loadURL('https://www.wellsfargo.com')
  })
}
