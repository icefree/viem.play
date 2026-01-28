import { LGraphNode } from 'litegraph.js'
import { createTestClient, http, type TestClient, type Chain } from 'viem'
import { logger } from '@/stores/useLogStore'
import { wrapClientWithLogger } from '@/utils/clientProxy'
import { createViemLogger } from '@/utils/viemLogger'

/**
 * TestClient 节点 - 创建 viem 的 TestClient
 * 用于本地测试节点操作 (Anvil, Hardhat, Ganache)
 */
export class TestClientNode extends LGraphNode {
  static title = 'Test Client'
  static desc = 'Create a viem TestClient for local testing'

  color = '#805ad5'
  bgcolor = '#553c9a'

  private currentClient: TestClient | null = null
  private lastConfigHash: string | null = null

  constructor() {
    super()
    this.title = 'TestClient'
    this.addInput('chain', 'chain')
    this.addInput('transport', 'transport')
    this.addOutput('client', 'testClient')
    this.size = [180, 60]
  }

  onExecute() {
    const chain = this.getInputData(0) as Chain | undefined
    const transport = this.getInputData(1)

    if (!chain) {
      this.setOutputData(0, null)
      return
    }

    const transportId = transport ? (transport.uid || transport.url || 'custom-transport') : 'default'
    const configHash = `${chain.id}-${transportId}`

    if (this.lastConfigHash !== configHash || (transport && !this.currentClient)) {
      this.lastConfigHash = configHash

      let finalTransport = transport
      if (!finalTransport) {
        const { onFetchRequest, onFetchResponse } = createViemLogger('HTTP-Default-Test')
        finalTransport = http(undefined, { onFetchRequest, onFetchResponse })
      }

      // TestClient usually connect to local nodes (Anvil, etc)
      this.currentClient = createTestClient({
        chain,
        mode: 'anvil', // Default to anvil
        transport: finalTransport
      })

      // Wrap client in a Proxy to log all method calls
      this.currentClient = wrapClientWithLogger(this.currentClient, 'TestAction')
      
      const transportType = transport ? (transport.type || 'Custom') : 'Http-Default'
      logger.info(`Created TestClient for ${chain.name} via ${transportType}`, 'TestClient', { chainId: chain.id })
    }

    this.setOutputData(0, this.currentClient)
  }

  getTitle(): string {
    const chain = this.getInputData(0) as Chain | undefined
    const transport = this.getInputData(1)
    if (chain) {
      const transportType = transport ? (transport.type || 'Custom') : ''
      return `TestClient (${chain.name}${transportType ? ' : ' + transportType : ''})`
    }
    return 'TestClient'
  }
}
