import { LGraphNode } from 'litegraph.js'

/**
 * Base Placeholder Node for missing actions
 */
export class ClientPlaceholderNode extends LGraphNode {
  constructor(title: string, desc: string, color: string, bgcolor: string) {
    super()
    this.title = title
    this.addInput('chain', 'chain')
    this.addOutput('client', 'publicClient')
    this.properties = { description: desc }
    this.color = color
    this.bgcolor = bgcolor
    this.size = [180, 40]
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) return
    ctx.font = '10px Arial'
    ctx.fillStyle = '#666'
    ctx.fillText('Placeholder', 10, 30)
  }
}
