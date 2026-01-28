import { LGraphNode } from 'litegraph.js'
import { fromHex, type Hex } from 'viem'

/**
 * fromHex 节点 - 从 hex 解析
 */
export class FromHexNode extends LGraphNode {
  static title = 'fromHex'
  static desc = 'Parse from hex'

  color = '#4a5568'
  bgcolor = '#2d3748'

  constructor() {
    super()
    this.title = 'fromHex'
    this.addInput('hex', 'bytes')
    this.addOutput('value', '')
    this.size = [160, 50]
    this.addProperty('to', 'string', 'enum', { values: ['string', 'number', 'bigint', 'bytes', 'boolean'] })
  }

  onExecute() {
    const hex = this.getInputData(0) as Hex | undefined
    
    if (hex) {
      try {
        const to = this.properties.to as 'string' | 'number' | 'bigint' | 'bytes' | 'boolean'
        this.setOutputData(0, fromHex(hex, to))
      } catch {
        this.setOutputData(0, null)
      }
    } else {
      this.setOutputData(0, null)
    }
  }
}
