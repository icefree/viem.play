import { LGraphNode } from 'litegraph.js'
import { type TestClient } from 'viem'

/**
 * setNextBlockTimestamp 节点 - 设置下一个区块时间戳
 */
export class SetNextBlockTimestampNode extends LGraphNode {
  static title = 'setNextBlockTimestamp'
  static desc = 'Set the timestamp of the next block'

  color = '#805ad5'
  bgcolor = '#553c9a'

  constructor() {
    super()
    this.title = 'setNextBlockTimestamp'
    this.addInput('client', 'testClient')
    this.addInput('timestamp', 'bigint,number')
    this.addInput('trigger', -1)
    this.addOutput('success', 'boolean')
    this.size = [200, 80]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as TestClient | undefined
      const timestamp = this.getInputData(1) as any

      if (!client || timestamp === undefined) return

      try {
        await client.setNextBlockTimestamp({ 
          timestamp: typeof timestamp === 'bigint' ? timestamp : BigInt(timestamp) 
        })
        this.setOutputData(0, true)
      } catch (_) {
        this.setOutputData(0, false)
      }
    }
  }
}
