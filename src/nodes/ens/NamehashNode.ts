import { LGraphNode } from 'litegraph.js'
import { namehash, type Hex } from 'viem'

/**
 * namehash 节点 - 哈希 ENS 名称
 */
export class NamehashNode extends LGraphNode {
  static title = 'namehash'
  static desc = 'Hash an ENS name'

  color = '#319795'
  bgcolor = '#234e52'

  constructor() {
    super()
    this.title = 'namehash'
    this.addInput('name', 'string')
    this.addOutput('hash', 'bytes32')
    this.size = [160, 50]
  }

  onExecute() {
    const name = this.getInputData(0) as string | undefined
    
    if (name) {
      try {
        this.setOutputData(0, namehash(name) as Hex)
      } catch {
        this.setOutputData(0, null)
      }
    } else {
      this.setOutputData(0, null)
    }
  }
}
