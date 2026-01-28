import { LGraphNode } from 'litegraph.js'

/**
 * 地址输入节点 - 专门用于输入以太坊地址
 */
export class AddressInputNode extends LGraphNode {
  static title = 'Address'
  static desc = 'Ethereum address input'
  
  color = '#3d5a80'
  bgcolor = '#293241'

  constructor() {
    super()
    this.title = 'Address'
    this.addOutput('address', 'address')
    this.addProperty('value', '')
    this.size = [260, 60]

    this.addWidget('text', 'Address', '', (v: string) => {
      this.properties.value = v
    }, {})
  }

  onExecute() {
    const addr = this.properties.value as string
    if (addr && addr.startsWith('0x') && addr.length === 42) {
      this.setOutputData(0, addr)
    } else {
      this.setOutputData(0, null)
    }
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) return
    const addr = this.properties.value as string
    if (addr && addr.length === 42) {
      ctx.fillStyle = '#48bb78'
      ctx.font = '10px monospace'
      ctx.fillText(`${addr.slice(0, 10)}...${addr.slice(-8)}`, 10, 45)
    }
  }
}
