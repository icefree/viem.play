import { LGraphNode } from 'litegraph.js'
import { type PublicClient, formatGwei } from 'viem'

/**
 * GetGasPrice 节点 - 获取当前 Gas 价格
 */
export class GetGasPriceNode extends LGraphNode {
  static title = 'getGasPrice'
  static desc = 'Get the current gas price'

  color = '#6b46c1'
  bgcolor = '#44337a'

  private gasPrice: bigint | null = null
  private isLoading = false

  constructor() {
    super()
    this.title = 'getGasPrice'
    this.addInput('client', 'publicClient')
    this.addInput('trigger', -1)
    this.addOutput('gasPrice', 'bigint')
    this.addOutput('gwei', 'string')
    this.size = [180, 60]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      await this.fetchGasPrice()
    }
  }

  async fetchGasPrice() {
    const client = this.getInputData(0) as PublicClient | undefined

    if (!client) {
      this.setOutputData(0, null)
      this.setOutputData(1, null)
      return
    }

    if (!this.isLoading) {
      this.isLoading = true

      try {
        this.gasPrice = await client.getGasPrice()
      } catch (e) {
        console.error('GetGasPrice error:', e)
      } finally {
        this.isLoading = false
      }
    }
  }

  onExecute() {
    if (this.gasPrice !== null) {
      this.setOutputData(0, this.gasPrice)
      this.setOutputData(1, formatGwei(this.gasPrice))
    }
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) return

    ctx.font = '12px monospace'
    ctx.fillStyle = '#e2e8f0'

    if (this.gasPrice !== null) {
      ctx.fillText(`${formatGwei(this.gasPrice)} Gwei`, 10, 40)
    }
  }
}
