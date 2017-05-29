'use strict'

const _ = require('lodash')
const { BrowserWindow } = require('electron')
const contextMenu = require("electron-context-menu")
const path = require('path')
const Promise = require('bluebird')
const url = require('url')

const menu = require('./menu')
const util = require('./util')

let win

const ensure = () => {
  if (win) return Promise.resolve(win)

  const windowSettings = util.getWindowSettings()

  win = new BrowserWindow({
    width: windowSettings.width,
    height: windowSettings.height,
    x: windowSettings.x,
    y: windowSettings.y,
    webPreferences: {
      preload: path.join(__dirname, 'ipc-client.js'),
      nodeIntegration: false,
    },
  })

  contextMenu({
    showInspectElement: util.isDev,
    window: win,
  })

  menu.set()

  const distDir = util.isDev ? 'app-dist' : 'app-dist-prod'
  win.loadURL(url.format({
    pathname: path.join(__dirname, '..', distDir, 'index.html'),
    protocol: 'file:',
    slashes: true,
  }))

  win.on('closed', () => {
    win = null
  })

  return new Promise((resolve) => {
    win.on('resize', _.debounce(() => {
      const [width, height] = win.getSize()
      const [x, y] = win.getPosition()
      util.updateWindowSettings({ width, height, x, y })
    }, 1000))

    win.on('moved', _.debounce(() => {
      const [x, y] = win.getPosition()
      util.updateWindowSettings({ x, y })
    }, 1000))

    win.webContents.on('did-finish-load', () => {
      if (util.isDev && windowSettings.isDevToolsOpen !== false) {
        win.webContents.openDevTools()
      }
      resolve(win)
    })

    win.webContents.on('devtools-opened', () => {
      util.updateWindowSettings({ isDevToolsOpen: true })
    })

    win.webContents.on('devtools-closed', () => {
      util.updateWindowSettings({ isDevToolsOpen: false })
    })
  })
}

module.exports = {
  ensure,
}
