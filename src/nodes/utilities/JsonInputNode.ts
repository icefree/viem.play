import { LGraphNode } from 'litegraph.js'

/**
 * JSON 输入节点
 * 
 * 输出：
 * - json: 解析后的对象/数组
 * - string: 原始 JSON 字符串（用于需要字符串的场景如 ABI）
 */
export class JsonInputNode extends LGraphNode {
  static title = 'JSON'
  static desc = 'Input JSON object or string'

  color = '#4a5568'
  bgcolor = '#2d3748'

  private isValid: boolean = true

  constructor() {
    super()
    this.title = 'JSON'
    this.addOutput('json', 'object')    // 解析后的对象
    this.addOutput('string', 'string')  // 原始 JSON 字符串
    this.addProperty('value', '[]', 'string')
    this.size = [260, 80]

    this.addWidget('text', 'Value', this.properties.value, (v: string) => {
      this.properties.value = v
      this.validateJson(v)
    })
  }

  private validateJson(value: string) {
    try {
      JSON.parse(value)
      this.isValid = true
      this.boxcolor = '#48bb78'
    } catch {
      this.isValid = false
      this.boxcolor = '#e53e3e'
    }
  }

  onExecute() {
    const value = this.properties.value as string
    
    // 输出原始字符串
    this.setOutputData(1, value)
    
    // 尝试解析为对象
    try {
      this.setOutputData(0, JSON.parse(value))
      this.isValid = true
    } catch {
      this.setOutputData(0, value)
      this.isValid = false
    }
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) return

    ctx.fillStyle = this.isValid ? '#48bb78' : '#fc8181'
    ctx.font = '10px Arial'
    ctx.textAlign = 'right'
    ctx.fillText(this.isValid ? '✓ Valid' : '✗ Invalid', this.size[0] - 10, this.size[1] - 5)
  }
}
