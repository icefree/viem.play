import { LGraphNode } from 'litegraph.js'
import { type PublicClient, type Address } from 'viem'

/**
 * GetTransactionCount 节点 - 获取地址的交易数量 (nonce)
 */
export class GetTransactionCountNode extends LGraphNode {
  static title = 'getTransactionCount'
  static desc = 'Get the number of transactions sent from an address (nonce)'

  color = '#6b46c1'
  bgcolor = '#44337a'

  private count: number | null = null
  private isLoading = false
  private lastAddress: string | null = null

  constructor() {
    super()
    this.title = 'getTransactionCount'
    this.addInput('trigger', -1)
    this.addInput('client', 'publicClient')
    this.addInput('address', 'address')
    this.addOutput('count', 'number')
    this.size = [200, 60]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      await this.fetchTransactionCount()
    }
  }

  async fetchTransactionCount() {
    const client = this.getInputData(1) as PublicClient | undefined
    const address = this.getInputData(2) as Address | undefined

    if (!client || !address) {
      this.setOutputData(0, null)
      return
    }

    if (address !== this.lastAddress && !this.isLoading) {
      this.lastAddress = address
      this.isLoading = true

      try {
        this.count = await client.getTransactionCount({ address })
        this.setOutputData(0, this.count)
      } catch (e) {
        console.error('GetTransactionCount error:', e)
      } finally {
        this.isLoading = false
      }
    } else if (this.count !== null) {
      this.setOutputData(0, this.count)
    }
  }

  onExecute() {
    if (this.count !== null) {
      this.setOutputData(0, this.count)
    }
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) return

    ctx.font = '12px monospace'
    ctx.fillStyle = '#e2e8f0'

    if (this.count !== null) {
      ctx.fillText(`Nonce: ${this.count}`, 10, 40)
    }
  }
}
