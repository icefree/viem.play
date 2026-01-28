import { LGraphNode } from 'litegraph.js'
import { type TestClient, type Hash } from 'viem'

/**
 * dropTransaction 节点 - 从内存池移除交易
 */
export class DropTransactionNode extends LGraphNode {
  static title = 'dropTransaction'
  static desc = 'Remove transaction from mempool'

  color = '#805ad5'
  bgcolor = '#553c9a'

  constructor() {
    super()
    this.title = 'dropTransaction'
    this.addInput('client', 'testClient')
    this.addInput('hash', 'string')
    this.addInput('trigger', -1)
    this.addOutput('success', 'boolean')
    this.size = [180, 80]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as TestClient | undefined
      const hash = this.getInputData(1) as Hash | undefined

      if (!client || !hash) return

      try {
        await client.dropTransaction({ hash })
        this.setOutputData(0, true)
      } catch (_) {
        this.setOutputData(0, false)
      }
    }
  }
}
