import { LGraphNode } from 'litegraph.js'

/**
 * parseSiweMessage 节点 - 解析 SIWE 消息
 */
export class ParseSiweMessageNode extends LGraphNode {
  static title = 'parseSiweMessage'
  static desc = 'Parse Sign-In with Ethereum message'

  color = '#ed8936'
  bgcolor = '#9c4221'

  constructor() {
    super()
    this.addInput('message', 'string')
    this.addOutput('parsed', 'object')
    this.size = [180, 50]
  }

  async onExecute() {
    this.setOutputData(0, null)
  }
}
