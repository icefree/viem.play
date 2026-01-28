import { LGraphNode, LiteGraph } from 'litegraph.js'
import { createPublicClient, http, type PublicClient, type Chain } from 'viem'

/**
 * PublicClient 节点 - 创建 viem 的 PublicClient
 * 用于读取区块链数据
 */
export class PublicClientNode extends LGraphNode {
  static title = 'PublicClient'
  static desc = 'Create a viem PublicClient for reading blockchain data'

  color = '#276749'
  bgcolor = '#1c4532'

  private currentClient: PublicClient | null = null
  private lastConfigHash: string | null = null

  constructor() {
    super()
    this.title = 'PublicClient'
    this.addInput('chain', 'chain')
    this.addInput('transport', 'transport')
    this.addOutput('client', 'publicClient')
    this.size = [180, 60]
  }

  onExecute() {
    const chain = this.getInputData(0) as Chain | undefined
    const transport = this.getInputData(1)

    if (!chain) {
      this.setOutputData(0, null)
      return
    }

    // Create a config object to detect changes
    const config = {
      chainId: chain.id,
      transport: transport ? 'custom' : 'default'
    }
    const configHash = JSON.stringify(config)

    if (this.lastConfigHash !== configHash) {
      this.lastConfigHash = configHash
      
      this.currentClient = createPublicClient({
        chain,
        transport: transport || http()
      })
    }

    this.setOutputData(0, this.currentClient)
  }

  getTitle(): string {
    const chain = this.getInputData(0) as Chain | undefined
    if (chain) {
      return `PublicClient (${chain.name})`
    }
    return 'PublicClient'
  }
}
