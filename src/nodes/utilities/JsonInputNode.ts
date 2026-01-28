import { LGraphNode } from 'litegraph.js'

/**
 * JSON 输入节点 - 大型代码编辑器风格
 */
export class JsonInputNode extends LGraphNode {
  static title = 'JSON'
  static desc = 'Input JSON with code editor'

  color = '#4361ee'
  bgcolor = '#2d3748'

  private isValid: boolean = true
  private lines: string[] = ['[]']

  constructor() {
    super()
    this.title = 'JSON'
    this.addOutput('json', 'array')
    this.addProperty('value', '[]', 'string')
    this.size = [320, 280]
    
    // 设置为可调整大小
    this.resizable = true
  }

  private validateJson(value: string) {
    try {
      JSON.parse(value)
      this.isValid = true
    } catch {
      this.isValid = false
    }
  }

  onExecute() {
    try {
      const parsed = JSON.parse(this.properties.value as string)
      this.setOutputData(0, parsed)
      this.isValid = true
    } catch {
      this.setOutputData(0, this.properties.value)
      this.isValid = false
    }
    this.lines = (this.properties.value as string).split('\n')
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) return

    const padding = 8
    const lineHeight = 16
    const gutterWidth = 30
    const startY = 10

    // 绘制行号区域背景
    ctx.fillStyle = '#1e1e1e'
    ctx.fillRect(padding, startY, gutterWidth, this.size[1] - startY - padding)

    // 绘制代码区域背景
    ctx.fillStyle = '#252526'
    ctx.fillRect(padding + gutterWidth, startY, this.size[0] - padding * 2 - gutterWidth, this.size[1] - startY - padding)

    // 绘制边框
    ctx.strokeStyle = this.isValid ? '#4361ee' : '#e53e3e'
    ctx.lineWidth = 2
    ctx.strokeRect(padding, startY, this.size[0] - padding * 2, this.size[1] - startY - padding)

    // 设置字体
    ctx.font = '12px monospace'
    ctx.textBaseline = 'top'

    // 计算可显示的行数
    const maxVisibleLines = Math.floor((this.size[1] - startY - padding * 2) / lineHeight)

    // 绘制行号和代码
    for (let i = 0; i < Math.min(this.lines.length, maxVisibleLines); i++) {
      const y = startY + padding + i * lineHeight

      // 行号
      ctx.fillStyle = '#858585'
      ctx.textAlign = 'right'
      ctx.fillText(String(i + 1), padding + gutterWidth - 6, y)

      // 代码内容
      ctx.fillStyle = '#d4d4d4'
      ctx.textAlign = 'left'
      const line = this.lines[i] || ''
      const maxChars = Math.floor((this.size[0] - gutterWidth - padding * 3) / 7)
      const displayLine = line.length > maxChars ? line.slice(0, maxChars - 3) + '...' : line
      ctx.fillText(displayLine, padding + gutterWidth + 6, y)
    }

    // 如果有更多行
    if (this.lines.length > maxVisibleLines) {
      ctx.fillStyle = '#858585'
      ctx.textAlign = 'left'
      ctx.fillText(`... (${this.lines.length - maxVisibleLines} more lines)`, padding + gutterWidth + 6, startY + padding + maxVisibleLines * lineHeight)
    }

    // 显示验证状态
    ctx.fillStyle = this.isValid ? '#48bb78' : '#fc8181'
    ctx.font = '10px Arial'
    ctx.textAlign = 'right'
    ctx.fillText(this.isValid ? '✓ Valid JSON' : '✗ Invalid JSON', this.size[0] - padding, this.size[1] - 4)
  }

  // 双击打开编辑器
  onDblClick() {
    const currentValue = this.properties.value as string
    const newValue = prompt('Edit JSON:', currentValue)
    if (newValue !== null) {
      this.properties.value = newValue
      this.validateJson(newValue)
      this.lines = newValue.split('\n')
    }
  }

  onPropertyChanged(name: string, value: unknown) {
    if (name === 'value') {
      this.validateJson(value as string)
      this.lines = (value as string).split('\n')
    }
  }
}
