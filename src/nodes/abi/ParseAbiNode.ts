import { LGraphNode } from 'litegraph.js'

/**
 * parseAbi 节点 - 解析 ABI JSON
 */
export class ParseAbiNode extends LGraphNode {
  static title = 'parseAbi'
  static desc = 'Parse ABI from JSON string'

  color = '#e53e3e'
  bgcolor = '#742a2a'

  constructor() {
    super()
    this.title = 'parseAbi'
    this.addInput('abiJson', 'string')
    this.addOutput('abi', 'abi')
    this.size = [160, 50]
  }

  onExecute() {
    const abiJson = this.getInputData(0) as string
    if (abiJson) {
      try {
        const abi = JSON.parse(abiJson)
        this.setOutputData(0, abi)
      } catch {
        this.setOutputData(0, null)
      }
    } else {
      this.setOutputData(0, null)
    }
  }
}
