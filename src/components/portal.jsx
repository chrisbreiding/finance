import { Component } from 'react'
import { render, unmountComponentAtNode } from 'react-dom'

let idNum = 0

class Portal extends Component {
  constructor (...args) {
    super(...args)

    this.id = `portal-${idNum++}`
    this.hasEntered = false
  }

  componentWillUnmount () {
    this._removeContainer()
  }

  componentDidUpdate ({ isShowing: wasShowing }) {
    if (this.props.isShowing) {
      this._render()
    } else if (wasShowing && !this.props.isShowing) {
      this._removeContainer()
    }

    if (!wasShowing && this.props.isShowing) {
      this._enter()
    }
  }

  _render () {
    this._findOrCreateContainer()
    render(this.props.children, this.element)
  }

  _findOrCreateContainer () {
    let element = document.getElementById(this.id)
    if (!element) {
      element = document.createElement('div')
      element.id = this.id
      document.body.appendChild(element)
    }
    this.element = element
  }

  _enter () {
    setTimeout(this._withElement(() => {
      this.element.className = 'has-entered'
    }, 50))
  }

  _removeContainer () {
    if (!this.element) return

    this.element.className = ''
    setTimeout(this._withElement(() => {
      unmountComponentAtNode(this.element)
      document.body.removeChild(this.element)
      this.element = null
    }, 350))
  }

  _withElement (fn) {
    if (this.element) fn()
  }

  render () {
    return null
  }
}

export default Portal
