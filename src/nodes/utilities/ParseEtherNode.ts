import { LGraphNode } from 'litegraph.js'
import { parseEther as viemParseEther } from 'viem'

/**
 * Parse Ether 节点
 */
export class ParseEtherNode extends LGraphNode {
  static title = 'parseEther'
  static desc = 'Parse ether string to wei'

  color = '#38a169'
  bgcolor = '#276749'

  constructor() {
    super()
    this.title = 'parseEther'
    this.addInput('ether', 'string')
    this.addOutput('wei', 'bigint')
    this.size = [160, 50]
  }

  onExecute() {
    const ether = this.getInputData(0) as string | undefined
    if (ether && typeof ether === 'string') {
      try {
        this.setOutputData(0, viemParseEther(ether))
      } catch {
        this.setOutputData(0, null)
      }
    } else {
      this.setOutputData(0, null)
    }
  }
}
