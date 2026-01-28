import { LGraphNode } from 'litegraph.js'
import { type PublicClient, type Address, type Hex } from 'viem'

/**
 * estimateGas 节点 - 估算交易 gas
 */
export class EstimateGasNode extends LGraphNode {
  static title = 'estimateGas'
  static desc = 'Estimate gas for a transaction'

  color = '#6b46c1'
  bgcolor = '#44337a'

  private gasEstimate: bigint | null = null

  constructor() {
    super()
    this.title = 'estimateGas'
    this.addInput('client', 'publicClient')
    this.addInput('to', 'address')
    this.addInput('data', 'bytes')
    this.addInput('value', 'bigint')
    this.addInput('trigger', -1)
    this.addOutput('gas', 'bigint')
    this.size = [180, 120]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as PublicClient | undefined
      const to = this.getInputData(1) as Address | undefined
      const data = this.getInputData(2) as Hex | undefined
      const value = this.getInputData(3) as bigint | undefined

      if (!client) return

      try {
        this.gasEstimate = await client.estimateGas({
          ...(to && { to }),
          ...(data && { data }),
          ...(value && { value })
        })
      } catch (err) {
        console.error(err)
        this.gasEstimate = null
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.gasEstimate)
  }
}
