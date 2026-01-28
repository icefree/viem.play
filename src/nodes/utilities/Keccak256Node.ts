import { LGraphNode } from 'litegraph.js'
import { keccak256 as viemKeccak256, type Hex } from 'viem'

/**
 * Keccak256 哈希节点
 */
export class Keccak256Node extends LGraphNode {
  static title = 'keccak256'
  static desc = 'Keccak-256 hash'

  constructor() {
    super()
    this.title = 'keccak256'
    this.addInput('data', 'string,bytes')
    this.addOutput('hash', 'bytes32')
    this.size = [160, 50]
  }

  onExecute() {
    const data = this.getInputData(0) as Hex | undefined
    if (data && data.startsWith('0x')) {
      try {
        this.setOutputData(0, viemKeccak256(data))
      } catch {
        this.setOutputData(0, null)
      }
    } else {
      this.setOutputData(0, null)
    }
  }
}
