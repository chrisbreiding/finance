import React, { Component } from 'react'

class DragHandle extends Component {
  _isDragging = false

  render () {
    return (
      <div
        className='drag-handle'
        style={this.props.style}
        onMouseDown={this._start}
      />
    )
  }

  componentDidMount () {
    document.addEventListener('mousemove', this._drag)
    document.addEventListener('mouseup', this._end)
  }

  _start = (e) => {
    e.preventDefault()

    this._isDragging = true
    this.props.onStart()
  }

  _drag = (e) => {
    const { min, max } = this.props

    if (this._isDragging) {
      e.preventDefault()

      let x = e.clientX
      if (x < min) x = min
      if (x > max) x = max

      this.props.onDrag(x)
    }
  }

  _end = () => {
    if (this._isDragging) {
      this.props.onEnd()
    }
    this._isDragging = false
  }

  componentWillUnmount () {
    document.removeEventListener('mousemove', this._drag)
    document.removeEventListener('mouseup', this._end)
  }
}

export default DragHandle
