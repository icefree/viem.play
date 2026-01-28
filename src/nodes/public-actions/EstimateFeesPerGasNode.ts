import { LGraphNode } from 'litegraph.js'
import { type PublicClient } from 'viem'

/**
 * estimateFeesPerGas 节点 - 估算每 gas 费用
 */
export class EstimateFeesPerGasNode extends LGraphNode {
  static title = 'estimateFeesPerGas'
  static desc = 'Estimate fees per gas'

  color = '#6b46c1'
  bgcolor = '#44337a'

  private fees: { maxFeePerGas: bigint; maxPriorityFeePerGas: bigint } | null = null

  constructor() {
    super()
    this.title = 'estimateFeesPerGas'
    this.addInput('client', 'publicClient')
    this.addInput('trigger', -1)
    this.addOutput('maxFeePerGas', 'bigint')
    this.addOutput('maxPriorityFeePerGas', 'bigint')
    this.size = [200, 70]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as PublicClient | undefined

      if (!client) return

      try {
        this.fees = await client.estimateFeesPerGas()
      } catch (err) {
        console.error(err)
        this.fees = null
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.fees?.maxFeePerGas ?? null)
    this.setOutputData(1, this.fees?.maxPriorityFeePerGas ?? null)
  }
}
