import { LGraphNode } from 'litegraph.js'

/**
 * Bytes 输入节点
 */
export class BytesInputNode extends LGraphNode {
  static title = 'Bytes'
  static desc = 'Input bytes hex string'

  constructor() {
    super()
    this.title = 'Bytes'
    this.addOutput('bytes', 'bytes')
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
