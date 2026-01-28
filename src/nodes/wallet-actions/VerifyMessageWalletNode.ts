import { LGraphNode } from 'litegraph.js'
import { type Address, type Hex, verifyMessage } from 'viem'

/**
 * verifyMessage 节点 - 验证消息签名 (Wallet Action)
 */
export class VerifyMessageWalletNode extends LGraphNode {
  static title = 'verifyMessage'
  static desc = 'Verify a message signature'

  color = '#c53030'
  bgcolor = '#742a2a'

  private isValid: boolean | null = null

  constructor() {
    super()
    this.title = 'verifyMessage'
    this.addInput('client', 'walletClient')
    this.addInput('address', 'address')
    this.addInput('message', 'string')
    this.addInput('signature', 'bytes')
    this.addInput('trigger', -1)
    this.addOutput('isValid', 'boolean')
    this.size = [180, 120]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const address = this.getInputData(1) as Address | undefined
      const message = this.getInputData(2) as string | undefined
      const signature = this.getInputData(3) as Hex | undefined

      if (!address || !message || !signature) return

      try {
        this.isValid = await verifyMessage({ address, message, signature })
      } catch (err) {
        console.error(err)
        this.isValid = false
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.isValid)
  }
}
