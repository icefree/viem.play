import { LGraphNode } from 'litegraph.js'

/**
 * Bytes32 输入节点
 */
export class Bytes32InputNode extends LGraphNode {
  static title = 'Bytes32'
  static desc = 'Input bytes32 value (32-byte hex string)'
  
  color = '#3d5a80'
  bgcolor = '#293241'

  constructor() {
    super()
    this.title = 'Bytes32'
    this.addOutput('bytes32', 'bytes32')
    this.addProperty('value', '')
    this.size = [260, 60]

    this.addWidget('text', 'Bytes32', '', (v: string) => {
      this.properties.value = v
    }, {})
  }

  onExecute() {
    const val = this.properties.value as string
    if (val && val.startsWith('0x') && val.length === 66) {
      this.setOutputData(0, val)
    } else {
      this.setOutputData(0, null)
    }
  }
}
