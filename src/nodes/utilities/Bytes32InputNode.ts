import { LGraphNode } from 'litegraph.js'

/**
 * Bytes32 输入节点
 */
export class Bytes32InputNode extends LGraphNode {
  static title = 'Bytes32'
  static desc = 'Input 32 bytes hex string'

  constructor() {
    super()
    this.title = 'Bytes32'
    this.addOutput('bytes32', 'bytes32')
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
