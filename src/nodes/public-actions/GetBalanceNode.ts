import { LGraphNode } from 'litegraph.js'
import { type PublicClient, type Address, formatEther } from 'viem'
import { logger } from '@/stores/useLogStore'

/**
 * GetBalance 节点 - 获取地址余额
 */
export class GetBalanceNode extends LGraphNode {
  static title = 'getBalance'
  static desc = 'Get the balance of an address'

  color = '#6b46c1'
  bgcolor = '#44337a'

  private balance: bigint | null = null
  private isLoading = false
  private error: string | null = null
  private lastAddress: string | null = null

  constructor() {
    super()
    this.title = 'getBalance'
    this.addInput('trigger', -1)
    this.addInput('client', 'publicClient')
    this.addInput('address', 'address')
    this.addOutput('balance', 'bigint')
    this.addOutput('formatted', 'string')
    this.size = [200, 80]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      await this.fetchBalance()
    }
  }

  async fetchBalance() {
    const client = this.getInputData(1) as PublicClient | undefined
    const address = this.getInputData(2) as Address | undefined

    if (!client || !address) {
      this.balance = null
      this.setOutputData(0, null)
      this.setOutputData(1, null)
      return
    }

    // Only fetch if address changed
    if (address !== this.lastAddress && !this.isLoading) {
      this.lastAddress = address
      this.isLoading = true
      this.error = null

      try {
        this.balance = await client.getBalance({ address })
        logger.info(`Fetched balance for ${address}`, 'getBalance', { address, balance: this.balance.toString() })
        this.setOutputData(0, this.balance)
        this.setOutputData(1, formatEther(this.balance))
      } catch (e) {
        this.error = (e as Error).message
        logger.error(`Failed to fetch balance: ${this.error}`, 'getBalance', { address })
        this.balance = null
      } finally {
        this.isLoading = false
      }
    } else if (this.balance !== null) {
      this.setOutputData(0, this.balance)
      this.setOutputData(1, formatEther(this.balance))
    }
  }

  onExecute() {
    // Output current cached result
    if (this.balance !== null) {
      this.setOutputData(0, this.balance)
      this.setOutputData(1, formatEther(this.balance))
    }
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) return

    ctx.font = '11px monospace'

    if (this.isLoading) {
      ctx.fillStyle = '#ffd700'
      ctx.fillText('Loading...', 10, 50)
    } else if (this.error) {
      ctx.fillStyle = '#ff6b6b'
      ctx.fillText(`Error: ${this.error.slice(0, 20)}`, 10, 50)
    } else if (this.balance !== null) {
      ctx.fillStyle = '#48bb78'
      ctx.fillText(`${formatEther(this.balance)} ETH`, 10, 50)
    }
  }
}
