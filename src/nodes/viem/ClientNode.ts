import { LGraphNode, LiteGraph } from 'litegraph.js'
import { createPublicClient, http, type PublicClient, type Chain } from 'viem'

// Store clients to avoid recreating
const clientCache = new Map<string, PublicClient>()

/**
 * PublicClient 节点 - 创建 viem 的 PublicClient
 */
class PublicClientNode extends LGraphNode {
  static title = 'Public Client'
  static desc = 'Create a viem PublicClient for reading blockchain data'

  color = '#276749'
  bgcolor = '#1c4532'

  private currentClient: PublicClient | null = null
  private lastChainId: number | null = null

  constructor() {
    super()
    this.addInput('chain', 'chain')
    this.addOutput('client', 'publicClient')
    this.size = [180, 50]
  }

  onExecute() {
    const chain = this.getInputData(0) as Chain | undefined

    if (!chain) {
      this.setOutputData(0, null)
      return
    }

    // Only recreate client if chain changed
    if (this.lastChainId !== chain.id) {
      const cacheKey = `public-${chain.id}`

      if (clientCache.has(cacheKey)) {
        this.currentClient = clientCache.get(cacheKey) as PublicClient
      } else {
        this.currentClient = createPublicClient({
          chain,
          transport: http(),
        })
        clientCache.set(cacheKey, this.currentClient)
      }

      this.lastChainId = chain.id
    }

    this.setOutputData(0, this.currentClient)
  }

  getTitle(): string {
    if (this.lastChainId) {
      return `PublicClient (${this.lastChainId})`
    }
    return 'Public Client'
  }
}

export function registerClientNode() {
  LiteGraph.registerNodeType('viem/PublicClient', PublicClientNode)
}

export { PublicClientNode }
