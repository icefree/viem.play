import { LGraphNode, type IWidget } from 'litegraph.js'

/**
 * JSON 输入节点 - 内嵌代码编辑器风格
 */
export class JsonInputNode extends LGraphNode {
  static title = 'JSON'
  static desc = 'Input JSON with inline editor'

  color = '#4361ee'
  bgcolor = '#2d3748'

  private isValid: boolean = true
  private textarea: HTMLTextAreaElement | null = null
  private textWidget: IWidget | null = null

  constructor() {
    super()
    this.title = 'JSON'
    this.addOutput('json', 'array')
    this.addProperty('value', '[\n  { "eth_accounts": {} }\n]', 'string')
    this.size = [320, 200]
    
    // 使用 text widget 并设置为多行
    this.textWidget = this.addWidget(
      'text',
      '',  // 不显示标签
      this.properties.value,
      (v: string) => {
        this.properties.value = v
        this.validateJson(v)
      },
      { multiline: true }
    )

    // 设置为可调整大小
    this.resizable = true
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
    try {
      const parsed = JSON.parse(this.properties.value as string)
      this.setOutputData(0, parsed)
      this.isValid = true
    } catch {
      this.setOutputData(0, this.properties.value)
      this.isValid = false
    }
  }

  // 当节点被添加到画布时创建 textarea
  onAdded() {
    this.createTextarea()
  }

  // 当节点被选中时显示 textarea
  onSelected() {
    if (this.textarea) {
      this.textarea.style.display = 'block'
      this.updateTextareaPosition()
    }
  }

  // 当节点取消选中时隐藏 textarea
  onDeselected() {
    if (this.textarea) {
      this.textarea.style.display = 'none'
    }
  }

  private createTextarea() {
    if (this.textarea) return

    const canvas = document.querySelector('canvas')
    if (!canvas) return

    this.textarea = document.createElement('textarea')
    this.textarea.style.cssText = `
      position: absolute;
      font-family: monospace;
      font-size: 12px;
      background: #1e1e1e;
      color: #d4d4d4;
      border: 2px solid #4361ee;
      border-radius: 4px;
      padding: 8px;
      resize: none;
      outline: none;
      display: none;
      z-index: 1000;
      white-space: pre;
      overflow: auto;
    `
    this.textarea.value = this.properties.value as string
    this.textarea.spellcheck = false

    this.textarea.addEventListener('input', () => {
      if (this.textarea) {
        this.properties.value = this.textarea.value
        this.validateJson(this.textarea.value)
        if (this.textWidget) {
          this.textWidget.value = this.textarea.value
        }
      }
    })

    this.textarea.addEventListener('blur', () => {
      if (this.textarea) {
        this.textarea.style.display = 'none'
      }
    })

    canvas.parentElement?.appendChild(this.textarea)
  }

  private updateTextareaPosition() {
    if (!this.textarea || !this.graph) return

    const canvas = this.graph.list_of_graphcanvas?.[0]
    if (!canvas) return

    const transform = canvas.ds
    if (!transform) return

    const x = (this.pos[0] + 10) * transform.scale + transform.offset[0]
    const y = (this.pos[1] + 30) * transform.scale + transform.offset[1]
    const width = (this.size[0] - 20) * transform.scale
    const height = (this.size[1] - 50) * transform.scale

    this.textarea.style.left = x + 'px'
    this.textarea.style.top = y + 'px'
    this.textarea.style.width = width + 'px'
    this.textarea.style.height = height + 'px'
    this.textarea.style.fontSize = (12 * transform.scale) + 'px'
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) return

    // 更新 textarea 位置（如果正在显示）
    if (this.textarea && this.textarea.style.display !== 'none') {
      this.updateTextareaPosition()
    }

    const padding = 10
    const startY = 10

    // 绘制编辑区域背景
    ctx.fillStyle = '#1e1e1e'
    ctx.fillRect(padding, startY, this.size[0] - padding * 2, this.size[1] - startY - padding - 16)

    // 绘制边框
    ctx.strokeStyle = this.isValid ? '#4361ee' : '#e53e3e'
    ctx.lineWidth = 2
    ctx.strokeRect(padding, startY, this.size[0] - padding * 2, this.size[1] - startY - padding - 16)

    // 绘制代码内容预览
    ctx.font = '11px monospace'
    ctx.textBaseline = 'top'
    ctx.fillStyle = '#d4d4d4'
    ctx.textAlign = 'left'

    const lines = (this.properties.value as string).split('\n')
    const lineHeight = 14
    const maxLines = Math.floor((this.size[1] - startY - padding * 2 - 20) / lineHeight)
    const maxChars = Math.floor((this.size[0] - padding * 2 - 10) / 7)

    for (let i = 0; i < Math.min(lines.length, maxLines); i++) {
      const line = lines[i] || ''
      const displayLine = line.length > maxChars ? line.slice(0, maxChars - 3) + '...' : line
      ctx.fillText(displayLine, padding + 6, startY + 6 + i * lineHeight)
    }

    // 显示验证状态
    ctx.fillStyle = this.isValid ? '#48bb78' : '#fc8181'
    ctx.font = '10px Arial'
    ctx.textAlign = 'right'
    ctx.fillText(this.isValid ? '✓ Valid' : '✗ Invalid', this.size[0] - padding, this.size[1] - 4)

    // 提示双击编辑
    ctx.fillStyle = '#666'
    ctx.textAlign = 'left'
    ctx.fillText('Double-click to edit', padding, this.size[1] - 4)
  }

  onDblClick() {
    if (this.textarea) {
      this.textarea.style.display = 'block'
      this.textarea.value = this.properties.value as string
      this.updateTextareaPosition()
      this.textarea.focus()
    }
  }

  onPropertyChanged(name: string, value: unknown) {
    if (name === 'value') {
      this.validateJson(value as string)
      if (this.textarea) {
        this.textarea.value = value as string
      }
    }
  }

  onRemoved() {
    if (this.textarea && this.textarea.parentElement) {
      this.textarea.parentElement.removeChild(this.textarea)
    }
  }
}
