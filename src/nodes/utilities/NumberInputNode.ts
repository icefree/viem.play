import { LGraphNode } from 'litegraph.js'

/**
 * 数字输入节点 - 允许用户输入数字值
 */
export class NumberInputNode extends LGraphNode {
  static title = 'Number'
  static desc = 'Input number value'

  constructor() {
    super()
    this.title = 'Number'
    this.addOutput('number', 'number')
    this.addProperty('value', 0)
    this.size = [180, 60]

    this.addWidget('number', 'Value', 0, (v: number) => {
      this.properties.value = v
    }, {})
  }

  onExecute() {
    this.setOutputData(0, this.properties.value)
  }
}
