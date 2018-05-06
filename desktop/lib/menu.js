const Menu = require('electron').Menu
const os = require('os')
const util = require('./util')

module.exports = {
  set () {
    const template = [{
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo',
        }, {
          label: 'Redo',
          accelerator: 'Shift+CmdOrCtrl+Z',
          role: 'redo',
        }, {
          type: 'separator',
        }, {
          label: 'Cut',
          accelerator: 'CmdOrCtrl+X',
          role: 'cut',
        }, {
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          role: 'copy',
        }, {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          role: 'paste',
        }, {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          role: 'selectall',
        },
      ],
    }, {
      label: 'Window',
      role: 'window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize',
        },
      ],
    }, {
      label: 'Developer Tools',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click (item, focusedWindow) {
            focusedWindow && focusedWindow.reload()
          },
        }, {
          label: 'Toggle Developer Tools',
          accelerator: os.platform() === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
          click (item, focusedWindow) {
            focusedWindow && focusedWindow.toggleDevTools()
          },
        },
      ],
    }]

    if (os.platform() === 'darwin') {
      template.unshift({
        label: util.appName,
        submenu: [
          {
            role: 'about',
          }, {
            type: 'separator',
          }, {
            role: 'services',
            submenu: [],
          }, {
            type: 'separator',
          }, {
            role: 'hide',
          }, {
            role: 'hideothers',
          }, {
            role: 'unhide',
          }, {
            type: 'separator',
          }, {
            role: 'quit',
          },
        ],
      })
    }

    const menu = Menu.buildFromTemplate(template)

    Menu.setApplicationMenu(menu)
  },
}
