import { LGraphNode } from 'litegraph.js'
import { createWalletClient, http, type WalletClient, type Chain } from 'viem'
import { logger } from '@/stores/useLogStore'
import { wrapClientWithLogger } from '@/utils/clientProxy'
import { createViemLogger } from '@/utils/viemLogger'

/**
 * WalletClient 节点 - 创建 viem 的 WalletClient
 * 用于发送交易和签名
 */
export class WalletClientNode extends LGraphNode {
  static title = 'Wallet Client'
  static desc = 'Create a viem WalletClient for sending transactions'

  color = '#c53030'
  bgcolor = '#742a2a'

  private currentClient: WalletClient | null = null
  private lastConfigHash: string | null = null

  constructor() {
    super()
    this.title = 'WalletClient'
    this.addInput('chain', 'chain')
    this.addInput('transport', 'transport')
    this.addInput('account', 'account')
    this.addOutput('client', 'walletClient')
    this.size = [180, 80]
  }

  onExecute() {
    const chain = this.getInputData(0) as Chain | undefined
    const transport = this.getInputData(1)
    const account = this.getInputData(2)
    
    if (!chain) {
      this.setOutputData(0, null)
      return
    }

    const transportId = transport ? (transport.uid || transport.url || 'custom-transport') : 'default'
    const accountId = account ? (typeof account === 'string' ? account : account.address) : 'no-account'
    const configHash = `${chain.id}-${transportId}-${accountId}`

    if (this.lastConfigHash !== configHash || (transport && !this.currentClient)) {
      this.lastConfigHash = configHash

      let finalTransport = transport
      if (!finalTransport) {
        const { onFetchRequest, onFetchResponse } = createViemLogger('HTTP-Default-Wallet')
        finalTransport = http(undefined, { onFetchRequest, onFetchResponse })
      }

      const client = createWalletClient({
        chain,
        transport: finalTransport,
        account: account || undefined
      })

      // Wrap client in a Proxy to log all method calls
      this.currentClient = wrapClientWithLogger(client, 'WalletAction')
      
      const transportType = transport ? (transport.type || 'Custom') : 'Http-Default'
      logger.info(`Created WalletClient for ${chain.name} via ${transportType}`, 'WalletClient', { chainId: chain.id, account: accountId })
    }

    this.setOutputData(0, this.currentClient)
  }

  getTitle(): string {
    const chain = this.getInputData(0) as Chain | undefined
    const transport = this.getInputData(1)
    if (chain) {
      const transportType = transport ? (transport.type || 'Custom') : ''
      return `WalletClient (${chain.name}${transportType ? ' : ' + transportType : ''})`
    }
    return 'WalletClient'
  }
}
