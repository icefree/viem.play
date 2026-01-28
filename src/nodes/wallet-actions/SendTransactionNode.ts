import { LGraphNode } from 'litegraph.js'
import { type WalletClient, type Address } from 'viem'

/**
 * sendTransaction 节点 - 发送交易
 */
export class SendTransactionNode extends LGraphNode {
  static title = 'sendTransaction'
  static desc = 'Send a transaction'

  color = '#c53030'
  bgcolor = '#742a2a'

  private hash: string | null = null
  private isLoading = false
  private error: string | null = null

  constructor() {
    super()
    this.title = 'sendTransaction'
    this.addInput('client', 'walletClient')
    this.addInput('to', 'address')
    this.addInput('value', 'bigint')
    this.addInput('data', 'bytes')
    this.addInput('trigger', -1) // Trigger input
    this.addOutput('hash', 'string')
    this.size = [180, 110]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      await this.sendTransaction()
    }
  }

  async sendTransaction() {
    const client = this.getInputData(0) as WalletClient | undefined
    const to = this.getInputData(1) as Address | undefined
    const value = this.getInputData(2) as bigint | undefined
    const data = this.getInputData(3) as `0x${string}` | undefined

    if (!client || !to) return

    this.isLoading = true
    this.error = null
    this.hash = null

    try {
      // @ts-expect-error - bypass complex viem client/account typing
      this.hash = await client.sendTransaction({
        to,
        value: value || 0n,
        data: data || undefined
      })
    } catch (e: any) {
      this.error = e.message
    } finally {
      this.isLoading = false
    }
  }

  onExecute() {
    this.setOutputData(0, this.hash)
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) return
    ctx.font = '10px monospace'
    if (this.isLoading) {
      ctx.fillStyle = '#ecc94b'
      ctx.fillText('Sending...', 10, 100)
    } else if (this.error) {
      ctx.fillStyle = '#f56565'
      ctx.fillText('Error: ' + this.error.slice(0, 15), 10, 100)
    } else if (this.hash) {
      ctx.fillStyle = '#48bb78'
      ctx.fillText('Hash: ' + this.hash.slice(0, 10) + '...', 10, 100)
    }
  }
}
