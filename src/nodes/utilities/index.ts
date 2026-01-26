import { LGraphNode, LiteGraph } from 'litegraph.js'

/**
 * 文本输入节点 - 允许用户输入字符串值
 */
class TextInputNode extends LGraphNode {
  static title = 'Text'
  static desc = 'Input text value'

  constructor() {
    super()
    this.addOutput('text', 'string')
    this.addProperty('value', '')
    this.size = [180, 60]

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
  static title = 'Number'
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
    this.size = [260, 60]

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

/**
 * Bytes32 输入节点
 */
class Bytes32InputNode extends LGraphNode {
  static title = 'Bytes32'
  static desc = 'Input bytes32 value (32-byte hex string)'
  
  color = '#3d5a80'
  bgcolor = '#293241'

  constructor() {
    super()
    this.addOutput('bytes32', 'bytes32')
    this.addProperty('value', '')
    this.size = [260, 60]

    this.addWidget('text', 'Bytes32', '', (v: string) => {
      this.properties.value = v
    })
  }

  onExecute() {
    const val = this.properties.value as string
    if (val && val.startsWith('0x') && val.length === 66) {
      this.setOutputData(0, val)
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
  static title = 'Console'
  static desc = 'Log value to console'
  
  color = '#744210'
  bgcolor = '#553c00'

  constructor() {
    super()
    this.addInput('value', 0)
    this.addInput('trigger', -1)
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

/**
 * BigInt 转换节点
 */
class ToBigIntNode extends LGraphNode {
  static title = 'toBigInt'
  static desc = 'Convert string/number to BigInt'

  constructor() {
    super()
    this.addInput('value', 0)
    this.addOutput('bigint', 'bigint')
    this.size = [140, 50]
  }

  onExecute() {
    const value = this.getInputData(0)
    try {
      if (value !== undefined && value !== null) {
        this.setOutputData(0, BigInt(value))
      } else {
        this.setOutputData(0, null)
      }
    } catch {
      this.setOutputData(0, null)
    }
  }
}

/**
 * Format Ether 节点
 */
class FormatEtherNode extends LGraphNode {
  static title = 'formatEther'
  static desc = 'Format wei to ether string'

  color = '#38a169'
  bgcolor = '#276749'

  constructor() {
    super()
    this.addInput('wei', 'bigint')
    this.addOutput('ether', 'string')
    this.size = [160, 50]
  }

  onExecute() {
    const wei = this.getInputData(0) as bigint | undefined
    if (wei !== undefined && wei !== null) {
      // 1 ether = 10^18 wei
      const ether = Number(wei) / 1e18
      this.setOutputData(0, ether.toString())
    } else {
      this.setOutputData(0, null)
    }
  }
}

/**
 * Parse Ether 节点
 */
class ParseEtherNode extends LGraphNode {
  static title = 'parseEther'
  static desc = 'Parse ether string to wei'

  color = '#38a169'
  bgcolor = '#276749'

  constructor() {
    super()
    this.addInput('ether', 'string')
    this.addOutput('wei', 'bigint')
    this.size = [160, 50]
  }

  onExecute() {
    const ether = this.getInputData(0) as string | undefined
    if (ether !== undefined && ether !== null) {
      try {
        const wei = BigInt(Math.floor(parseFloat(ether) * 1e18))
        this.setOutputData(0, wei)
      } catch {
        this.setOutputData(0, null)
      }
    } else {
      this.setOutputData(0, null)
    }
  }
}

export function registerUtilityNodes() {
  LiteGraph.registerNodeType('Utilities/Text', TextInputNode)
  LiteGraph.registerNodeType('Utilities/Number', NumberInputNode)
  LiteGraph.registerNodeType('Utilities/Address', AddressInputNode)
  LiteGraph.registerNodeType('Utilities/Bytes32', Bytes32InputNode)
  LiteGraph.registerNodeType('Utilities/Display', DisplayNode)
  LiteGraph.registerNodeType('Utilities/Console', ConsoleLogNode)
  LiteGraph.registerNodeType('Utilities/toBigInt', ToBigIntNode)
  LiteGraph.registerNodeType('Utilities/formatEther', FormatEtherNode)
  LiteGraph.registerNodeType('Utilities/parseEther', ParseEtherNode)
}

export {
  TextInputNode,
  NumberInputNode,
  AddressInputNode,
  Bytes32InputNode,
  DisplayNode,
  ConsoleLogNode,
  ToBigIntNode,
  FormatEtherNode,
  ParseEtherNode
}
