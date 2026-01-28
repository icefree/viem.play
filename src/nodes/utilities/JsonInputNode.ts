import { LGraphNode, IWidget } from 'litegraph.js'

/**
 * JSON 输入节点 - 使用多行文本输入
 */
export class JsonInputNode extends LGraphNode {
  static title = 'JSON'
  static desc = 'Input JSON object or string'

  color = '#4a5568'
  bgcolor = '#2d3748'

  private textareaWidget: IWidget | null = null
  private isValid: boolean = true

  constructor() {
    super()
    this.title = 'JSON'
    this.addOutput('json', 'object')
    this.addProperty('value', '{}', 'string')
    this.size = [280, 140]

    // 使用 textarea widget
    this.textareaWidget = this.addWidget(
      'text',
      'JSON',
      this.properties.value,
      (v: string) => {
        this.properties.value = v
        this.validateJson(v)
      },
      { multiline: true }
    )
  }

  private validateJson(value: string) {
    try {
      JSON.parse(value)
      this.isValid = true
      this.boxcolor = undefined // 恢复默认边框颜色
    } catch {
      this.isValid = false
      this.boxcolor = '#e53e3e' // 红色边框表示无效 JSON
    }
  }

  onExecute() {
    try {
      const parsed = JSON.parse(this.properties.value)
      this.setOutputData(0, parsed)
      this.isValid = true
    } catch {
      // 如果解析失败，输出原始字符串
      this.setOutputData(0, this.properties.value)
      this.isValid = false
    }
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) return

    // 显示验证状态
    ctx.fillStyle = this.isValid ? '#48bb78' : '#fc8181'
    ctx.font = '10px Arial'
    ctx.textAlign = 'right'
    ctx.fillText(this.isValid ? '✓ Valid' : '✗ Invalid', this.size[0] - 10, 20)
  }

  // 支持从属性面板编辑
  onPropertyChanged(name: string, value: unknown) {
    if (name === 'value' && this.textareaWidget) {
      this.textareaWidget.value = value as string
      this.validateJson(value as string)
    }
  }
}
