import { LGraphNode } from 'litegraph.js'
import { hashMessage, type Hex } from 'viem'

/**
 * hashMessage 节点 - 哈希消息
 */
export class HashMessageNode extends LGraphNode {
  static title = 'hashMessage'
  static desc = 'Hash a message'

  color = '#4a5568'
  bgcolor = '#2d3748'

  constructor() {
    super()
    this.title = 'hashMessage'
    this.addInput('message', 'string,bytes')
    this.addOutput('hash', 'bytes32')
    this.size = [160, 50]
  }

  onExecute() {
    const message = this.getInputData(0) as string | Hex | undefined
    
    if (message) {
      try {
        this.setOutputData(0, hashMessage(message))
      } catch {
        this.setOutputData(0, null)
      }
    } else {
      this.setOutputData(0, null)
    }
  }
}
