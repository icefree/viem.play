import { LGraphNode } from 'litegraph.js'
import { isHex } from 'viem'

/**
 * isHex 节点 - 检查是否是 hex 值
 */
export class IsHexNode extends LGraphNode {
  static title = 'isHex'
  static desc = 'Check if value is hex'

  color = '#4a5568'
  bgcolor = '#2d3748'

  constructor() {
    super()
    this.title = 'isHex'
    this.addInput('value', 'string')
    this.addOutput('result', 'boolean')
    this.size = [160, 50]
  }

  onExecute() {
    const value = this.getInputData(0)
    this.setOutputData(0, isHex(value))
  }
}
