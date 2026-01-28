import { LGraphNode } from 'litegraph.js'
import { fromRlp, type Hex } from 'viem'

/**
 * fromRlp 节点 - 从 RLP 解码
 */
export class FromRlpNode extends LGraphNode {
  static title = 'fromRlp'
  static desc = 'Decode from RLP'

  color = '#4a5568'
  bgcolor = '#2d3748'

  constructor() {
    super()
    this.title = 'fromRlp'
    this.addInput('rlp', 'bytes')
    this.addOutput('value', '')
    this.size = [160, 50]
  }

  onExecute() {
    const rlp = this.getInputData(0) as Hex | undefined
    
    if (rlp) {
      try {
        this.setOutputData(0, fromRlp(rlp))
      } catch {
        this.setOutputData(0, null)
      }
    } else {
      this.setOutputData(0, null)
    }
  }
}
