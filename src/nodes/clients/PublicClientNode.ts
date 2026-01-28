import { LGraphNode } from 'litegraph.js'
import { createPublicClient, http, type PublicClient, type Chain } from 'viem'
import { logger } from '../../stores/useLogStore'
import { createViemLogger } from '../../utils/viemLogger'
import { wrapClientWithLogger } from '../../utils/clientProxy'

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

    // Create a config identifier to detect changes
    const transportId = transport ? (transport.uid || transport.url || 'custom-transport') : 'default'
    const configHash = `${chain.id}-${transportId}`

    if (this.lastConfigHash !== configHash || (transport && !this.currentClient)) {
      this.lastConfigHash = configHash
      
      let finalTransport = transport
      if (!finalTransport) {
        const { onFetchRequest, onFetchResponse } = createViemLogger('HTTP-Default')
        finalTransport = http(undefined, { onFetchRequest, onFetchResponse })
      }

      const client = createPublicClient({
        chain,
        transport: finalTransport
      })

      // Wrap client in a Proxy to log all method calls
      this.currentClient = wrapClientWithLogger(client, 'PublicAction')
      
      const transportType = transport ? (transport.type || 'Custom') : 'Http-Default'
      logger.info(`Created Proactive PublicClient for ${chain.name} via ${transportType}`, 'PublicClient', { chainId: chain.id })
    }

    this.setOutputData(0, this.currentClient)
  }

  getTitle(): string {
    const chain = this.getInputData(0) as Chain | undefined
    const transport = this.getInputData(1)
    if (chain) {
      const transportType = transport ? (transport.type || 'Custom') : ''
      return `PublicClient (${chain.name}${transportType ? ' : ' + transportType : ''})`
    }
    return 'PublicClient'
  }
}
