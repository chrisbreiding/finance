/* global window, document */

const ipcRenderer = window.ipcRenderer

const getEl = (id) => document.getElementById(id)

const el = (type, text, className) => {
  const node = document.createElement(type)
  node.innerText = text
  if (className) {
    node.className = className
  }
  return node
}

const formatValue = (value) => {
  if (!(typeof value === 'number')) return value

  const [dollars, cents = '00'] = `${value}`.split('.')
  const dollarsFormatted = dollars.replace(/\d{1,3}(?=(\d{3})+(?!\d))/, '$&,')

  return `$${dollarsFormatted}.${cents}`
}

const docHeight = () => {
  const body = document.body
  const html = document.documentElement

  return Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  )
}

let showingSettings = false
const settingsNode = getEl('settings')
const dataFileNode = getEl('data-file')

getEl('toggle-settings').addEventListener('click', () => {
  showingSettings = !showingSettings
  settingsNode.style.display = showingSettings ? 'flex' : 'none'
})

getEl('select-data-file').addEventListener('click', () => {
  ipcRenderer.send('select:data:file')
})

const messagesNode = getEl('messages')

const add = (node) => {
  messagesNode.appendChild(node)
  window.scrollTo(0, docHeight())
}

ipcRenderer.on('title', (__, title) => {
  add(el('h2', title))
})

ipcRenderer.on('debug:message', (__, message) => {
  console.log(message) // eslint-disable-line no-console
})

ipcRenderer.on('info', (__, message, details) => {
  add(el('div', message))
  if (details) {
    for (let detail in details) {
      add(el('div', `${detail}: ${formatValue(details[detail])}`, 'detail'))
    }
  }
})

ipcRenderer.on('error', (__, message, err) => {
  add(el('div', message, 'error'))
  add(el('pre', err))
})

ipcRenderer.on('data:file', (__, file) => {
  dataFileNode.value = file
})

ipcRenderer.send('get:data:file')
