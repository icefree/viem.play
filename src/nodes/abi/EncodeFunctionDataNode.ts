import { LGraphNode } from 'litegraph.js'

/**
 * encodeFunctionData 节点 - 编码函数调用数据
 */
export class EncodeFunctionDataNode extends LGraphNode {
  static title = 'encodeFunctionData'
  static desc = 'Encode function call data'

  color = '#e53e3e'
  bgcolor = '#742a2a'

  constructor() {
    super()
    this.title = 'encodeFunctionData'
    this.addInput('abi', 'abi')
    this.addInput('functionName', 'string')
    this.addInput('args', 'array')
    this.addOutput('data', 'bytes')
    this.size = [200, 90]
  }

  async onExecute() {
    this.setOutputData(0, null)
  }
}
