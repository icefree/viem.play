import { LGraphNode } from 'litegraph.js'

/**
 * recoverAuthorizationAddress 节点 - 恢复授权地址
 */
export class RecoverAuthorizationAddressNode extends LGraphNode {
  static title = 'recoverAuthorizationAddress'
  static desc = 'Recover address from authorization'

  color = '#667eea'
  bgcolor = '#4c51bf'

  constructor() {
    super()
    this.addInput('authorization', 'object')
    this.addOutput('address', 'address')
    this.size = [220, 50]
  }

  async onExecute() {
    this.setOutputData(0, null)
  }
}
