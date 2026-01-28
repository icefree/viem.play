import { LGraphNode } from 'litegraph.js'
import { type PublicClient } from 'viem'

/**
 * getFeeHistory 节点 - 获取费用历史
 */
export class GetFeeHistoryNode extends LGraphNode {
  static title = 'getFeeHistory'
  static desc = 'Get fee history'

  color = '#6b46c1'
  bgcolor = '#44337a'

  private feeHistory: any = null

  constructor() {
    super()
    this.title = 'getFeeHistory'
    this.addInput('client', 'publicClient')
    this.addInput('blockCount', 'number')
    this.addInput('rewardPercentiles', 'array')
    this.addInput('trigger', -1)
    this.addOutput('feeHistory', 'object')
    this.size = [180, 100]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as PublicClient | undefined
      const blockCount = this.getInputData(1) as number || 4
      const rewardPercentiles = this.getInputData(2) as number[] || [25, 50, 75]

      if (!client) return

      try {
        this.feeHistory = await client.getFeeHistory({
          blockCount,
          rewardPercentiles
        })
      } catch (err) {
        console.error(err)
        this.feeHistory = null
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.feeHistory)
  }
}
