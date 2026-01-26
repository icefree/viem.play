import { LGraphNode, LiteGraph } from 'litegraph.js'
import {
  mainnet,
  sepolia,
  polygon,
  arbitrum,
  optimism,
  base,
  type Chain,
} from 'viem/chains'

// Define a local anvil chain
const anvil: Chain = {
  id: 31337,
  name: 'Anvil',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
  },
}

// Available chains map
const CHAINS: Record<string, Chain> = {
  mainnet,
  sepolia,
  polygon,
  arbitrum,
  optimism,
  base,
  anvil,
}

const CHAIN_NAMES = Object.keys(CHAINS)

/**
 * Chain 节点 - 选择区块链网络
 */
class ChainNode extends LGraphNode {
  static title = 'Chain'
  static desc = 'Select blockchain network'

  color = '#2c5282'
  bgcolor = '#1a365d'

  constructor() {
    super()
    this.addOutput('chain', 'chain')
    this.addProperty('chainName', 'mainnet')
    this.size = [180, 60]

    // Dropdown widget for chain selection
    this.addWidget('combo', 'Network', 'mainnet', (v: string) => {
      this.properties.chainName = v
    }, { values: CHAIN_NAMES })
  }

  onExecute() {
    const chainName = this.properties.chainName as string
    const chain = CHAINS[chainName]
    if (chain) {
      this.setOutputData(0, chain)
    }
  }

  getTitle(): string {
    return `Chain: ${this.properties.chainName}`
  }
}

export function registerChainNode() {
  LiteGraph.registerNodeType('viem/Chain', ChainNode)
}

export { ChainNode, CHAINS, CHAIN_NAMES }
