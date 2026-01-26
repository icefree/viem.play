import { LGraphNode, LiteGraph } from 'litegraph.js'

/**
 * 文本输入节点 - 允许用户输入字符串值
 */
class TextInputNode extends LGraphNode {
  static title = 'Text'
  static desc = 'Input text value'

  constructor() {
    super()
    this.title = 'Text'
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
    this.title = 'Number'
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
 * Bytes 输入节点 - 允许用户输入十六进制 bytes 值
 */
class BytesInputNode extends LGraphNode {
  static title = 'Bytes'
  static desc = 'Input bytes value (hex string)'

  constructor() {
    super()
    this.title = 'Bytes'
    this.addOutput('bytes', 'bytes')
    this.addProperty('value', '')
    this.size = [220, 60]

    this.addWidget('text', 'Bytes', '', (v: string) => {
      this.properties.value = v
    })
  }

  onExecute() {
    const value = this.properties.value as string
    if (value && value.startsWith('0x') && value.length % 2 === 0) {
      this.setOutputData(0, value)
    } else {
      this.setOutputData(0, null)
    }
  }
}

/**
 * JSON 输入节点 - 允许用户输入 object/array
 */
class JsonInputNode extends LGraphNode {
  static title = 'JSON'
  static desc = 'Input JSON object/array'

  constructor() {
    super()
    this.title = 'JSON'
    this.addOutput('value', 'object,array')
    this.addProperty('value', '')
    this.size = [220, 60]

    this.addWidget('text', 'JSON', '', (v: string) => {
      this.properties.value = v
    })
  }

  onExecute() {
    const value = this.properties.value as string
    if (!value) {
      this.setOutputData(0, null)
      return
    }
    try {
      const parsed = JSON.parse(value)
      if (parsed !== null && (Array.isArray(parsed) || typeof parsed === 'object')) {
        this.setOutputData(0, parsed)
      } else {
        this.setOutputData(0, null)
      }
    } catch {
      this.setOutputData(0, null)
    }
  }
}

/**
 * 触发节点 - 手动触发动作输出
 */
class TriggerNode extends LGraphNode {
  static title = 'Trigger'
  static desc = 'Manual action trigger'

  color = '#3d5a80'
  bgcolor = '#293241'

  private isClicking = false

  constructor() {
    super()
    this.title = 'Trigger'
    this.addOutput('trigger', -1)
    this.size = [120, 50]
  }

  onMouseDown() {
    this.isClicking = true
    this.triggerSlot(0, true)
    this.setDirtyCanvas(true, true)
    return true
  }

  onMouseUp() {
    this.isClicking = false
    this.setDirtyCanvas(true, true)
    return true
  }

  onDrawBackground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) return

    const [w, h] = this.size
    const margin = 10
    const btnW = w - margin * 2
    const btnH = 24
    const btnY = h - btnH - 8

    ctx.save()
    
    // Draw button shadow/glow
    if (this.isClicking) {
      ctx.shadowColor = 'rgba(74, 144, 226, 0.5)'
      ctx.shadowBlur = 10
    }

    // Button body
    const grad = ctx.createLinearGradient(margin, btnY, margin, btnY + btnH)
    if (this.isClicking) {
      grad.addColorStop(0, '#2c3e50')
      grad.addColorStop(1, '#34495e')
    } else {
      grad.addColorStop(0, '#4a90e2')
      grad.addColorStop(1, '#357abd')
    }

    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.roundRect(margin, btnY, btnW, btnH, 6)
    ctx.fill()

    // Inner highlight
    if (!this.isClicking) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // Text
    ctx.shadowBlur = 0
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 12px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('FIRE', w / 2, btnY + btnH / 2)

    ctx.restore()
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
    this.title = 'Address'
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
    this.title = 'Bytes32'
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
    this.title = 'Display'
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
    this.title = 'Console'
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
    this.title = 'toBigInt'
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
    this.title = 'formatEther'
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
    this.title = 'parseEther'
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

/**
 * Base Placeholder Node for missing actions
 */
class UtilityPlaceholderNode extends LGraphNode {
  constructor(title: string, desc: string) {
    super()
    this.title = title
    this.properties = { description: desc }
    this.color = '#4a5568'
    this.bgcolor = '#2d3748'
    this.size = [180, 40]
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) return
    ctx.font = '10px Arial'
    ctx.fillStyle = '#666'
    ctx.fillText('Placeholder', 10, 30)
  }
}

export function registerUtilityNodes() {
  // --- UI Items (Internal) ---
  LiteGraph.registerNodeType('Utilities/UI/Text', TextInputNode)
  LiteGraph.registerNodeType('Utilities/UI/Number', NumberInputNode)
  LiteGraph.registerNodeType('Utilities/UI/Bytes', BytesInputNode)
  LiteGraph.registerNodeType('Utilities/UI/JSON', JsonInputNode)
  LiteGraph.registerNodeType('Utilities/UI/Trigger', TriggerNode)
  LiteGraph.registerNodeType('Utilities/UI/Address', AddressInputNode)
  LiteGraph.registerNodeType('Utilities/UI/Bytes32', Bytes32InputNode)
  LiteGraph.registerNodeType('Utilities/UI/Display', DisplayNode)
  LiteGraph.registerNodeType('Utilities/UI/Console', ConsoleLogNode)

  // --- Address ---
  LiteGraph.registerNodeType('Utilities/Address/getAddress', class extends UtilityPlaceholderNode { constructor() { super('getAddress', 'Checksum an address') } })
  LiteGraph.registerNodeType('Utilities/Address/isAddress', class extends UtilityPlaceholderNode { constructor() { super('isAddress', 'Check if address is valid') } })
  LiteGraph.registerNodeType('Utilities/Address/isAddressEqual', class extends UtilityPlaceholderNode { constructor() { super('isAddressEqual', 'Check if addresses are equal') } })

  // --- Data ---
  LiteGraph.registerNodeType('Utilities/Data/concat', class extends UtilityPlaceholderNode { constructor() { super('concat', 'Concatenate hex/byte data') } })
  LiteGraph.registerNodeType('Utilities/Data/isHex', class extends UtilityPlaceholderNode { constructor() { super('isHex', 'Check if value is hex') } })
  LiteGraph.registerNodeType('Utilities/Data/pad', class extends UtilityPlaceholderNode { constructor() { super('pad', 'Pad hex/byte data') } })
  LiteGraph.registerNodeType('Utilities/Data/size', class extends UtilityPlaceholderNode { constructor() { super('size', 'Get size of hex/byte data') } })
  LiteGraph.registerNodeType('Utilities/Data/slice', class extends UtilityPlaceholderNode { constructor() { super('slice', 'Slice hex/byte data') } })

  // --- Encoding / Parsing ---
  LiteGraph.registerNodeType('Utilities/Encoding/toHex', class extends UtilityPlaceholderNode { constructor() { super('toHex', 'Convert to hex') } })
  LiteGraph.registerNodeType('Utilities/Encoding/fromHex', class extends UtilityPlaceholderNode { constructor() { super('fromHex', 'Parse from hex') } })
  LiteGraph.registerNodeType('Utilities/Encoding/toRlp', class extends UtilityPlaceholderNode { constructor() { super('toRlp', 'Encode to RLP') } })
  LiteGraph.registerNodeType('Utilities/Encoding/fromRlp', class extends UtilityPlaceholderNode { constructor() { super('fromRlp', 'Decode from RLP') } })

  // --- Units ---
  LiteGraph.registerNodeType('Utilities/Units/formatEther', FormatEtherNode)
  LiteGraph.registerNodeType('Utilities/Units/parseEther', ParseEtherNode)
  LiteGraph.registerNodeType('Utilities/Units/formatUnits', class extends UtilityPlaceholderNode { constructor() { super('formatUnits', 'Format units') } })
  LiteGraph.registerNodeType('Utilities/Units/parseUnits', class extends UtilityPlaceholderNode { constructor() { super('parseUnits', 'Parse units') } })

  // --- Hash ---
  LiteGraph.registerNodeType('Utilities/Hash/keccak256', class extends UtilityPlaceholderNode { constructor() { super('keccak256', 'Keccak-256 hash') } })
  LiteGraph.registerNodeType('Utilities/Hash/hashMessage', class extends UtilityPlaceholderNode { constructor() { super('hashMessage', 'Hash a message') } })
  
  // --- Chains ---
  LiteGraph.registerNodeType('Utilities/Chains/extractChain', class extends UtilityPlaceholderNode { constructor() { super('extractChain', 'Extract chain from client') } })

  // --- Signature ---
  LiteGraph.registerNodeType('Utilities/Signature/recoverAddress', class extends UtilityPlaceholderNode { constructor() { super('recoverAddress', 'Recover address from signature') } })
  LiteGraph.registerNodeType('Utilities/Signature/verifyMessage', class extends UtilityPlaceholderNode { constructor() { super('verifyMessage', 'Verify a message signature') } })

  // --- Helpers ---
  LiteGraph.registerNodeType('Utilities/Helpers/toBigInt', ToBigIntNode)
}

export {
  TextInputNode,
  NumberInputNode,
  BytesInputNode,
  JsonInputNode,
  TriggerNode,
  AddressInputNode,
  Bytes32InputNode,
  DisplayNode,
  ConsoleLogNode,
  ToBigIntNode,
  FormatEtherNode,
  ParseEtherNode
}
