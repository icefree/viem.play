import { LGraphNode } from 'litegraph.js'
import { type PublicClient } from 'viem'

/**
 * getChainId 节点 - 获取链 ID
 */
export class GetChainIdNode extends LGraphNode {
  static title = 'getChainId'
  static desc = 'Get chain ID'

  color = '#6b46c1'
  bgcolor = '#44337a'

  private chainId: number | null = null

  constructor() {
    super()
    this.title = 'getChainId'
    this.addInput('client', 'publicClient')
    this.addInput('trigger', -1)
    this.addOutput('chainId', 'number')
    this.size = [160, 60]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as PublicClient | undefined

      if (!client) return

      try {
        this.chainId = await client.getChainId()
      } catch (err) {
        console.error(err)
        this.chainId = null
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.chainId)
  }
}
