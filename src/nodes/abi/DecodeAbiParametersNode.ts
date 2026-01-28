import { LGraphNode } from 'litegraph.js'

/**
 * decodeAbiParameters 节点 - 解码 ABI 参数
 */
export class DecodeAbiParametersNode extends LGraphNode {
  static title = 'decodeAbiParameters'
  static desc = 'Decode ABI parameters'

  color = '#e53e3e'
  bgcolor = '#742a2a'

  constructor() {
    super()
    this.title = 'decodeAbiParameters'
    this.addInput('types', 'array')
    this.addInput('data', 'bytes')
    this.addOutput('decoded', 'array')
    this.size = [200, 70]
  }

  async onExecute() {
    this.setOutputData(0, null)
  }
}
