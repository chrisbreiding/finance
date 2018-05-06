const { app, dialog } = require('electron')
const ipc = require('./lib/ipc')
const server = require('./lib/server')
const window = require('./lib/window')
const util = require('./lib/util')

const start = () => {
  window.ensure().then(() => {
    server.start()
  })
}

app.on('ready', start)

app.on('activate', window.ensure)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipc.on('get:data:file', (event) => {
  const dataFile = util.getSetting('dataFile')
  if (dataFile) {
    event.sender.send('data:file', util.tildeify(dataFile))
  }
})

ipc.on('select:data:file', (event) => {
  dialog.showOpenDialog({
    title: `Select Data File`,
    buttonLabel: 'Select',
  }, (paths) => {
    if (!paths || !paths.length) return

    const path = paths[0]
    util.setSetting('dataFile', path)
    event.sender.send('data:file', util.tildeify(path))
  })
})

ipc.on('set:debug', (event, onOrOff) => {
  util.setSetting('debug', onOrOff)
})
