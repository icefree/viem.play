import { LGraphNode } from 'litegraph.js'
import { type Address } from 'viem'
import { createSiweMessage } from 'viem/siwe'

/**
 * createSiweMessage 节点 - 创建 SIWE 消息
 */
export class CreateSiweMessageNode extends LGraphNode {
  static title = 'createSiweMessage'
  static desc = 'Create Sign-In with Ethereum message'

  color = '#ed8936'
  bgcolor = '#9c4221'

  private message: string | null = null

  constructor() {
    super()
    this.title = 'createSiweMessage'
    this.addInput('address', 'address')
    this.addInput('domain', 'string')
    this.addInput('uri', 'string')
    this.addInput('nonce', 'string')
    this.addInput('chainId', 'number')
    this.addInput('trigger', -1)
    this.addOutput('message', 'string')
    this.size = [200, 150]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const address = this.getInputData(0) as Address | undefined
      const domain = this.getInputData(1) as string | undefined
      const uri = this.getInputData(2) as string | undefined
      const nonce = this.getInputData(3) as string | undefined
      const chainId = this.getInputData(4) as number | undefined

      if (!address || !domain || !uri || !nonce) return

      try {
        this.message = createSiweMessage({
          address,
          domain,
          uri,
          nonce,
          version: '1',
          chainId: chainId || 1
        })
      } catch (err) {
        console.error(err)
        this.message = null
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.message)
  }
}
