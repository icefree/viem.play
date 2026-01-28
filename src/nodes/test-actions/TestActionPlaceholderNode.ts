import { LGraphNode } from 'litegraph.js'

/**
 * Base Placeholder Node for missing actions
 */
export class TestActionPlaceholderNode extends LGraphNode {
  constructor(title: string, desc: string) {
    super()
    this.title = title
    this.addInput('client', 'testClient')
    this.properties = { description: desc }
    this.color = '#805ad5'
    this.bgcolor = '#553c9a'
    this.size = [180, 40]
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) return
    ctx.font = '10px Arial'
    ctx.fillStyle = '#999'
    ctx.fillText('Placeholder', 10, 30)
  }
}
