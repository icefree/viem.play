import { LGraphNode } from 'litegraph.js'
import { type TestClient, type Address, type Hex } from 'viem'

/**
 * setStorageAt 节点 - 设置账户存储槽
 */
export class SetStorageAtNode extends LGraphNode {
  static title = 'setStorageAt'
  static desc = 'Set storage at an address'

  color = '#805ad5'
  bgcolor = '#553c9a'

  constructor() {
    super()
    this.title = 'setStorageAt'
    this.addInput('client', 'testClient')
    this.addInput('address', 'address')
    this.addInput('index', 'number')
    this.addInput('value', 'bytes32')
    this.addInput('trigger', -1)
    this.addOutput('success', 'boolean')
    this.size = [180, 120]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as TestClient | undefined
      const address = this.getInputData(1) as Address | undefined
      const index = this.getInputData(2) as number | undefined
      const value = this.getInputData(3) as Hex | undefined

      if (!client || !address || index === undefined || !value) return

      try {
        await client.setStorageAt({ address, index, value })
        this.setOutputData(0, true)
      } catch (_) {
        this.setOutputData(0, false)
      }
    }
  }
}
