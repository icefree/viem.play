import { LGraphNode } from 'litegraph.js'
import { type WalletClient } from 'viem'

/**
 * switchChain 节点 - 切换链
 */
export class SwitchChainNode extends LGraphNode {
  static title = 'switchChain'
  static desc = 'Switch to a different chain'

  color = '#c53030'
  bgcolor = '#742a2a'

  constructor() {
    super()
    this.title = 'switchChain'
    this.addInput('client', 'walletClient')
    this.addInput('chainId', 'number')
    this.addInput('switch', -1)
    this.addOutput('success', 'boolean')
    this.size = [160, 80]
  }

  async onAction(action: string) {
    if (action === 'switch') {
      const client = this.getInputData(0) as WalletClient | undefined
      const chainId = this.getInputData(1) as number | undefined

      if (!client || !chainId) return

      try {
        await client.switchChain({ id: chainId })
        this.setOutputData(0, true)
      } catch (_) {
        this.setOutputData(0, false)
      }
    }
  }
}
