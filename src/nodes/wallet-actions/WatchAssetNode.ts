import { LGraphNode } from 'litegraph.js'
import { type WalletClient, type Address } from 'viem'

/**
 * watchAsset 节点 - 监视资产
 */
export class WatchAssetNode extends LGraphNode {
  static title = 'watchAsset'
  static desc = 'Watch an asset'

  color = '#c53030'
  bgcolor = '#742a2a'

  constructor() {
    super()
    this.title = 'watchAsset'
    this.addInput('client', 'walletClient')
    this.addInput('address', 'address')
    this.addInput('symbol', 'string')
    this.addInput('decimals', 'number')
    this.addInput('trigger', -1)
    this.addOutput('success', 'boolean')
    this.size = [160, 120]
    this.addProperty('type', 'ERC20', 'enum', { values: ['ERC20', 'ERC721', 'ERC1155'] })
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as WalletClient | undefined
      const address = this.getInputData(1) as Address | undefined
      const symbol = this.getInputData(2) as string | undefined
      const decimals = this.getInputData(3) as number | undefined

      if (!client || !address || !symbol) return

      try {
        const success = await client.watchAsset({
          type: 'ERC20', // Only ERC20 is currently supported by wallets
          options: {
            address,
            symbol,
            decimals: decimals ?? 18
          }
        })
        this.setOutputData(0, success)
      } catch (err) {
        console.error(err)
        this.setOutputData(0, false)
      }
    }
  }
}
