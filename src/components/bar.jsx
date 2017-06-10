import cs from 'classnames'
import { action, observable } from 'mobx'
import { observer } from 'mobx-react'
import React, { Children, Component } from 'react'
import Tooltip from '@cypress/react-tooltip'

import DragHandle from './drag-handle'
import { format$ } from '../lib/util'
import state from '../lib/state'

@observer
export class BarPart extends Component {
  @observable isHovering = false
  @observable isDragging = false

  render () {
    const props = this.props

    const showTooltip = (
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
        className={cs('bar-part', props.type, { 'is-dragging': this.isDragging })}
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

BarPart.defaultProps = {
  draggable: true,
  prevPercents: 0,
}

@observer
export class Bar extends Component {
  @observable parent = { width: 1, x: 0 }

  componentDidMount () {
    this._updateParentProps()
    document.addEventListener('resize', this._updateParentProps)
  }

  componentDidUpdate () {
    this._updateParentProps()
  }

  @action _updateParentProps = () => {
    this.parent.width = this.refs.main.clientWidth
    this.parent.x = this.refs.main.offsetLeft
  }

  render () {
    return (
      <div className='bar'>
        <main ref='main'>
          {Children.map(this.props.children, (child) => (
            React.cloneElement(child, { parent: this.parent })
          ))}
        </main>
        <div className='total'>{format$(this.props.total)}</div>
      </div>
    )
  }

  componentWillUnmount () {
    document.removeEventListener('resize', this._updateParentProps)
  }
}
