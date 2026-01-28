import { LGraphNode } from 'litegraph.js'
import { type TestClient, type Address } from 'viem'

/**
 * stopImpersonatingAccount 节点 - 停止模拟账户
 */
export class StopImpersonatingAccountNode extends LGraphNode {
  static title = 'stopImpersonatingAccount'
  static desc = 'Stop impersonating an account'

  color = '#805ad5'
  bgcolor = '#553c9a'

  constructor() {
    super()
    this.title = 'stopImpersonatingAccount'
    this.addInput('client', 'testClient')
    this.addInput('address', 'address')
    this.addInput('trigger', -1)
    this.addOutput('success', 'boolean')
    this.size = [200, 80]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as TestClient | undefined
      const address = this.getInputData(1) as Address | undefined

      if (!client || !address) return

      try {
        await client.stopImpersonatingAccount({ address })
        this.setOutputData(0, true)
      } catch (_) {
        this.setOutputData(0, false)
      }
    }
  }
}
