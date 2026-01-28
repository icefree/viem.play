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
  private lastFetch = 0

  constructor() {
    super()
    this.title = 'getGasPrice'
    this.addInput('client', 'publicClient')
    this.addOutput('gasPrice', 'bigint')
    this.addOutput('gwei', 'string')
    this.size = [180, 60]
  }

  async onExecute() {
    const client = this.getInputData(0) as PublicClient | undefined

    if (!client) {
      this.setOutputData(0, null)
      this.setOutputData(1, null)
      return
    }

    const now = Date.now()
    if (now - this.lastFetch > 5000 && !this.isLoading) {
      this.isLoading = true
      this.lastFetch = now

      try {
        this.gasPrice = await client.getGasPrice()
      } catch (e) {
        console.error('GetGasPrice error:', e)
      } finally {
        this.isLoading = false
      }
    }

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
