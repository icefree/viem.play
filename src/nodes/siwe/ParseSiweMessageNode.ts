import { LGraphNode } from 'litegraph.js'
import { parseSiweMessage } from 'viem/siwe'

/**
 * parseSiweMessage 节点 - 解析 SIWE 消息
 */
export class ParseSiweMessageNode extends LGraphNode {
  static title = 'parseSiweMessage'
  static desc = 'Extract fields from Sign-In with Ethereum message'

  color = '#ed8936'
  bgcolor = '#9c4221'

  private fields: any = null

  constructor() {
    super()
    this.title = 'parseSiweMessage'
    this.addInput('message', 'string')
    this.addInput('trigger', -1)
    this.addOutput('fields', 'object')
    this.size = [200, 80]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const message = this.getInputData(0) as string | undefined
      if (!message) return

      try {
        this.fields = parseSiweMessage(message)
      } catch (err) {
        console.error(err)
        this.fields = null
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.fields)
  }
}
