import { LGraphNode } from 'litegraph.js'

/**
 * Base Placeholder Node for missing actions
 */
export class ContractPlaceholderNode extends LGraphNode {
  constructor(title: string, desc: string) {
    super()
    this.title = title
    this.addInput('client', 'publicClient')
    this.properties = { description: desc }
    this.color = '#3182ce'
    this.bgcolor = '#2a4365'
    this.size = [180, 40]
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) return
    ctx.font = '10px Arial'
    ctx.fillStyle = '#999'
    ctx.fillText('Placeholder', 10, 30)
  }
}
