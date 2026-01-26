import { LGraphNode, LiteGraph } from 'litegraph.js'

/**
 * 文本输入节点 - 允许用户输入字符串值
 */
class TextInputNode extends LGraphNode {
  static title = 'Text Input'
  static desc = 'Input text value'

  constructor() {
    super()
    this.addOutput('text', 'string')
    this.addProperty('value', '')
    this.size = [180, 60]

    // Widget for input
    this.addWidget('text', 'Value', '', (v: string) => {
      this.properties.value = v
    })
  }

  onExecute() {
    this.setOutputData(0, this.properties.value)
  }
}

/**
 * 数字输入节点 - 允许用户输入数字值
 */
class NumberInputNode extends LGraphNode {
  static title = 'Number Input'
  static desc = 'Input number value'

  constructor() {
    super()
    this.addOutput('number', 'number')
    this.addProperty('value', 0)
    this.size = [180, 60]

    this.addWidget('number', 'Value', 0, (v: number) => {
      this.properties.value = v
    })
  }

  onExecute() {
    this.setOutputData(0, this.properties.value)
  }
}

/**
 * 地址输入节点 - 专门用于输入以太坊地址
 */
class AddressInputNode extends LGraphNode {
  static title = 'Address'
  static desc = 'Ethereum address input'
  
  color = '#3d5a80'
  bgcolor = '#293241'

  constructor() {
    super()
    this.addOutput('address', 'address')
    this.addProperty('value', '')
    this.size = [220, 60]

    this.addWidget('text', 'Address', '', (v: string) => {
      this.properties.value = v
    })
  }

  onExecute() {
    const addr = this.properties.value as string
    if (addr && addr.startsWith('0x') && addr.length === 42) {
      this.setOutputData(0, addr)
    } else {
      this.setOutputData(0, null)
    }
  }
}

/**
 * 显示节点 - 显示任何输入数据
 */
class DisplayNode extends LGraphNode {
  static title = 'Display'
  static desc = 'Display any value'
  
  color = '#4a5568'
  bgcolor = '#2d3748'

  private displayValue: string = ''

  constructor() {
    super()
    this.addInput('value', 0) // 0 means any type
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
        this.displayValue = JSON.stringify(value, null, 2)
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

/**
 * Console Log 节点 - 将输入值输出到控制台
 */
class ConsoleLogNode extends LGraphNode {
  static title = 'Console Log'
  static desc = 'Log value to console'
  
  color = '#744210'
  bgcolor = '#553c00'

  constructor() {
    super()
    this.addInput('value', 0)
    this.addInput('trigger', -1) // Action trigger
    this.size = [140, 50]
  }

  onExecute() {
    const value = this.getInputData(0)
    if (value !== undefined) {
      console.log('[ViemPlay]', value)
    }
  }

  onAction() {
    const value = this.getInputData(0)
    console.log('[ViemPlay Action]', value)
  }
}

// Register all core nodes
export function registerCoreNodes() {
  LiteGraph.registerNodeType('core/TextInput', TextInputNode)
  LiteGraph.registerNodeType('core/NumberInput', NumberInputNode)
  LiteGraph.registerNodeType('core/Address', AddressInputNode)
  LiteGraph.registerNodeType('core/Display', DisplayNode)
  LiteGraph.registerNodeType('core/ConsoleLog', ConsoleLogNode)
}

export {
  TextInputNode,
  NumberInputNode,
  AddressInputNode,
  DisplayNode,
  ConsoleLogNode
}
