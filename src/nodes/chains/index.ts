import { LGraphNode, LiteGraph } from 'litegraph.js'
import {
  mainnet,
  sepolia,
  holesky,
  polygon,
  polygonAmoy,
  arbitrum,
  arbitrumSepolia,
  optimism,
  optimismSepolia,
  base,
  baseSepolia,
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

// Available chains organized by network type
const MAINNETS: Record<string, Chain> = {
  mainnet,
  polygon,
  arbitrum,
  optimism,
  base,
}

const TESTNETS: Record<string, Chain> = {
  sepolia,
  holesky,
  polygonAmoy,
  arbitrumSepolia,
  optimismSepolia,
  baseSepolia,
  anvil,
}

const ALL_CHAINS: Record<string, Chain> = {
  ...MAINNETS,
  ...TESTNETS,
}

const CHAIN_NAMES = Object.keys(ALL_CHAINS)

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
    const chain = ALL_CHAINS[chainName]
    if (chain) {
      this.setOutputData(0, chain)
    }
  }

  getTitle(): string {
    return `Chain: ${this.properties.chainName}`
  }
}

/**
 * Chain ID 节点 - 输出 chain 的 ID
 */
class ChainIdNode extends LGraphNode {
  static title = 'Chain ID'
  static desc = 'Get chain ID from chain object'

  color = '#2c5282'
  bgcolor = '#1a365d'

  constructor() {
    super()
    this.addInput('chain', 'chain')
    this.addOutput('chainId', 'number')
    this.size = [140, 50]
  }

  onExecute() {
    const chain = this.getInputData(0) as Chain | undefined
    if (chain) {
      this.setOutputData(0, chain.id)
    } else {
      this.setOutputData(0, null)
    }
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) return
    const chain = this.getInputData(0) as Chain | undefined
    if (chain) {
      ctx.fillStyle = '#e2e8f0'
      ctx.font = '12px monospace'
      ctx.fillText(`ID: ${chain.id}`, 10, 35)
    }
  }
}

/**
 * Chain Info 节点 - 显示链的详细信息
 */
class ChainInfoNode extends LGraphNode {
  static title = 'Chain Info'
  static desc = 'Display chain information'

  color = '#2c5282'
  bgcolor = '#1a365d'

  constructor() {
    super()
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

export function registerChainNodes() {
  LiteGraph.registerNodeType('Chains/Chain', ChainNode)
  LiteGraph.registerNodeType('Chains/ChainId', ChainIdNode)
  LiteGraph.registerNodeType('Chains/ChainInfo', ChainInfoNode)
}

export { ChainNode, ChainIdNode, ChainInfoNode, ALL_CHAINS, MAINNETS, TESTNETS, CHAIN_NAMES }
