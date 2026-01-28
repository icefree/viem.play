import { LGraphNode } from 'litegraph.js'

/**
 * parseAbi 节点 - 解析 ABI JSON
 */
export class ParseAbiNode extends LGraphNode {
  static title = 'parseAbi'
  static desc = 'Parse ABI from JSON string'

  color = '#e53e3e'
  bgcolor = '#742a2a'

  private abi: any = null

  constructor() {
    super()
    this.title = 'parseAbi'
    this.addInput('abiJson', 'string')
    this.addInput('trigger', -1)
    this.addOutput('abi', 'abi')
    this.size = [160, 80]
  }

  onAction(action: string) {
    if (action === 'trigger') {
      const abiJson = this.getInputData(0) as string
      if (abiJson) {
        try {
          this.abi = JSON.parse(abiJson)
        } catch {
          this.abi = null
        }
      } else {
        this.abi = null
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.abi)
  }
}
