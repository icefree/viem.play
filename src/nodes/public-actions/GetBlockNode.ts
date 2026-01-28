import { LGraphNode } from 'litegraph.js'
import { type PublicClient } from 'viem'

/**
 * GetBlock 节点 - 获取区块信息
 */
export class GetBlockNode extends LGraphNode {
  static title = 'getBlock'
  static desc = 'Get block information'

  color = '#6b46c1'
  bgcolor = '#44337a'

  private block: object | null = null
  private isLoading = false

  constructor() {
    super()
    this.title = 'getBlock'
    this.addInput('client', 'publicClient')
    this.addInput('blockNumber', 'bigint')
    this.addInput('trigger', -1)
    this.addOutput('block', 'object')
    this.addOutput('timestamp', 'bigint')
    this.addOutput('hash', 'string')
    this.size = [180, 90]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      await this.fetchBlock()
    }
  }

  async fetchBlock() {
    const client = this.getInputData(0) as PublicClient | undefined
    const blockNumber = this.getInputData(1) as bigint | undefined

    if (!client) {
      this.setOutputData(0, null)
      return
    }

    if (!this.isLoading) {
      this.isLoading = true
      try {
        const block = await client.getBlock(
          blockNumber ? { blockNumber } : {}
        )
        this.block = block
        this.setOutputData(0, block)
        this.setOutputData(1, block.timestamp)
        this.setOutputData(2, block.hash)
      } catch (e) {
        console.error('GetBlock error:', e)
      } finally {
        this.isLoading = false
      }
    }
  }

  onExecute() {
    if (this.block !== null) {
      this.setOutputData(0, this.block)
    }
  }
}
