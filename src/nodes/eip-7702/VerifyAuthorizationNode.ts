import { LGraphNode } from 'litegraph.js'

/**
 * verifyAuthorization 节点 - 验证授权
 */
export class VerifyAuthorizationNode extends LGraphNode {
  static title = 'verifyAuthorization'
  static desc = 'Verify EIP-7702 authorization'

  color = '#667eea'
  bgcolor = '#4c51bf'

  constructor() {
    super()
    this.addInput('authorization', 'object')
    this.addInput('address', 'address')
    this.addOutput('isValid', 'boolean')
    this.size = [200, 70]
  }

  async onExecute() {
    this.setOutputData(0, null)
  }
}
