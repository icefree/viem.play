import { LGraphNode } from 'litegraph.js'

/**
 * 定时器节点 - 定时发出动作
 */
export class TimerNode extends LGraphNode {
  static title = 'Timer'
  static desc = 'Periodic action trigger'

  private timerId: number | null = null

  constructor() {
    super()
    this.title = 'Timer'
    this.addOutput('tick', -1)
    this.size = [140, 70]

    this.addInput('interval', 'number')
    this.addProperty('interval', 3000, 'number')
    this.addProperty('event', 'tick', 'string')

    this.startTimer()
  }

  onExecute() {
    const interval = this.getInputData(0)
    if (interval !== undefined && interval !== null && typeof interval === 'number') {
      // 限制最小间隔为 50ms 防止卡死
      const safeInterval = Math.max(50, interval)
      if (safeInterval !== this.properties.interval) {
        this.properties.interval = safeInterval
        this.startTimer()
      }
    }
  }

  startTimer() {
    if (this.timerId) {
      clearInterval(this.timerId)
    }
    this.timerId = window.setInterval(() => {
      this.triggerSlot(0, null)
    }, this.properties.interval)
  }

  onPropertyChanged(name: string) {
    if (name === 'interval') {
      this.startTimer()
    }
  }

  onRemoved() {
    if (this.timerId) {
      clearInterval(this.timerId)
    }
  }
}
