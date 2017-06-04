import { observable } from 'mobx'
import { observer } from 'mobx-react'
import React, { Children, Component } from 'react'

import DragHandle from './drag-handle'
import { format$ } from '../lib/util'
import state from '../lib/state'

export const BarPart = observer((props) => (
  <div
    className={`bar-part ${props.type || ''} ${props.isEven ? 'even' : 'odd'}`}
    style={{ width: `${props.percent}%` }}
  >
    <label><span>{format$(props.value)}</span> {props.label}</label>
    {props.draggable &&
      <DragHandle
        min={props.parent.x + (props.prevPercents / 100) * props.parent.width}
        max={props.parent.x + props.parent.width}
        onStart={() => { state.isGrabbing = true }}
        onDrag={(x) => {
          props.onUpdatePercent((x - props.parent.x) / props.parent.width * 100 - props.prevPercents)
        }}
        onEnd={() => {
          state.isGrabbing = false
          props.onFinishUpdatingPercent()
        }}
      />
    }
  </div>
))

BarPart.defaultProps = {
  draggable: true,
  prevPercents: 0,
}

@observer
export class Bar extends Component {
  @observable parentWidth = 1
  @observable parentX = 0

  componentDidMount () {
    this._updateParentProps()
    document.addEventListener('resize', this._updateParentProps)
  }

  componentDidUpdate () {
    this._updateParentProps()
  }

  _updateParentProps = () => {
    this.parentWidth = this.refs.main.clientWidth
    this.parentX = this.refs.main.offsetLeft
  }

  render () {
    return (
      <div className='bar'>
        <main ref='main'>
          {Children.map(this.props.children, (child, index) => (
            React.cloneElement(child, {
              isEven: index % 2 === 0,
              parent: {
                width: this.parentWidth,
                x: this.parentX,
              },
            })
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
