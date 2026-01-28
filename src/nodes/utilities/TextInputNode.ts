import { LGraphNode } from 'litegraph.js'

/**
 * 文本输入节点 - 允许用户输入字符串值
 */
export class TextInputNode extends LGraphNode {
  static title = 'Text'
  static desc = 'Input text value'

  constructor() {
    super()
    this.title = 'Text'
    this.addOutput('text', 'string')
    this.addProperty('value', '')
    this.size = [180, 60]

    this.addWidget('text', 'Value', '', (v: string) => {
      this.properties.value = v
    }, {})
  }

  onExecute() {
    this.setOutputData(0, this.properties.value)
  }
}
