import { LGraphNode } from 'litegraph.js'
import { type PublicClient } from 'viem'

/**
 * getFilterLogs 节点 - 获取过滤器日志
 */
export class GetFilterLogsNode extends LGraphNode {
  static title = 'getFilterLogs'
  static desc = 'Get logs matching a filter'

  color = '#6b46c1'
  bgcolor = '#44337a'

  private logs: any[] | null = null

  constructor() {
    super()
    this.title = 'getFilterLogs'
    this.addInput('client', 'publicClient')
    this.addInput('filter', 'object')
    this.addInput('trigger', -1)
    this.addOutput('logs', 'array')
    this.size = [180, 80]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as PublicClient | undefined
      const filter = this.getInputData(1) as any

      if (!client || !filter) return

      try {
        this.logs = await client.getFilterLogs({ filter })
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
