import { LGraphNode } from 'litegraph.js'
import { type PublicClient } from 'viem'

/**
 * verifySiweMessage 节点 - 验证 SIWE 消息
 */
export class VerifySiweMessageNode extends LGraphNode {
  static title = 'verifySiweMessage'
  static desc = 'Verify Sign-In with Ethereum message signature'

  color = '#ed8936'
  bgcolor = '#9c4221'

  private isValid: boolean | null = null

  constructor() {
    super()
    this.title = 'verifySiweMessage'
    this.addInput('client', 'publicClient')
    this.addInput('message', 'string')
    this.addInput('signature', 'string')
    this.addInput('domain', 'string')
    this.addInput('nonce', 'string')
    this.addInput('trigger', -1)
    this.addOutput('isValid', 'boolean')
    this.size = [200, 160]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as PublicClient | undefined
      const message = this.getInputData(1) as string | undefined
      const signature = this.getInputData(2) as `0x${string}` | undefined
      const domain = this.getInputData(3) as string | undefined
      const nonce = this.getInputData(4) as string | undefined

      if (!client || !message || !signature) return

      try {
        this.isValid = await client.verifySiweMessage({
          message,
          signature,
          domain,
          nonce
        })
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
