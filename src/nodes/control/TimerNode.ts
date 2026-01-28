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

    this.addProperty('interval', 3000, 'number')
    this.addProperty('event', 'tick', 'string')

    this.addWidget(
      'number',
      'Interval (ms)',
      this.properties.interval,
      (v: number) => {
        this.properties.interval = v
        this.startTimer()
      },
      { min: 50, max: 60000, step: 100, precision: 0 }
    )

    this.startTimer()
  }

  startTimer() {
    if (this.timerId) {
      clearInterval(this.timerId)
    }
    this.timerId = setInterval(() => {
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
