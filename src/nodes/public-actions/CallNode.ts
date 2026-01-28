import { LGraphNode } from 'litegraph.js'
import { type PublicClient, type Address, type Hex } from 'viem'

/**
 * call 节点 - 执行消息调用
 */
export class CallNode extends LGraphNode {
  static title = 'call'
  static desc = 'Executes a new message call'

  color = '#6b46c1'
  bgcolor = '#44337a'

  private result: Hex | null = null

  constructor() {
    super()
    this.title = 'call'
    this.addInput('client', 'publicClient')
    this.addInput('to', 'address')
    this.addInput('data', 'bytes')
    this.addInput('value', 'bigint')
    this.addInput('trigger', -1)
    this.addOutput('data', 'bytes')
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
        const result = await client.call({
          ...(to && { to }),
          ...(data && { data }),
          ...(value && { value })
        })
        this.result = result.data || null
      } catch (err) {
        console.error(err)
        this.result = null
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.result)
  }
}
