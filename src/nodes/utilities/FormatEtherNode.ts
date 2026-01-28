import { LGraphNode } from 'litegraph.js'
import { formatEther as viemFormatEther } from 'viem'

/**
 * Format Ether 节点
 */
export class FormatEtherNode extends LGraphNode {
  static title = 'formatEther'
  static desc = 'Format wei to ether string'

  color = '#38a169'
  bgcolor = '#276749'

  constructor() {
    super()
    this.title = 'formatEther'
    this.addInput('wei', 'bigint')
    this.addOutput('ether', 'string')
    this.size = [160, 50]
  }

  onExecute() {
    const wei = this.getInputData(0) as bigint | undefined
    if (wei !== undefined && wei !== null) {
      this.setOutputData(0, viemFormatEther(wei))
    } else {
      this.setOutputData(0, null)
    }
  }
}
