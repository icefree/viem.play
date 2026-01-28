import { LGraphNode } from 'litegraph.js'
import { type PublicClient } from 'viem'

/**
 * createPendingTransactionFilter 节点 - 创建待处理交易过滤器
 */
export class CreatePendingTransactionFilterNode extends LGraphNode {
  static title = 'createPendingTransactionFilter'
  static desc = 'Create filter for pending transactions'

  color = '#6b46c1'
  bgcolor = '#44337a'

  private filter: any = null

  constructor() {
    super()
    this.title = 'createPendingTxFilter'
    this.addInput('client', 'publicClient')
    this.addInput('trigger', -1)
    this.addOutput('filter', 'object')
    this.size = [200, 60]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as PublicClient | undefined

      if (!client) return

      try {
        this.filter = await client.createPendingTransactionFilter()
      } catch (err) {
        console.error(err)
        this.filter = null
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.filter)
  }
}
