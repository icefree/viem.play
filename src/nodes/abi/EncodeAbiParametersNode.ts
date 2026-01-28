import { LGraphNode } from 'litegraph.js'

/**
 * encodeAbiParameters 节点 - 编码 ABI 参数
 */
export class EncodeAbiParametersNode extends LGraphNode {
  static title = 'encodeAbiParameters'
  static desc = 'Encode ABI parameters'

  color = '#e53e3e'
  bgcolor = '#742a2a'

  constructor() {
    super()
    this.title = 'encodeAbiParameters'
    this.addInput('types', 'array')
    this.addInput('values', 'array')
    this.addOutput('encoded', 'bytes')
    this.size = [200, 70]
  }

  async onExecute() {
    // TODO: 实现 ABI 编码逻辑
    this.setOutputData(0, null)
  }
}
