import { LGraphNode } from 'litegraph.js'

/**
 * Number 输入节点
 */
export class NumberInputNode extends LGraphNode {
  static title = 'Number'
  static desc = 'Input a number'

  constructor() {
    super()
    this.title = 'Number'
    this.addOutput('number', 'number')
    this.addProperty('value', 0, 'number')
    this.size = [160, 60]

    this.addWidget('number', 'Value', 0, (v: number) => {
      this.properties.value = v
    })
  }

  onExecute() {
    this.setOutputData(0, Number(this.properties.value))
  }
}
