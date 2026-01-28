import { LGraphNode } from 'litegraph.js'
import { type TestClient } from 'viem'

/**
 * snapshot 节点 - 创建快照
 */
export class SnapshotNode extends LGraphNode {
  static title = 'snapshot'
  static desc = 'Create a snapshot of the current state'

  color = '#805ad5'
  bgcolor = '#553c9a'

  private snapshotId: string | null = null

  constructor() {
    super()
    this.title = 'snapshot'
    this.addInput('client', 'testClient')
    this.addInput('trigger', -1)
    this.addOutput('id', 'string')
    this.size = [160, 60]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as TestClient | undefined
      if (!client) return

      try {
        this.snapshotId = await client.snapshot()
      } catch (err) {
        console.error(err)
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.snapshotId)
  }
}
