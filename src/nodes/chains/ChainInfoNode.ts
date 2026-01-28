import { LGraphNode } from 'litegraph.js'
import { type Chain } from 'viem'

/**
 * Chain Info 节点 - 显示链的详细信息
 */
export class ChainInfoNode extends LGraphNode {
  static title = 'Chain Info'
  static desc = 'Display chain information'

  color = '#2c5282'
  bgcolor = '#1a365d'

  constructor() {
    super()
    this.title = 'Chain Info'
    this.addInput('chain', 'chain')
    this.addOutput('name', 'string')
    this.addOutput('nativeCurrency', 'object')
    this.addOutput('rpcUrl', 'string')
    this.size = [180, 90]
  }

  onExecute() {
    const chain = this.getInputData(0) as Chain | undefined
    if (chain) {
      this.setOutputData(0, chain.name)
      this.setOutputData(1, chain.nativeCurrency)
      this.setOutputData(2, chain.rpcUrls.default.http[0])
    } else {
      this.setOutputData(0, null)
      this.setOutputData(1, null)
      this.setOutputData(2, null)
    }
  }
}
