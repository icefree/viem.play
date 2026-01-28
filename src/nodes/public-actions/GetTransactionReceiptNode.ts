import { LGraphNode } from 'litegraph.js'
import { type PublicClient, type Hash } from 'viem'

/**
 * getTransactionReceipt 节点 - 获取交易回执
 */
export class GetTransactionReceiptNode extends LGraphNode {
  static title = 'getTransactionReceipt'
  static desc = 'Get transaction receipt'

  color = '#6b46c1'
  bgcolor = '#44337a'

  private receipt: any = null

  constructor() {
    super()
    this.title = 'getTransactionReceipt'
    this.addInput('client', 'publicClient')
    this.addInput('hash', 'string')
    this.addInput('trigger', -1)
    this.addOutput('receipt', 'object')
    this.addOutput('status', 'string')
    this.addOutput('gasUsed', 'bigint')
    this.size = [200, 100]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as PublicClient | undefined
      const hash = this.getInputData(1) as Hash | undefined

      if (!client || !hash) return

      try {
        this.receipt = await client.getTransactionReceipt({ hash })
      } catch (err) {
        console.error(err)
        this.receipt = null
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.receipt)
    this.setOutputData(1, this.receipt?.status ?? null)
    this.setOutputData(2, this.receipt?.gasUsed ?? null)
  }
}
