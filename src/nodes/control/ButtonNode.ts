import { LGraphNode } from 'litegraph.js'

/**
 * Button 节点 - 可点击的按钮，触发事件
 * 移植自 eth.build
 */
export class ButtonNode extends LGraphNode {
  static title = 'Button'
  static desc = 'Clickable button that triggers an event'

  color = '#4a5568'
  bgcolor = '#2d3748'

  constructor() {
    super()
    this.title = 'Button'
    this.addInput('timer', -1)
    this.addOutput('trigger', -1)
    this.addOutput('count', 'number')
    this.addProperty('label', 'CLICK ME')
    this.addProperty('count', 0)
    this.size = [180, 80]
  }

  onAction() {
    // 接收外部 action（如 Timer）时触发
    this.properties.count = (this.properties.count as number) + 1
    this.triggerSlot(0)
  }

  onExecute() {
    this.setOutputData(1, this.properties.count)
  }

  getTitle(): string {
    if (this.flags.collapsed && this.properties.label) {
      return String(this.properties.label)
    }
    return 'Button'
  }

  onMouseDown(_e: MouseEvent, localPos: number[]): boolean {
    // 检测点击是否在蓝色按钮区域
    const btnX = 10
    const btnY = 50
    const btnW = this.size[0] - 20
    const btnH = 24

    if (localPos[0] >= btnX && localPos[0] <= btnX + btnW &&
        localPos[1] >= btnY && localPos[1] <= btnY + btnH) {
      this.properties.count = (this.properties.count as number) + 1
      this.triggerSlot(0)
      return true // 阻止事件继续传播
    }
    return false
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) return

    // 绘制按钮样式的标签
    ctx.save()
    ctx.fillStyle = '#3182ce'
    ctx.strokeStyle = '#2c5282'
    ctx.lineWidth = 2

    const btnX = 10
    const btnY = 50
    const btnW = this.size[0] - 20
    const btnH = 24

    // 绘制圆角矩形按钮
    const radius = 4
    ctx.beginPath()
    ctx.moveTo(btnX + radius, btnY)
    ctx.lineTo(btnX + btnW - radius, btnY)
    ctx.quadraticCurveTo(btnX + btnW, btnY, btnX + btnW, btnY + radius)
    ctx.lineTo(btnX + btnW, btnY + btnH - radius)
    ctx.quadraticCurveTo(btnX + btnW, btnY + btnH, btnX + btnW - radius, btnY + btnH)
    ctx.lineTo(btnX + radius, btnY + btnH)
    ctx.quadraticCurveTo(btnX, btnY + btnH, btnX, btnY + btnH - radius)
    ctx.lineTo(btnX, btnY + radius)
    ctx.quadraticCurveTo(btnX, btnY, btnX + radius, btnY)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // 绘制标签文字
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 12px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const label = String(this.properties.label)
    const displayLabel = label.length > 20 ? label.slice(0, 17) + '...' : label
    ctx.fillText(displayLabel, btnX + btnW / 2, btnY + btnH / 2)

    ctx.restore()
  }
}
