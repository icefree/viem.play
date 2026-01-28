import { LGraphNode } from 'litegraph.js'
import { type TestClient, type Address, type Hex, type Hash } from 'viem'

/**
 * sendUnsignedTransaction 节点 - 发送无签名交易
 */
export class SendUnsignedTransactionNode extends LGraphNode {
  static title = 'sendUnsignedTransaction'
  static desc = 'Send transaction without signature'

  color = '#805ad5'
  bgcolor = '#553c9a'

  private hash: Hash | null = null

  constructor() {
    super()
    this.title = 'sendUnsignedTransaction'
    this.addInput('client', 'testClient')
    this.addInput('from', 'address')
    this.addInput('to', 'address')
    this.addInput('value', 'bigint')
    this.addInput('data', 'bytes')
    this.addInput('trigger', -1)
    this.addOutput('hash', 'string')
    this.size = [200, 140]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as TestClient | undefined
      const from = this.getInputData(1) as Address | undefined
      const to = this.getInputData(2) as Address | undefined
      const value = this.getInputData(3) as bigint | undefined
      const data = this.getInputData(4) as Hex | undefined

      if (!client || !from) return

      try {
        this.hash = await client.sendUnsignedTransaction({
          from,
          ...(to && { to }),
          ...(value && { value }),
          ...(data && { data })
        })
      } catch (err) {
        console.error(err)
        this.hash = null
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.hash)
  }
}
