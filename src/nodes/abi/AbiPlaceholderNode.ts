import { LGraphNode } from 'litegraph.js'

/**
 * Base Placeholder Node for missing actions
 */
export class AbiPlaceholderNode extends LGraphNode {
  constructor(title: string, desc: string) {
    super()
    this.title = title
    this.properties = { description: desc }
    this.color = '#e53e3e'
    this.bgcolor = '#742a2a'
    this.size = [180, 40]
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) return
    ctx.font = '10px Arial'
    ctx.fillStyle = '#666'
    ctx.fillText('Placeholder', 10, 30)
  }
}
