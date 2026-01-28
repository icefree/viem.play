import { LGraphNode } from 'litegraph.js'
import { verifyMessage, type Address, type Hex } from 'viem'

/**
 * verifyMessage 节点 - 验证消息签名
 */
export class VerifyMessageNode extends LGraphNode {
  static title = 'verifyMessage'
  static desc = 'Verify a message signature'

  color = '#4a5568'
  bgcolor = '#2d3748'

  private isValid: boolean | null = null

  constructor() {
    super()
    this.title = 'verifyMessage'
    this.addInput('address', 'address')
    this.addInput('message', 'string')
    this.addInput('signature', 'bytes')
    this.addInput('trigger', -1)
    this.addOutput('isValid', 'boolean')
    this.size = [180, 100]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const address = this.getInputData(0) as Address | undefined
      const message = this.getInputData(1) as string | undefined
      const signature = this.getInputData(2) as Hex | undefined

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
