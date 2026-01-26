import { LGraphNode, LiteGraph } from 'litegraph.js'

/**
 * Button Node - Provides a clickable UI button to trigger actions
 */
export class ButtonNode extends LGraphNode {
  static title = 'Button'
  static desc = 'Clickable button to trigger actions'

  color = '#3f51b5'
  bgcolor = '#283593'

  private count: number = 0

  constructor() {
    super()
    this.addInput('value', 'string')
    this.addOutput('trigger', -1)
    this.addOutput('value', 'string')
    this.addOutput('count', 'number')
    
    this.properties = {
      label: 'CLICK ME',
      value: 'pulse'
    }

    this.size = [180, 80]

    // Use a LiteGraph button widget
    this.addWidget('button', this.properties.label, '', () => {
      this.clicked()
    })
    
    // Add a text widget to change the label
    this.addWidget('text', 'Label', this.properties.label, (v: string) => {
      this.properties.label = v
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((this as any).widgets && (this as any).widgets[0]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this as any).widgets[0].name = v
      }
    })
  }

  clicked() {
    this.count++
    this.triggerSlot(0, this.properties.value)
    this.setDirtyCanvas(true, true)
  }

  onExecute() {
    // Update label if input is connected
    const inputVal = this.getInputData(0)
    if (inputVal !== undefined && inputVal !== null) {
      this.properties.label = String(inputVal)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((this as any).widgets && (this as any).widgets[0]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this as any).widgets[0].name = String(inputVal)
      }
    }

    this.setOutputData(1, this.properties.value)
    this.setOutputData(2, this.count)
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) return
    
    // Show count in the corner
    ctx.fillStyle = '#9fb3ff'
    ctx.font = '10px Arial'
    ctx.textAlign = 'right'
    ctx.fillText(`${this.count} clicks`, this.size[0] - 10, this.size[1] - 10)
    ctx.textAlign = 'left'
  }
}

/**
 * Timer Node - Triggers an action periodically
 */
export class TimerNode extends LGraphNode {
  static title = 'Timer'
  static desc = 'Triggers on a regular interval'

  color = '#4a5568'
  bgcolor = '#2d3748'

  private time: number = 0
  private lastTime: number = 0
  private triggered: boolean = false
  private blink: number = 0

  constructor() {
    super()
    this.addInput('interval', 'number')
    this.addOutput('tick', -1)
    this.addOutput('is_tick', 'boolean')
    
    this.properties = {
      interval: 1000, // ms
    }

    this.size = [160, 60]
    
    this.addWidget('number', 'Interval (ms)', this.properties.interval, (v: number) => {
      this.properties.interval = v
    })
  }

  onExecute() {
    const now = performance.now()
    if (this.lastTime === 0) {
      this.lastTime = now
      return
    }

    const dt = now - this.lastTime
    this.lastTime = now
    
    this.time += dt
    
    const interval = this.getInputData(0) || this.properties.interval
    
    if (this.time >= interval) {
      this.time = this.time % interval
      this.triggerSlot(0, true)
      this.setOutputData(1, true)
      this.triggered = true
      this.blink = 5 // Blink for 5 frames
    } else {
      this.setOutputData(1, false)
      if (this.blink > 0) {
        this.blink--
      } else {
        this.triggered = false
      }
    }
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) return

    // Show progress bar
    const interval = this.getInputData(0) || this.properties.interval
    const progress = Math.min(1, this.time / interval)
    
    ctx.fillStyle = '#1a202c'
    ctx.fillRect(10, 45, this.size[0] - 20, 4)
    
    ctx.fillStyle = this.triggered ? '#63b3ed' : '#4a5568'
    ctx.fillRect(10, 45, (this.size[0] - 20) * progress, 4)
    
    // Show interval text
    ctx.fillStyle = '#cbd5e0'
    ctx.font = '10px monospace'
    ctx.fillText(`${interval}ms`, 10, 40)
    
    if (this.triggered) {
      ctx.beginPath()
      ctx.arc(this.size[0] - 15, 35, 4, 0, Math.PI * 2)
      ctx.fillStyle = '#63b3ed'
      ctx.fill()
    }
  }
}

export function registerControlNodes() {
  LiteGraph.registerNodeType('Control/Button', ButtonNode)
  LiteGraph.registerNodeType('Control/Timer', TimerNode)
}
