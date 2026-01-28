import { LGraphNode } from 'litegraph.js'
import { type TestClient } from 'viem'

/**
 * reset 节点 - 重置分叉状态
 */
export class ResetForkNode extends LGraphNode {
  static title = 'reset'
  static desc = 'Reset forking state'

  color = '#805ad5'
  bgcolor = '#553c9a'

  constructor() {
    super()
    this.title = 'reset'
    this.addInput('client', 'testClient')
    this.addInput('jsonRpcUrl', 'string')
    this.addInput('blockNumber', 'bigint')
    this.addInput('trigger', -1)
    this.addOutput('success', 'boolean')
    this.size = [180, 100]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as TestClient | undefined
      const jsonRpcUrl = this.getInputData(1) as string | undefined
      const blockNumber = this.getInputData(2) as bigint | undefined

      if (!client) return

      try {
        await client.reset({
          ...(jsonRpcUrl && { jsonRpcUrl }),
          ...(blockNumber && { blockNumber })
        })
        this.setOutputData(0, true)
      } catch (_) {
        this.setOutputData(0, false)
      }
    }
  }
}
