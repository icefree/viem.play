import { LGraphNode } from 'litegraph.js'

/**
 * ChainIds 节点 - 常用链 ID 参考
 */
export class ChainIdsNode extends LGraphNode {
  static title = 'Common Chain IDs'
  static desc = 'Reference for common chain IDs'

  color = '#718096'
  bgcolor = '#4a5568'

  constructor() {
    super()
    this.size = [180, 140]
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) return

    ctx.fillStyle = '#a0aec0'
    ctx.font = '11px monospace'
    
    const chains = [
      ['Mainnet', '1'],
      ['Sepolia', '11155111'],
      ['Polygon', '137'],
      ['Arbitrum', '42161'],
      ['Optimism', '10'],
      ['Base', '8453'],
      ['Anvil', '31337'],
    ]

    chains.forEach(([name, id], i) => {
      ctx.fillText(`${name}: ${id}`, 10, 35 + i * 14)
    })
  }
}
