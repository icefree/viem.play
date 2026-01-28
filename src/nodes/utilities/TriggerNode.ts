import { LGraphNode } from 'litegraph.js'

/**
 * Trigger 节点 - 手动触发出点
 */
export class TriggerNode extends LGraphNode {
  static title = 'trigger'
  static desc = 'Manual trigger'

  color = '#4a5568'
  bgcolor = '#2d3748'

  constructor() {
    super()
    this.title = 'trigger'
    this.addOutput('trigger', -1)
    this.size = [120, 60]

    this.addWidget('button', 'Fire', '', () => {
      this.triggerSlot(0, null)
    })
  }
}
