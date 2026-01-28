import { LGraphNode } from 'litegraph.js'
import { concat as viemConcat, type Hex } from 'viem'

/**
 * concat 节点 - 连接 hex/byte 数据
 */
export class ConcatNode extends LGraphNode {
  static title = 'concat'
  static desc = 'Concatenate hex/byte data'

  color = '#4a5568'
  bgcolor = '#2d3748'

  constructor() {
    super()
    this.title = 'concat'
    this.addInput('values', 'array')
    this.addOutput('result', 'bytes')
    this.size = [160, 50]
  }

  onExecute() {
    const values = this.getInputData(0) as Hex[] | undefined
    
    if (values && Array.isArray(values)) {
      try {
        this.setOutputData(0, viemConcat(values))
      } catch {
        this.setOutputData(0, null)
      }
    } else {
      this.setOutputData(0, null)
    }
  }
}
