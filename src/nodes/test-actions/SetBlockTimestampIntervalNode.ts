import { LGraphNode } from 'litegraph.js'
import { type TestClient } from 'viem'

/**
 * setBlockTimestampInterval 节点 - 设置区块时间戳间隔
 */
export class SetBlockTimestampIntervalNode extends LGraphNode {
  static title = 'setBlockTimestampInterval'
  static desc = 'Set block timestamp interval'

  color = '#805ad5'
  bgcolor = '#553c9a'

  constructor() {
    super()
    this.title = 'setBlockTimestampInterval'
    this.addInput('client', 'testClient')
    this.addInput('interval', 'number')
    this.addInput('trigger', -1)
    this.addOutput('success', 'boolean')
    this.size = [200, 80]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as TestClient | undefined
      const interval = this.getInputData(1) as number | undefined

      if (!client || interval === undefined) return

      try {
        await client.setBlockTimestampInterval({ interval })
        this.setOutputData(0, true)
      } catch (_) {
        this.setOutputData(0, false)
      }
    }
  }
}
