import { LGraphNode } from 'litegraph.js'
import { type Chain } from 'viem'

/**
 * Chain ID 节点 - 输出 chain 的 ID
 */
export class ChainIdNode extends LGraphNode {
  static title = 'Chain ID'
  static desc = 'Get chain ID from chain object'

  color = '#2c5282'
  bgcolor = '#1a365d'

  constructor() {
    super()
    this.title = 'Chain ID'
    this.addInput('chain', 'chain')
    this.addOutput('chainId', 'number')
    this.size = [140, 50]
  }

  onExecute() {
    const chain = this.getInputData(0) as Chain | undefined
    if (chain) {
      this.setOutputData(0, chain.id)
    } else {
      this.setOutputData(0, null)
    }
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) return
    const chain = this.getInputData(0) as Chain | undefined
    if (chain) {
      ctx.fillStyle = '#e2e8f0'
      ctx.font = '12px monospace'
      ctx.fillText(`ID: ${chain.id}`, 10, 35)
    }
  }
}
