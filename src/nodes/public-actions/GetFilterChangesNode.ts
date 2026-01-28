import { LGraphNode } from 'litegraph.js'
import { type PublicClient } from 'viem'

/**
 * getFilterChanges 节点 - 获取过滤器变化
 */
export class GetFilterChangesNode extends LGraphNode {
  static title = 'getFilterChanges'
  static desc = 'Get changes since last poll'

  color = '#6b46c1'
  bgcolor = '#44337a'

  private changes: any[] | null = null

  constructor() {
    super()
    this.title = 'getFilterChanges'
    this.addInput('client', 'publicClient')
    this.addInput('filter', 'object')
    this.addInput('trigger', -1)
    this.addOutput('changes', 'array')
    this.size = [180, 80]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as PublicClient | undefined
      const filter = this.getInputData(1) as any

      if (!client || !filter) return

      try {
        this.changes = await client.getFilterChanges({ filter })
      } catch (err) {
        console.error(err)
        this.changes = null
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.changes)
  }
}
