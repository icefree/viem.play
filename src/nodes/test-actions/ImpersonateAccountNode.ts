import { LGraphNode } from 'litegraph.js'
import { type TestClient, type Address } from 'viem'

/**
 * impersonateAccount 节点 - 模拟账户 (测试用)
 */
export class ImpersonateAccountNode extends LGraphNode {
  static title = 'impersonateAccount'
  static desc = 'Impersonate an account'

  color = '#805ad5'
  bgcolor = '#553c9a'

  constructor() {
    super()
    this.title = 'impersonateAccount'
    this.addInput('client', 'testClient')
    this.addInput('address', 'address')
    this.addInput('trigger', -1)
    this.addOutput('success', 'boolean')
    this.size = [180, 80]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as TestClient | undefined
      const address = this.getInputData(1) as Address | undefined

      if (!client || !address) return

      try {
        await client.impersonateAccount({ address })
        this.setOutputData(0, true)
      } catch (_) {
        this.setOutputData(0, false)
      }
    }
  }
}
