import { LGraphNode } from 'litegraph.js'

/**
 * 显示节点 - 显示任何输入数据
 * 
 * 支持原样输出复杂对象，包括嵌套结构、BigInt 等
 */
export class DisplayNode extends LGraphNode {
  static title = 'Display'
  static desc = 'Display any value'
  
  color = '#4a5568'
  bgcolor = '#2d3748'

  public displayValue: string = ''
  public rawValue: unknown = null

  constructor() {
    super()
    this.title = 'Display'
    this.addInput('value', '') 
    this.addOutput('value', '')  // 透传原始值
    this.size = [220, 100]
    
    // 添加属性控制显示行数和是否展开
    this.addProperty('maxLines', 5, 'number')
    this.addProperty('maxCharsPerLine', 30, 'number')
  }

  onExecute() {
    const value = this.getInputData(0)
    this.rawValue = value
    
    // 透传原始值到输出
    this.setOutputData(0, value)
    
    if (value === undefined) {
      this.displayValue = 'undefined'
    } else if (value === null) {
      this.displayValue = 'null'
    } else if (typeof value === 'bigint') {
      this.displayValue = value.toString() + 'n'
    } else if (typeof value === 'function') {
      this.displayValue = '[Function]'
    } else if (typeof value === 'object') {
      try {
        // 处理特殊对象类型
        if (value instanceof Error) {
          this.displayValue = `Error: ${value.message}`
        } else if (Array.isArray(value)) {
          this.displayValue = this.formatArray(value)
        } else if (value.constructor && value.constructor.name !== 'Object') {
          // 带有类名的对象
          this.displayValue = `[${value.constructor.name}] ${this.safeStringify(value)}`
        } else {
          this.displayValue = this.safeStringify(value)
        }
      } catch {
        this.displayValue = String(value)
      }
    } else {
      this.displayValue = String(value)
    }
  }

  private safeStringify(value: unknown): string {
    try {
      return JSON.stringify(
        value, 
        (_, v) => {
          if (typeof v === 'bigint') return v.toString() + 'n'
          if (typeof v === 'function') return '[Function]'
          if (v instanceof Error) return `Error: ${v.message}`
          return v
        }, 
        2
      )
    } catch {
      return String(value)
    }
  }

  private formatArray(arr: unknown[]): string {
    if (arr.length === 0) return '[]'
    if (arr.length <= 3) {
      return this.safeStringify(arr)
    }
    return `[${arr.length} items]\n${this.safeStringify(arr.slice(0, 3))}...`
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) return

    const maxLines = this.properties.maxLines as number || 5
    const maxChars = this.properties.maxCharsPerLine as number || 30

    ctx.fillStyle = '#e2e8f0'
    ctx.font = '11px monospace'
    
    const lines = this.displayValue.split('\n').slice(0, maxLines)
    lines.forEach((line, i) => {
      const truncated = line.length > maxChars ? line.slice(0, maxChars - 3) + '...' : line
      ctx.fillText(truncated, 10, 35 + i * 13)
    })

    // 如果有更多行，显示省略提示
    if (this.displayValue.split('\n').length > maxLines) {
      ctx.fillStyle = '#718096'
      ctx.fillText(`... (${this.displayValue.split('\n').length - maxLines} more lines)`, 10, 35 + maxLines * 13)
    }
  }

  // 双击节点时在控制台输出完整值
  onDblClick() {
    console.log('[Display] Full value:', this.rawValue)
    console.log('[Display] Formatted:\n', this.displayValue)
  }
}
