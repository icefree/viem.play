import { LGraphNode } from 'litegraph.js'
import { type PublicClient } from 'viem'

/**
 * uninstallFilter 节点 - 卸载过滤器
 */
export class UninstallFilterNode extends LGraphNode {
  static title = 'uninstallFilter'
  static desc = 'Uninstall a filter'

  color = '#6b46c1'
  bgcolor = '#44337a'

  constructor() {
    super()
    this.title = 'uninstallFilter'
    this.addInput('client', 'publicClient')
    this.addInput('filter', 'object')
    this.addInput('trigger', -1)
    this.addOutput('success', 'boolean')
    this.size = [180, 80]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as PublicClient | undefined
      const filter = this.getInputData(1) as any

      if (!client || !filter) return

      try {
        const success = await client.uninstallFilter({ filter })
        this.setOutputData(0, success)
      } catch (err) {
        console.error(err)
        this.setOutputData(0, false)
      }
    }
  }
}
