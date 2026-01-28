import { LGraphNode } from 'litegraph.js'

/**
 * Terms 节点 - 术语解释节点
 * 显示各种区块链/viem 相关术语的解释
 */
export class TermsNode extends LGraphNode {
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
