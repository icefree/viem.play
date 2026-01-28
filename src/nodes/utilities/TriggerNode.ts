import { LGraphNode } from 'litegraph.js'

/**
 * 触发节点 - 手动触发动作输出
 */
export class TriggerNode extends LGraphNode {
  static title = 'Trigger'
  static desc = 'Manual action trigger'

  color = '#4a5568'
  bgcolor = '#2d3748'

  constructor() {
    super()
    this.title = 'Trigger'
    this.addOutput('trigger', -1)
    this.size = [140, 50]

    this.addWidget('button', 'Fire', '', () => {
      this.triggerSlot(0)
    }, {})
  }
}
