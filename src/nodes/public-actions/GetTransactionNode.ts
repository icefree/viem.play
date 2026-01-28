import { LGraphNode } from 'litegraph.js'
import { type PublicClient, type Hash } from 'viem'

/**
 * getTransaction 节点 - 获取交易信息
 */
export class GetTransactionNode extends LGraphNode {
  static title = 'getTransaction'
  static desc = 'Get transaction information'

  color = '#6b46c1'
  bgcolor = '#44337a'

  private transaction: any = null

  constructor() {
    super()
    this.title = 'getTransaction'
    this.addInput('client', 'publicClient')
    this.addInput('hash', 'string')
    this.addInput('trigger', -1)
    this.addOutput('transaction', 'object')
    this.addOutput('from', 'address')
    this.addOutput('to', 'address')
    this.addOutput('value', 'bigint')
    this.size = [180, 110]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as PublicClient | undefined
      const hash = this.getInputData(1) as Hash | undefined

      if (!client || !hash) return

      try {
        this.transaction = await client.getTransaction({ hash })
      } catch (err) {
        console.error(err)
        this.transaction = null
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.transaction)
    this.setOutputData(1, this.transaction?.from ?? null)
    this.setOutputData(2, this.transaction?.to ?? null)
    this.setOutputData(3, this.transaction?.value ?? null)
  }
}
