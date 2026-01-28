import { LGraphNode } from 'litegraph.js'
import { type PublicClient, type Address } from 'viem'

/**
 * watchEvent 节点 - 监听事件
 */
export class WatchEventNode extends LGraphNode {
  static title = 'watchEvent'
  static desc = 'Watch for events'

  color = '#6b46c1'
  bgcolor = '#44337a'

  private unwatch: (() => void) | null = null
  private latestLogs: any[] = []

  constructor() {
    super()
    this.title = 'watchEvent'
    this.addInput('client', 'publicClient')
    this.addInput('address', 'address')
    this.addInput('trigger', -1)
    this.addOutput('logs', 'array')
    this.size = [160, 80]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      // 如果已有监听，先停止
      if (this.unwatch) {
        this.unwatch()
        this.unwatch = null
      }

      const client = this.getInputData(0) as PublicClient | undefined
      const address = this.getInputData(1) as Address | undefined

      if (!client) return

      try {
        this.unwatch = client.watchEvent({
          ...(address && { address }),
          onLogs: (logs) => {
            this.latestLogs = logs
          }
        })
      } catch (err) {
        console.error(err)
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.latestLogs)
  }

  onRemoved() {
    if (this.unwatch) {
      this.unwatch()
      this.unwatch = null
    }
  }
}
