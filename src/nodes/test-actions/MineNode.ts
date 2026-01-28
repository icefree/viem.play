import { LGraphNode } from 'litegraph.js'
import { type TestClient } from 'viem'

/**
 * mine 节点 - 强制挖矿 (测试用)
 */
export class MineNode extends LGraphNode {
  static title = 'mine'
  static desc = 'Mine a specified number of blocks'

  color = '#805ad5'
  bgcolor = '#553c9a'

  constructor() {
    super()
    this.title = 'mine'
    this.addInput('client', 'testClient')
    this.addInput('blocks', 'number')
    this.addInput('mine', -1)
    this.addOutput('success', 'boolean')
    this.size = [160, 80]
  }

  async onAction(action: string) {
    if (action === 'mine') {
      const client = this.getInputData(0) as TestClient | undefined
      const blocks = this.getInputData(1) as number | 1

      if (!client) return

      try {
        await client.mine({ blocks })
        this.setOutputData(0, true)
      } catch (_) {
        this.setOutputData(0, false)
      }
    }
  }
}
