import { LGraphNode } from 'litegraph.js'
import { type PublicClient } from 'viem'

/**
 * estimateMaxPriorityFeePerGas 节点 - 估算最大优先费
 */
export class EstimateMaxPriorityFeePerGasNode extends LGraphNode {
  static title = 'estimateMaxPriorityFeePerGas'
  static desc = 'Estimate max priority fee per gas'

  color = '#6b46c1'
  bgcolor = '#44337a'

  private maxPriorityFee: bigint | null = null

  constructor() {
    super()
    this.title = 'estimateMaxPriorityFee'
    this.addInput('client', 'publicClient')
    this.addInput('trigger', -1)
    this.addOutput('maxPriorityFee', 'bigint')
    this.size = [200, 60]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as PublicClient | undefined

      if (!client) return

      try {
        this.maxPriorityFee = await client.estimateMaxPriorityFeePerGas()
      } catch (err) {
        console.error(err)
        this.maxPriorityFee = null
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.maxPriorityFee)
  }
}
