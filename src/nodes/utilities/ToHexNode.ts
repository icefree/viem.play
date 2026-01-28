import { LGraphNode } from 'litegraph.js'
import { toHex } from 'viem'

/**
 * toHex 节点 - 转换为 hex
 */
export class ToHexNode extends LGraphNode {
  static title = 'toHex'
  static desc = 'Convert to hex'

  color = '#4a5568'
  bgcolor = '#2d3748'

  constructor() {
    super()
    this.title = 'toHex'
    this.addInput('value', 'string,number,bigint,bytes')
    this.addOutput('hex', 'bytes')
    this.size = [160, 50]
  }

  onExecute() {
    const value = this.getInputData(0) as string | number | bigint | boolean | Uint8Array | undefined
    
    if (value !== undefined && value !== null) {
      try {
        this.setOutputData(0, toHex(value))
      } catch {
        this.setOutputData(0, null)
      }
    } else {
      this.setOutputData(0, null)
    }
  }
}
