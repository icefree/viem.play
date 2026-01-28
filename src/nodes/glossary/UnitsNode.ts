import { LGraphNode } from 'litegraph.js'

/**
 * Units 节点 - 单位参考
 */
export class UnitsNode extends LGraphNode {
  static title = 'Units'
  static desc = 'Ethereum unit reference'

  color = '#718096'
  bgcolor = '#4a5568'

  constructor() {
    super()
    this.addOutput('info', 'string')
    this.size = [180, 100]
  }

  onExecute() {
    this.setOutputData(0, '1 ETH = 10^18 Wei = 10^9 Gwei')
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) return

    ctx.fillStyle = '#a0aec0'
    ctx.font = '11px monospace'
    ctx.fillText('1 ETH  = 10^18 Wei', 10, 35)
    ctx.fillText('1 Gwei = 10^9  Wei', 10, 50)
    ctx.fillText('1 ETH  = 10^9  Gwei', 10, 65)
  }
}
