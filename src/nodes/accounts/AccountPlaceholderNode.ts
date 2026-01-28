import { LGraphNode } from 'litegraph.js'

/**
 * Base Placeholder Node for missing actions
 */
export class AccountPlaceholderNode extends LGraphNode {
  constructor(title: string, desc: string) {
    super()
    this.title = title
    this.addOutput('account', 'account')
    this.properties = { description: desc }
    this.color = '#d69e2e'
    this.bgcolor = '#975a16'
    this.size = [180, 40]
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) return
    ctx.font = '10px Arial'
    ctx.fillStyle = '#666'
    ctx.fillText('Placeholder', 10, 30)
  }
}
