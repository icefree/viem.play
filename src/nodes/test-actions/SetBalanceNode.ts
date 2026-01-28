import { LGraphNode } from 'litegraph.js'
import { type TestClient, type Address } from 'viem'

/**
 * setBalance 节点 - 设置余额 (测试用)
 */
export class SetBalanceNode extends LGraphNode {
  static title = 'setBalance'
  static desc = 'Set the balance of an address (test client only)'

  color = '#805ad5'
  bgcolor = '#553c9a'

  constructor() {
    super()
    this.title = 'setBalance'
    this.addInput('client', 'testClient')
    this.addInput('address', 'address')
    this.addInput('value', 'bigint')
    this.addInput('set', -1)
    this.addOutput('success', 'boolean')
    this.size = [180, 100]
  }

  async onAction(action: string) {
    if (action === 'set') {
      const client = this.getInputData(0) as TestClient | undefined
      const address = this.getInputData(1) as Address | undefined
      const value = this.getInputData(2) as bigint | undefined

      if (!client || !address || value === undefined) return

      try {
        await client.setBalance({ address, value })
        this.setOutputData(0, true)
      } catch (_) {
        this.setOutputData(0, false)
      }
    }
  }
}
