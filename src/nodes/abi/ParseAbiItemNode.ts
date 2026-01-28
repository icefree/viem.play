import { LGraphNode } from 'litegraph.js'
import { parseAbiItem, type AbiItem } from 'viem'

/**
 * parseAbiItem 节点 - 解析单个 ABI 项
 */
export class ParseAbiItemNode extends LGraphNode {
  static title = 'parseAbiItem'
  static desc = 'Parse a single ABI item'

  color = '#e53e3e'
  bgcolor = '#742a2a'

  constructor() {
    super()
    this.title = 'parseAbiItem'
    this.addInput('signature', 'string')
    this.addOutput('abiItem', 'object')
    this.size = [180, 50]
  }

  onExecute() {
    const signature = this.getInputData(0) as string | undefined
    
    if (signature) {
      try {
        const abiItem = parseAbiItem(signature) as AbiItem
        this.setOutputData(0, abiItem)
      } catch {
        this.setOutputData(0, null)
      }
    } else {
      this.setOutputData(0, null)
    }
  }
}
