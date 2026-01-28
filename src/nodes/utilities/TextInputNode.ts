import { LGraphNode } from 'litegraph.js'

/**
 * Text 输入节点
 */
export class TextInputNode extends LGraphNode {
  static title = 'Text'
  static desc = 'Input a string'

  constructor() {
    super()
    this.title = 'Text'
    this.addOutput('string', 'string')
    this.addProperty('value', '', 'string')
    this.size = [260, 60]

    this.addWidget('text', 'Value', '', (v: string) => {
      this.properties.value = v
    })
  }

  onExecute() {
    this.setOutputData(0, this.properties.value)
  }
}
