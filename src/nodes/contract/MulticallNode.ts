import { LGraphNode } from 'litegraph.js'
import { type PublicClient, type Address, type Abi } from 'viem'

/**
 * multicall 节点 - 执行多个合约调用
 */
export class MulticallNode extends LGraphNode {
  static title = 'multicall'
  static desc = 'Execute multiple calls'

  color = '#3182ce'
  bgcolor = '#2a4365'

  private results: any[] | null = null

  constructor() {
    super()
    this.title = 'multicall'
    this.addInput('client', 'publicClient')
    this.addInput('contracts', 'array')
    this.addInput('trigger', -1)
    this.addOutput('results', 'array')
    this.size = [180, 80]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as PublicClient | undefined
      const contracts = this.getInputData(1) as Array<{
        address: Address
        abi: Abi
        functionName: string
        args?: any[]
      }> | undefined

      if (!client || !contracts) return

      try {
        this.results = await client.multicall({ contracts })
      } catch (err) {
        console.error(err)
        this.results = null
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.results)
  }
}
