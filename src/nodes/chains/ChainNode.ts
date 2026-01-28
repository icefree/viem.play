import { LGraphNode } from 'litegraph.js'
import { ALL_CHAINS, CHAIN_NAMES } from './constants'

/**
 * Chain 节点 - 选择区块链网络
 */
export class ChainNode extends LGraphNode {
  static title = 'Chain'
  static desc = 'Select blockchain network'

  color = '#2c5282'
  bgcolor = '#1a365d'

  constructor() {
    super()
    this.title = 'Chain'
    this.addOutput('chain', 'chain')
    this.addProperty('chainName', 'mainnet', 'string')
    this.size = [180, 60]

    // Dropdown widget for chain selection
    this.addWidget('combo', 'Network', 'mainnet', (v: string) => {
      this.properties.chainName = v
    }, { values: CHAIN_NAMES })
  }

  onExecute() {
    const chainName = this.properties.chainName as string
    const chain = ALL_CHAINS[chainName]
    if (chain) {
      this.setOutputData(0, chain)
    }
  }

  getTitle(): string {
    return `Chain: ${this.properties.chainName}`
  }
}
