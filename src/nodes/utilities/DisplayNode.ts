import { LGraphNode } from 'litegraph.js'

/**
 * 显示节点 - 显示任何输入数据
 */
export class DisplayNode extends LGraphNode {
  static title = 'Display'
  static desc = 'Display any value'
  
  color = '#4a5568'
  bgcolor = '#2d3748'

  public displayValue: string = ''

  constructor() {
    super()
    this.title = 'Display'
    this.addInput('value', '') 
    this.size = [200, 80]
  }

  onExecute() {
    const value = this.getInputData(0)
    if (value === undefined || value === null) {
      this.displayValue = 'null'
    } else if (typeof value === 'bigint') {
      this.displayValue = value.toString()
    } else if (typeof value === 'object') {
      try {
        this.displayValue = JSON.stringify(value, (_, v) => typeof v === 'bigint' ? v.toString() + 'n' : v, 2)
      } catch {
        this.displayValue = String(value)
      }
    } else {
      this.displayValue = String(value)
    }
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) return

    ctx.fillStyle = '#e2e8f0'
    ctx.font = '12px monospace'
    
    const lines = this.displayValue.split('\n').slice(0, 3)
    lines.forEach((line, i) => {
      const truncated = line.length > 25 ? line.slice(0, 22) + '...' : line
      ctx.fillText(truncated, 10, 35 + i * 14)
    })
  }
}
