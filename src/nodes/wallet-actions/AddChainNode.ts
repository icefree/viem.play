import { LGraphNode } from 'litegraph.js'
import { type WalletClient, type Chain } from 'viem'

/**
 * addChain 节点 - 向钱包添加新链
 */
export class AddChainNode extends LGraphNode {
  static title = 'addChain'
  static desc = 'Add a new chain to wallet'

  color = '#c53030'
  bgcolor = '#742a2a'

  constructor() {
    super()
    this.title = 'addChain'
    this.addInput('client', 'walletClient')
    this.addInput('chain', 'chain')
    this.addInput('trigger', -1)
    this.addOutput('success', 'boolean')
    this.size = [160, 80]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as WalletClient | undefined
      const chain = this.getInputData(1) as Chain | undefined

      if (!client || !chain) return

      try {
        await client.addChain({ chain })
        this.setOutputData(0, true)
      } catch (err) {
        console.error(err)
        this.setOutputData(0, false)
      }
    }
  }
}
