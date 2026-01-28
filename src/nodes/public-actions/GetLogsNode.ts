import { LGraphNode } from 'litegraph.js'
import { type PublicClient, type Address } from 'viem'

/**
 * getLogs 节点 - 获取历史日志
 */
export class GetLogsNode extends LGraphNode {
  static title = 'getLogs'
  static desc = 'Get historical logs'

  color = '#6b46c1'
  bgcolor = '#44337a'

  private logs: any[] | null = null

  constructor() {
    super()
    this.title = 'getLogs'
    this.addInput('client', 'publicClient')
    this.addInput('address', 'address')
    this.addInput('fromBlock', 'bigint')
    this.addInput('toBlock', 'bigint')
    this.addInput('trigger', -1)
    this.addOutput('logs', 'array')
    this.size = [180, 120]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as PublicClient | undefined
      const address = this.getInputData(1) as Address | undefined
      const fromBlock = this.getInputData(2) as bigint | undefined
      const toBlock = this.getInputData(3) as bigint | undefined

      if (!client) return

      try {
        this.logs = await client.getLogs({
          ...(address && { address }),
          ...(fromBlock && { fromBlock }),
          ...(toBlock && { toBlock })
        })
      } catch (err) {
        console.error(err)
        this.logs = null
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.logs)
  }
}
