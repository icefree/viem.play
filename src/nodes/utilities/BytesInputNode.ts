import { LGraphNode } from 'litegraph.js'

/**
 * Bytes 输入节点 - 允许用户输入十六进制 bytes 值
 */
export class BytesInputNode extends LGraphNode {
  static title = 'Bytes'
  static desc = 'Input bytes value (hex string)'

  constructor() {
    super()
    this.title = 'Bytes'
    this.addOutput('bytes', 'bytes')
    this.addProperty('value', '')
    this.size = [220, 60]

    this.addWidget('text', 'Bytes', '', (v: string) => {
      this.properties.value = v
    }, {})
  }

  onExecute() {
    const value = this.properties.value as string
    if (value && value.startsWith('0x') && value.length % 2 === 0) {
      this.setOutputData(0, value)
    } else {
      this.setOutputData(0, null)
    }
  }
}
