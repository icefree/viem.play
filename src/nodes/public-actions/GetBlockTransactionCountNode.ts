import { LGraphNode } from 'litegraph.js'
import { type PublicClient } from 'viem'

/**
 * GetBlockTransactionCount 节点 - 获取区块中的交易数量
 */
export class GetBlockTransactionCountNode extends LGraphNode {
  static title = 'getBlockTransactionCount'
  static desc = 'Get transaction count of a block'

  color = '#6b46c1'
  bgcolor = '#44337a'

  private count: number | null = null
  private isLoading = false

  constructor() {
    super()
    this.title = 'getBlockTransactionCount'
    this.addInput('client', 'publicClient')
    this.addInput('blockNumber', 'bigint')
    this.addInput('blockHash', 'string')
    this.addInput('trigger', -1)
    this.addOutput('count', 'number')
    this.size = [200, 90]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      await this.fetchCount()
    }
  }

  async fetchCount() {
    const client = this.getInputData(0) as PublicClient | undefined
    const blockNumber = this.getInputData(1) as bigint | undefined
    const blockHash = this.getInputData(2) as `0x${string}` | undefined

    if (!client) {
      this.setOutputData(0, null)
      return
    }

    if (!this.isLoading) {
      this.isLoading = true
      try {
        // 优先使用 blockHash，其次使用 blockNumber
        let count: number
        if (blockHash) {
          count = await client.getBlockTransactionCount({ blockHash })
        } else if (blockNumber) {
          count = await client.getBlockTransactionCount({ blockNumber })
        } else {
          // 获取最新区块的交易数量
          count = await client.getBlockTransactionCount()
        }
        this.count = count
        this.setOutputData(0, count)
      } catch (e) {
        console.error('GetBlockTransactionCount error:', e)
      } finally {
        this.isLoading = false
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.count)
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) return

    ctx.font = '12px monospace'
    ctx.fillStyle = '#e2e8f0'

    if (this.count !== null) {
      ctx.fillText(`Txs: ${this.count}`, 10, 75)
    } else {
      ctx.fillText('No data', 10, 75)
    }
  }
}
