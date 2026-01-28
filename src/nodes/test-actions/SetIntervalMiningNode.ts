import { LGraphNode } from 'litegraph.js'
import { type TestClient } from 'viem'

/**
 * setIntervalMining 节点 - 设置自动挖矿间隔
 */
export class SetIntervalMiningNode extends LGraphNode {
  static title = 'setIntervalMining'
  static desc = 'Set automatic mining interval'

  color = '#805ad5'
  bgcolor = '#553c9a'

  constructor() {
    super()
    this.title = 'setIntervalMining'
    this.addInput('client', 'testClient')
    this.addInput('interval', 'number')
    this.addInput('trigger', -1)
    this.addOutput('success', 'boolean')
    this.size = [180, 80]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as TestClient | undefined
      const interval = this.getInputData(1) as number | undefined

      if (!client || interval === undefined) return

      try {
        await client.setIntervalMining({ interval })
        this.setOutputData(0, true)
      } catch (_) {
        this.setOutputData(0, false)
      }
    }
  }
}
