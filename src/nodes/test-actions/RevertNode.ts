import { LGraphNode } from 'litegraph.js'
import { type TestClient } from 'viem'

/**
 * revert 节点 - 恢复快照
 */
export class RevertNode extends LGraphNode {
  static title = 'revert'
  static desc = 'Revert state to a previous snapshot'

  color = '#805ad5'
  bgcolor = '#553c9a'

  constructor() {
    super()
    this.title = 'revert'
    this.addInput('client', 'testClient')
    this.addInput('id', 'string')
    this.addInput('trigger', -1)
    this.addOutput('success', 'boolean')
    this.size = [160, 80]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as TestClient | undefined
      const id = this.getInputData(1) as any

      if (!client || !id) return

      try {
        await client.revert({ id })
        this.setOutputData(0, true)
      } catch (_) {
        this.setOutputData(0, false)
      }
    }
  }
}
