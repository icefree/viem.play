import { LGraphNode } from 'litegraph.js'
import { type PublicClient, type WatchBlockNumberReturnType } from 'viem'

/**
 * WatchBlockNumber 节点 - 监听区块号变化
 */
export class WatchBlockNumberNode extends LGraphNode {
  static title = 'watchBlockNumber'
  static desc = 'Watch for new block numbers'

  color = '#6b46c1'
  bgcolor = '#44337a'

  private blockNumber: bigint | null = null
  private unwatch: WatchBlockNumberReturnType | null = null
  private isWatching = false

  constructor() {
    super()
    this.title = 'watchBlockNumber'
    this.addInput('client', 'publicClient')
    this.addInput('trigger', -1)
    this.addOutput('blockNumber', 'bigint')
    this.addOutput('onBlockNumber', -1)
    this.size = [180, 80]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      if (this.isWatching) {
        this.stopWatching()
      } else {
        this.startWatching()
      }
    }
  }

  startWatching() {
    const client = this.getInputData(0) as PublicClient | undefined

    if (!client || this.isWatching) {
      return
    }

    this.isWatching = true
    try {
      this.unwatch = client.watchBlockNumber({
        onBlockNumber: (blockNumber) => {
          this.blockNumber = blockNumber
          this.setOutputData(0, blockNumber)
          // 触发输出事件
          this.triggerSlot(1, blockNumber)
        },
        onError: (error) => {
          console.error('WatchBlockNumber error:', error)
        },
      })
    } catch (e) {
      console.error('WatchBlockNumber setup error:', e)
      this.isWatching = false
    }
  }

  stopWatching() {
    if (this.unwatch) {
      this.unwatch()
      this.unwatch = null
    }
    this.isWatching = false
  }

  onExecute() {
    this.setOutputData(0, this.blockNumber)
  }

  onRemoved() {
    this.stopWatching()
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) return

    ctx.font = '10px Arial'

    // 显示监听状态
    if (this.isWatching) {
      ctx.fillStyle = '#48bb78'
      ctx.fillText('● Watching', 10, 55)
    } else {
      ctx.fillStyle = '#a0aec0'
      ctx.fillText('○ Stopped', 10, 55)
    }

    // 显示当前区块号
    ctx.fillStyle = '#e2e8f0'
    if (this.blockNumber !== null) {
      ctx.fillText(`#${this.blockNumber.toString()}`, 90, 55)
    }
  }

  getIsWatching() {
    return this.isWatching
  }

  getBlockNumber() {
    return this.blockNumber
  }
}
