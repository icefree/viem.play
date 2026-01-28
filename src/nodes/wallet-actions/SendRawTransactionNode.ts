import { LGraphNode } from 'litegraph.js'
import { type WalletClient, type Hex, type Hash } from 'viem'

/**
 * sendRawTransaction 节点 - 发送原始交易
 */
export class SendRawTransactionNode extends LGraphNode {
  static title = 'sendRawTransaction'
  static desc = 'Send a raw transaction'

  color = '#c53030'
  bgcolor = '#742a2a'

  private hash: Hash | null = null

  constructor() {
    super()
    this.title = 'sendRawTransaction'
    this.addInput('client', 'walletClient')
    this.addInput('serializedTransaction', 'bytes')
    this.addInput('trigger', -1)
    this.addOutput('hash', 'string')
    this.size = [200, 80]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as WalletClient | undefined
      const serializedTransaction = this.getInputData(1) as Hex | undefined

      if (!client || !serializedTransaction) return

      try {
        this.hash = await client.sendRawTransaction({ serializedTransaction })
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
