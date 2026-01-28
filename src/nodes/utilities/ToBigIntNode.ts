import { LGraphNode } from 'litegraph.js'

/**
 * BigInt 转换节点
 */
export class ToBigIntNode extends LGraphNode {
  static title = 'toBigInt'
  static desc = 'Convert string/number to BigInt'

  constructor() {
    super()
    this.title = 'toBigInt'
    this.addInput('value', '')
    this.addOutput('bigint', 'bigint')
    this.size = [140, 50]
  }

  onExecute() {
    const value = this.getInputData(0)
    try {
      if (value !== undefined && value !== null) {
        this.setOutputData(0, BigInt(value))
      } else {
        this.setOutputData(0, null)
      }
    } catch {
      this.setOutputData(0, null)
    }
  }
}
