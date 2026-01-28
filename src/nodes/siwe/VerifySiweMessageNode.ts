import { LGraphNode } from 'litegraph.js'

/**
 * verifySiweMessage 节点 - 验证 SIWE 消息
 */
export class VerifySiweMessageNode extends LGraphNode {
  static title = 'verifySiweMessage'
  static desc = 'Verify Sign-In with Ethereum message'

  color = '#ed8936'
  bgcolor = '#9c4221'

  constructor() {
    super()
    this.addInput('message', 'string')
    this.addInput('signature', 'string')
    this.addOutput('isValid', 'boolean')
    this.addOutput('address', 'address')
    this.size = [200, 90]
  }

  async onExecute() {
    this.setOutputData(0, null)
    this.setOutputData(1, null)
  }
}
