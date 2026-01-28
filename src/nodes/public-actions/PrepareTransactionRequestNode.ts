import { LGraphNode } from 'litegraph.js'
import { type PublicClient, type Address, type Hex } from 'viem'

/**
 * prepareTransactionRequest 节点 - 准备交易请求
 */
export class PrepareTransactionRequestNode extends LGraphNode {
  static title = 'prepareTransactionRequest'
  static desc = 'Prepare transaction request'

  color = '#6b46c1'
  bgcolor = '#44337a'

  private request: any = null

  constructor() {
    super()
    this.title = 'prepareTransactionRequest'
    this.addInput('client', 'publicClient')
    this.addInput('to', 'address')
    this.addInput('value', 'bigint')
    this.addInput('data', 'bytes')
    this.addInput('trigger', -1)
    this.addOutput('request', 'object')
    this.size = [220, 120]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as PublicClient | undefined
      const to = this.getInputData(1) as Address | undefined
      const value = this.getInputData(2) as bigint | undefined
      const data = this.getInputData(3) as Hex | undefined

      if (!client) return

      try {
        // @ts-expect-error - Chain may or may not be required depending on client config
        this.request = await client.prepareTransactionRequest({
          to,
          value,
          data
        })
      } catch (err) {
        console.error(err)
        this.request = null
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.request)
  }
}
