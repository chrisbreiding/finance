'use strict'

const { app, BrowserWindow, ipcMain } = require('electron')
const contextMenu = require('electron-context-menu')
const path = require('path')
const Promise = require('bluebird')

const db = require('./db')

// prevent default behavior of quitting when windows are all closed
app.on('window-all-closed', () => {})

module.exports = {
  getBalances () {
    return new Promise((resolve) => {
      ipcMain.on('get:credentials', (event) => {
        db.fetchCredentials().then((credentials) => {
          event.sender.send('credentials', credentials)
        })
      })

      ipcMain.once('balances', (event, balances) => {
        ipcMain.removeAllListeners('get:credentials')
        win.close()
        resolve(balances)
      })

      const win = new BrowserWindow({
        show: false,
        webPreferences: {
          preload: path.join(__dirname, 'driver.js'),
          nodeIntegration: false,
        },
      })

      contextMenu({ window: win })

      win.loadURL('https://www.wellsfargo.com')
    })
  },
}
