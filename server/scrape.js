const { app, BrowserWindow, ipcMain } = require('electron')
const contextMenu = require('electron-context-menu')
const path = require('path')
const Promise = require('bluebird')

const db = require('./db')

function ready () {
  return new Promise((resolve) => {
    app.on('ready', resolve)
  })
}

module.exports = {
  getBalances () {
    return new Promise((resolve) => {
      ipcMain.on('get:credentials', (event) => {
        db.fetchCredentials().then((credentials) => {
          event.sender.send('credentials', credentials)
        })
      })

      ipcMain.on('balances', (event, balances) => {
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
