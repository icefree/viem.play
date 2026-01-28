import { LGraphNode } from 'litegraph.js'

/**
 * createSiweMessage 节点 - 创建 SIWE 消息
 */
export class CreateSiweMessageNode extends LGraphNode {
  static title = 'createSiweMessage'
  static desc = 'Create Sign-In with Ethereum message'

  color = '#ed8936'
  bgcolor = '#9c4221'

  constructor() {
    super()
    this.addInput('address', 'address')
    this.addInput('domain', 'string')
    this.addInput('uri', 'string')
    this.addInput('nonce', 'string')
    this.addOutput('message', 'string')
    this.size = [200, 110]
  }

  async onExecute() {
    // TODO: 实现 SIWE 消息创建逻辑
    this.setOutputData(0, null)
  }
}
