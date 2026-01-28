import { LGraphNode } from 'litegraph.js'
import { type PublicClient, type Hash } from 'viem'

/**
 * watchPendingTransactions 节点 - 监听待处理交易
 */
export class WatchPendingTransactionsNode extends LGraphNode {
  static title = 'watchPendingTransactions'
  static desc = 'Watch for pending transactions'

  color = '#6b46c1'
  bgcolor = '#44337a'

  private unwatch: (() => void) | null = null
  private pendingHashes: Hash[] = []

  constructor() {
    super()
    this.title = 'watchPendingTransactions'
    this.addInput('client', 'publicClient')
    this.addInput('trigger', -1)
    this.addOutput('hashes', 'array')
    this.addOutput('latestHash', 'string')
    this.size = [220, 80]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      // 如果已有监听，先停止
      if (this.unwatch) {
        this.unwatch()
        this.unwatch = null
      }

      const client = this.getInputData(0) as PublicClient | undefined

      if (!client) return

      try {
        this.unwatch = client.watchPendingTransactions({
          onTransactions: (hashes) => {
            this.pendingHashes = hashes
          }
        })
      } catch (err) {
        console.error(err)
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.pendingHashes)
    this.setOutputData(1, this.pendingHashes[this.pendingHashes.length - 1] || null)
  }

  onRemoved() {
    if (this.unwatch) {
      this.unwatch()
      this.unwatch = null
    }
  }
}
