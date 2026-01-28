import { LGraphNode } from 'litegraph.js'
import { type PublicClient, type Address, type Hex } from 'viem'

/**
 * getStorageAt 节点 - 获取存储位置的值
 */
export class GetStorageAtNode extends LGraphNode {
  static title = 'getStorageAt'
  static desc = 'Get storage selection at a contract address'

  color = '#6b46c1'
  bgcolor = '#44337a'

  private value: Hex | null = null

  constructor() {
    super()
    this.title = 'getStorageAt'
    this.addInput('client', 'publicClient')
    this.addInput('address', 'address')
    this.addInput('slot', 'bytes32')
    this.addInput('trigger', -1)
    this.addOutput('value', 'bytes32')
    this.size = [180, 100]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as PublicClient | undefined
      const address = this.getInputData(1) as Address | undefined
      const slot = this.getInputData(2) as Hex | undefined

      if (!client || !address || !slot) return

      try {
        this.value = await client.getStorageAt({ address, slot }) || null
      } catch (err) {
        console.error(err)
        this.value = null
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.value)
  }
}
