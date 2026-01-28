import { LGraphNode } from 'litegraph.js'
import { toRlp, type Hex } from 'viem'

/**
 * toRlp 节点 - 编码为 RLP
 */
export class ToRlpNode extends LGraphNode {
  static title = 'toRlp'
  static desc = 'Encode to RLP'

  color = '#4a5568'
  bgcolor = '#2d3748'

  constructor() {
    super()
    this.title = 'toRlp'
    this.addInput('value', 'bytes,array')
    this.addOutput('rlp', 'bytes')
    this.size = [160, 50]
  }

  onExecute() {
    const value = this.getInputData(0) as Hex | readonly Hex[] | undefined
    
    if (value) {
      try {
        this.setOutputData(0, toRlp(value))
      } catch {
        this.setOutputData(0, null)
      }
    } else {
      this.setOutputData(0, null)
    }
  }
}
