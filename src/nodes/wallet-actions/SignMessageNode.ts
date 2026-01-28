import { LGraphNode } from 'litegraph.js'
import { type WalletClient } from 'viem'

/**
 * signMessage 节点 - 签名消息
 */
export class SignMessageNode extends LGraphNode {
  static title = 'signMessage'
  static desc = 'Sign a message with wallet'

  color = '#c53030'
  bgcolor = '#742a2a'

  private signature: string | null = null
  private isLoading = false

  constructor() {
    super()
    this.title = 'signMessage'
    this.addInput('client', 'walletClient')
    this.addInput('message', 'string')
    this.addInput('trigger', -1)
    this.addOutput('signature', 'string')
    this.size = [180, 80]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as WalletClient | undefined
      const message = this.getInputData(1) as string | undefined

      if (!client || !message) return

      this.isLoading = true
      try {
        // @ts-expect-error
        this.signature = await client.signMessage({ message })
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.signature)
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) return
    if (this.isLoading) {
      ctx.font = '10px monospace'
      ctx.fillStyle = '#ecc94b'
      ctx.fillText('Signing...', 10, 70)
    }
  }
}
