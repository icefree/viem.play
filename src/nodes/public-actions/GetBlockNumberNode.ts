import { LGraphNode } from 'litegraph.js'
import { type PublicClient } from 'viem'

/**
 * GetBlockNumber 节点 - 获取当前区块号
 */
export class GetBlockNumberNode extends LGraphNode {
  static title = 'getBlockNumber'
  static desc = 'Get the current block number'

  color = '#6b46c1'
  bgcolor = '#44337a'

  private blockNumber: bigint | null = null
  private isLoading = false

  constructor() {
    super()
    this.title = 'getBlockNumber'
    this.addInput('client', 'publicClient')
    this.addInput('trigger', -1)
    this.addOutput('blockNumber', 'bigint')
    this.size = [180, 80]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      await this.fetchBlockNumber()
    }
  }

  async fetchBlockNumber() {
    const client = this.getInputData(0) as PublicClient | undefined

    if (!client) {
      this.setOutputData(0, null)
      return
    }

    if (!this.isLoading) {
      this.isLoading = true

      try {
        this.blockNumber = await client.getBlockNumber()
      } catch (e) {
        console.error('GetBlockNumber error:', e)
      } finally {
        this.isLoading = false
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.blockNumber)
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) return

    ctx.font = '12px monospace'
    ctx.fillStyle = '#e2e8f0'

    if (this.blockNumber !== null) {
      ctx.fillText(`#${this.blockNumber.toString()}`, 10, 60)
    } else {
      ctx.fillText('No data', 10, 60)
    }
  }
}
