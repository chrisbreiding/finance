import Promise from 'bluebird'

const ipcRenderer = window.ipcRenderer

const ipc = (eventName, data) => {
  return new Promise((resolve, reject) => {
    ipcRenderer.once(`${eventName}:response`, (sender, error, response) => {
      error ? reject(error) : resolve(response)
    })
    ipcRenderer.send(`${eventName}:request`, data)
  })
}

ipc.on = (eventName, callback) => {
  ipcRenderer.on(eventName, (__, ...args) => {
    callback(...args)
  })
}

ipc.send = (eventName, ...args) => {
  ipcRenderer.send(eventName, ...args)
}

export default ipc
