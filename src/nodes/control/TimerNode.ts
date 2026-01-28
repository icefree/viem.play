import { LGraphNode } from 'litegraph.js'

/**
 * Timer 节点 - 定时触发事件
 * 移植自 eth.build
 */
export class TimerNode extends LGraphNode {
  static title = 'Timer'
  static desc = 'Clock, repeat trigger at interval'

  static on_color = '#AAA'
  static off_color = '#222'

  color = '#4a5568'
  bgcolor = '#2d3748'

  private time = 0
  private last_interval = 3000
  private triggered = false

  constructor() {
    super()
    this.title = 'Timer'
    this.addProperty('interval', 3000)
    this.addProperty('event', 'tick')
    this.addOutput('on_tick', -1)
    this.size = [140, 60]

    this.addWidget('number', 'ms', 3000, (v: number) => {
      this.properties.interval = Math.max(100, v)
    }, { step: 1000, min: 100 })
  }

  onStart() {
    this.time = 0
  }

  getTitle(): string {
    return 'Timer'
  }

  onDrawBackground(ctx: CanvasRenderingContext2D) {
    this.boxcolor = this.triggered ? TimerNode.on_color : TimerNode.off_color
    this.triggered = false

    if (this.flags.collapsed) return

    // 显示当前间隔
    ctx.fillStyle = '#e2e8f0'
    ctx.font = '10px monospace'
    ctx.textAlign = 'right'
    ctx.fillText(`${this.last_interval}ms`, this.size[0] - 10, 50)
  }

  onExecute() {
    const dt = this.graph?.elapsed_time ? this.graph.elapsed_time * 1000 : 16 // in ms, fallback to ~60fps

    const wasZero = this.time === 0

    this.time += dt
    this.last_interval = Math.max(100, (this.getInputOrProperty('interval') as number) || 3000)

    if (!wasZero && (this.time < this.last_interval || isNaN(this.last_interval))) {
      // 还没到触发时间
      if (this.outputs && this.outputs.length > 1 && this.outputs[1]) {
        this.setOutputData(1, false)
      }
      return
    }

    this.triggered = true
    this.time = this.time % this.last_interval
    this.triggerSlot(0, this.properties.event)
    
    // 更新输出标签
    if (this.outputs && this.outputs[0]) {
      this.outputs[0].label = this.last_interval.toString() + 'ms'
    }
    
    if (this.outputs && this.outputs.length > 1 && this.outputs[1]) {
      this.setOutputData(1, true)
    }
  }

  onGetInputs() {
    return [['interval', 'number']]
  }

  onGetOutputs() {
    return [['tick', 'boolean']]
  }
}
