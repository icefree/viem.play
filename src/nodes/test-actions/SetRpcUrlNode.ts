import { LGraphNode } from 'litegraph.js'
import { type TestClient } from 'viem'

/**
 * setRpcUrl 节点 - 设置 RPC URL
 */
export class SetRpcUrlNode extends LGraphNode {
  static title = 'setRpcUrl'
  static desc = 'Set RPC URL'

  color = '#805ad5'
  bgcolor = '#553c9a'

  constructor() {
    super()
    this.title = 'setRpcUrl'
    this.addInput('client', 'testClient')
    this.addInput('rpcUrl', 'string')
    this.addInput('trigger', -1)
    this.addOutput('success', 'boolean')
    this.size = [180, 80]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as TestClient | undefined
      const jsonRpcUrl = this.getInputData(1) as string | undefined

      if (!client || !jsonRpcUrl) return

      try {
        await client.setRpcUrl(jsonRpcUrl)
        this.setOutputData(0, true)
      } catch (_) {
        this.setOutputData(0, false)
      }
    }
  }
}
