import { LGraphNode } from 'litegraph.js'
import { type PublicClient, type Address } from 'viem'

/**
 * createEventFilter 节点 - 创建事件过滤器
 */
export class CreateEventFilterNode extends LGraphNode {
  static title = 'createEventFilter'
  static desc = 'Create filter for events'

  color = '#6b46c1'
  bgcolor = '#44337a'

  private filter: any = null

  constructor() {
    super()
    this.title = 'createEventFilter'
    this.addInput('client', 'publicClient')
    this.addInput('address', 'address')
    this.addInput('trigger', -1)
    this.addOutput('filter', 'object')
    this.size = [180, 80]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as PublicClient | undefined
      const address = this.getInputData(1) as Address | undefined

      if (!client) return

      try {
        this.filter = await client.createEventFilter({
          ...(address && { address })
        })
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
