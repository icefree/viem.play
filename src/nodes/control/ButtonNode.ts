import { LGraphNode } from 'litegraph.js'

/**
 * 按钮节点 - 手动输出动作
 */
export class ButtonNode extends LGraphNode {
  static title = 'Button'
  static desc = 'Action button trigger'

  constructor() {
    super()
    this.title = 'Button'
    this.addInput('timer', 'timer')
    this.addOutput('trigger', -1)
    this.size = [120, 60]

    this.addProperty('label', 'CLICK ME', 'string')
    this.addProperty('count', 0, 'number')

    this.addWidget('button', 'CLICK ME', '', () => {
      this.fire()
    })
  }

  fire() {
    this.properties.count++
    this.triggerSlot(0, 'trigger')
  }

  onAction() {
    this.fire()
  }

  onExecute() {
    // 渲染时更新 label
    const widgets = (this as unknown as { widgets?: Array<{ name: string }> }).widgets
    if (widgets && widgets[0]) {
      widgets[0].name = this.properties.label as string
    }
  }
}
