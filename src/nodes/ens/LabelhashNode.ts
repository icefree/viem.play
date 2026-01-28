import { LGraphNode } from 'litegraph.js'
import { labelhash, type Hex } from 'viem'

/**
 * labelhash 节点 - 哈希 ENS 标签
 */
export class LabelhashNode extends LGraphNode {
  static title = 'labelhash'
  static desc = 'Hash an ENS label'

  color = '#319795'
  bgcolor = '#234e52'

  constructor() {
    super()
    this.title = 'labelhash'
    this.addInput('label', 'string')
    this.addOutput('hash', 'bytes32')
    this.size = [160, 50]
  }

  onExecute() {
    const label = this.getInputData(0) as string | undefined
    
    if (label) {
      try {
        this.setOutputData(0, labelhash(label) as Hex)
      } catch {
        this.setOutputData(0, null)
      }
    } else {
      this.setOutputData(0, null)
    }
  }
}
