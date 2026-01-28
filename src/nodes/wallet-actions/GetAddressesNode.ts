import { LGraphNode } from 'litegraph.js'
import { type WalletClient } from 'viem'

/**
 * getAddresses 节点 - 获取钱包地址列表
 */
export class GetAddressesNode extends LGraphNode {
  static title = 'getAddresses'
  static desc = 'Get list of wallet addresses'

  color = '#c53030'
  bgcolor = '#742a2a'

  private addresses: string[] = []

  constructor() {
    super()
    this.title = 'getAddresses'
    this.addInput('client', 'walletClient')
    this.addInput('trigger', -1)
    this.addOutput('addresses', 'array')
    this.size = [160, 60]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as WalletClient | undefined
      if (!client) return

      try {
        this.addresses = await client.getAddresses()
      } catch (_) {
        this.addresses = []
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.addresses)
  }
}
