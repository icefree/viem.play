import { LGraphNode } from 'litegraph.js'
import { type PublicClient, type Block, type WatchBlocksReturnType } from 'viem'

/**
 * WatchBlocks 节点 - 监听新区块
 */
export class WatchBlocksNode extends LGraphNode {
  static title = 'watchBlocks'
  static desc = 'Watch for new blocks'

  color = '#6b46c1'
  bgcolor = '#44337a'

  private block: Block | null = null
  private unwatch: WatchBlocksReturnType | null = null
  private isWatching = false

  constructor() {
    super()
    this.title = 'watchBlocks'
    this.addInput('trigger', -1)
    this.addInput('client', 'publicClient')
    this.addOutput('block', 'object')
    this.addOutput('blockNumber', 'bigint')
    this.addOutput('onBlock', -1)
    this.size = [180, 90]
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
    const client = this.getInputData(1) as PublicClient | undefined

    if (!client || this.isWatching) {
      return
    }

    this.isWatching = true
    try {
      this.unwatch = client.watchBlocks({
        onBlock: (block) => {
          this.block = block
          this.setOutputData(0, block)
          this.setOutputData(1, block.number)
          // 触发输出事件
          this.triggerSlot(2, block)
        },
        onError: (error) => {
          console.error('WatchBlocks error:', error)
        },
      })
    } catch (e) {
      console.error('WatchBlocks setup error:', e)
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
    if (this.block) {
      this.setOutputData(0, this.block)
      this.setOutputData(1, this.block.number)
    }
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
      ctx.fillText('● Watching', 10, 65)
    } else {
      ctx.fillStyle = '#a0aec0'
      ctx.fillText('○ Stopped', 10, 65)
    }

    // 显示当前区块号
    ctx.fillStyle = '#e2e8f0'
    if (this.block !== null) {
      ctx.fillText(`#${this.block.number?.toString() ?? 'N/A'}`, 90, 65)
    }
  }

  getIsWatching() {
    return this.isWatching
  }

  getBlock() {
    return this.block
  }
}
