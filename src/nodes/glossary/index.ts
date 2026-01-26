import { LGraphNode, LiteGraph } from 'litegraph.js'

/**
 * Terms 节点 - 术语解释节点
 * 显示各种区块链/viem 相关术语的解释
 */
class TermsNode extends LGraphNode {
  static title = 'Terms'
  static desc = 'Blockchain terminology reference'

  color = '#718096'
  bgcolor = '#4a5568'

  private terms: Record<string, string> = {
    'Wei': 'Smallest unit of Ether. 1 ETH = 10^18 Wei',
    'Gwei': 'Gas unit. 1 Gwei = 10^9 Wei',
    'ABI': 'Application Binary Interface - contract interface definition',
    'EOA': 'Externally Owned Account - user wallet',
    'Nonce': 'Transaction counter for an account',
    'Gas': 'Computational cost unit for transactions',
    'Block': 'Container of transactions in blockchain',
    'Hash': '32-byte unique identifier',
  }

  constructor() {
    super()
    this.addProperty('term', 'Wei')
    this.addOutput('definition', 'string')
    this.size = [200, 80]

    this.addWidget('combo', 'Term', 'Wei', (v: string) => {
      this.properties.term = v
    }, { values: Object.keys(this.terms) })
  }

  onExecute() {
    const term = this.properties.term as string
    this.setOutputData(0, this.terms[term] || '')
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) return

    const term = this.properties.term as string
    const def = this.terms[term] || ''

    ctx.fillStyle = '#a0aec0'
    ctx.font = '10px sans-serif'

    // Word wrap
    const words = def.split(' ')
    let line = ''
    let y = 50
    words.forEach(word => {
      if ((line + word).length > 28) {
        ctx.fillText(line, 10, y)
        line = word + ' '
        y += 12
      } else {
        line += word + ' '
      }
    })
    if (line) ctx.fillText(line, 10, y)
  }
}

/**
 * Units 节点 - 单位参考
 */
class UnitsNode extends LGraphNode {
  static title = 'Units'
  static desc = 'Ethereum unit reference'

  color = '#718096'
  bgcolor = '#4a5568'

  constructor() {
    super()
    this.addOutput('info', 'string')
    this.size = [180, 100]
  }

  onExecute() {
    this.setOutputData(0, '1 ETH = 10^18 Wei = 10^9 Gwei')
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) return

    ctx.fillStyle = '#a0aec0'
    ctx.font = '11px monospace'
    ctx.fillText('1 ETH  = 10^18 Wei', 10, 35)
    ctx.fillText('1 Gwei = 10^9  Wei', 10, 50)
    ctx.fillText('1 ETH  = 10^9  Gwei', 10, 65)
  }
}

/**
 * ChainIds 节点 - 常用链 ID 参考
 */
class ChainIdsNode extends LGraphNode {
  static title = 'Common Chain IDs'
  static desc = 'Reference for common chain IDs'

  color = '#718096'
  bgcolor = '#4a5568'

  constructor() {
    super()
    this.size = [180, 140]
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) return

    ctx.fillStyle = '#a0aec0'
    ctx.font = '11px monospace'
    
    const chains = [
      ['Mainnet', '1'],
      ['Sepolia', '11155111'],
      ['Polygon', '137'],
      ['Arbitrum', '42161'],
      ['Optimism', '10'],
      ['Base', '8453'],
      ['Anvil', '31337'],
    ]

    chains.forEach(([name, id], i) => {
      ctx.fillText(`${name}: ${id}`, 10, 35 + i * 14)
    })
  }
}

export function registerGlossaryNodes() {
  LiteGraph.registerNodeType('Glossary/Terms', TermsNode)
  LiteGraph.registerNodeType('Glossary/Units', UnitsNode)
  LiteGraph.registerNodeType('Glossary/ChainIds', ChainIdsNode)
}

export {
  TermsNode,
  UnitsNode,
  ChainIdsNode
}
