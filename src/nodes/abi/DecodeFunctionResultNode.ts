import { LGraphNode } from 'litegraph.js'

/**
 * decodeFunctionResult 节点 - 解码函数返回结果
 */
export class DecodeFunctionResultNode extends LGraphNode {
  static title = 'decodeFunctionResult'
  static desc = 'Decode function result'

  color = '#e53e3e'
  bgcolor = '#742a2a'

  constructor() {
    super()
    this.title = 'decodeFunctionResult'
    this.addInput('abi', 'abi')
    this.addInput('functionName', 'string')
    this.addInput('data', 'bytes')
    this.addOutput('result', 0)
    this.size = [200, 90]
  }

  async onExecute() {
    this.setOutputData(0, null)
  }
}
