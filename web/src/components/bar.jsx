import cs from 'classnames'
import { action, extendObservable } from 'mobx'
import { observer } from 'mobx-react'
import React, { Children, Component } from 'react'
import Tooltip from '@cypress/react-tooltip'

import DragHandle from './drag-handle'
import { format$ } from '../lib/util'
import state from '../lib/state'

class _BarPart extends Component {
  constructor (props) {
    super(props)

    extendObservable(this, {
      isHovering: false,
      isDragging: false,
    })
  }

  render () {
    const props = this.props

    const showTooltip = (
      !state.isSorting &&
      (this.isHovering || this.isDragging) &&
      (!state.draggingId || state.draggingId === props.id)
    )

    const label = (
      <label>
        {format$(props.value)} <span>{props.label}</span>
      </label>
    )

    return (
      <div
        className={cs('bar-part', props.type, {
          'is-dragging': this.isDragging,
          'is-zero': props.percent === 0,
        })}
        style={{ width: `${props.percent}%` }}
      >
        <Tooltip title={label} visible={showTooltip} updateCue={props.percent}>
          <div
            className='tooltip-target'
            onMouseOver={() => this.isHovering = true}
            onMouseOut={() => this.isHovering = false}
          >
            {props.draggable &&
              <DragHandle
                min={props.parent.x + (props.prevPercents / 100) * props.parent.width}
                max={props.parent.x + props.parent.width}
                onStart={() => {
                  state.draggingId = props.id
                  this.isDragging = true
                }}
                onDrag={(x) => {
                  props.onUpdatePercent((x - props.parent.x) / props.parent.width * 100 - props.prevPercents)
                }}
                onEnd={() => {
                  state.draggingId = null
                  this.isDragging = false
                  props.onFinishUpdatingPercent()
                }}
              />
            }
          </div>
        </Tooltip>
      </div>
    )
  }
}

export const BarPart = observer(_BarPart)

BarPart.defaultProps = {
  draggable: true,
  prevPercents: 0,
}

class _Bar extends Component {
  constructor (props) {
    super(props)

    extendObservable(this, {
      parent: { width: 1, x: 0 },
    })
  }

  componentDidMount () {
    this._updateParentProps()
    document.addEventListener('resize', this._updateParentProps)
  }

  componentDidUpdate () {
    this._updateParentProps()
  }

  _updateParentProps = action(() => {
    this.parent.width = this.refs.bar.clientWidth
    this.parent.x = this.refs.bar.offsetLeft
  })

  render () {
    return (
      <div className='bar' ref='bar'>
        {Children.map(this.props.children, (child) => (
          React.cloneElement(child, { parent: this.parent })
        ))}
      </div>
    )
  }

  componentWillUnmount () {
    document.removeEventListener('resize', this._updateParentProps)
  }
}

export const Bar = observer(_Bar)
