import { LGraphNode } from 'litegraph.js'
import { formatEther as viemFormatEther } from 'viem'

/**
 * Format Ether 节点
 */
export class FormatEtherNode extends LGraphNode {
  static title = 'formatEther'
  static desc = 'Format wei to ether'

  color = '#38a169'
  bgcolor = '#276749'

  constructor() {
    super()
    this.title = 'formatEther'
    this.addInput('wei', 'bigint')
    this.addOutput('ether', 'string')
    this.addOutput('formatted', 'string')
    this.size = [160, 60]
    this.addProperty('term', 'Wei', 'string')
  }

  onExecute() {
    const wei = this.getInputData(0) as bigint | undefined
    if (typeof wei === 'bigint') {
      try {
        const ether = viemFormatEther(wei)
        this.setOutputData(0, ether)
        this.setOutputData(1, `${ether} Eth`)
      } catch {
        this.setOutputData(0, null)
        this.setOutputData(1, null)
      }
    } else {
      this.setOutputData(0, null)
      this.setOutputData(1, null)
    }
  }
}
