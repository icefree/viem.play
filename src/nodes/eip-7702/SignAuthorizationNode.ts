import { LGraphNode } from 'litegraph.js'

/**
 * signAuthorization 节点 - 签名 EIP-7702 授权
 */
export class SignAuthorizationNode extends LGraphNode {
  static title = 'signAuthorization'
  static desc = 'Sign EIP-7702 authorization'

  color = '#667eea'
  bgcolor = '#4c51bf'

  constructor() {
    super()
    this.addInput('client', 'walletClient')
    this.addInput('contractAddress', 'address')
    this.addInput('chainId', 'number')
    this.addInput('nonce', 'bigint')
    this.addOutput('authorization', 'object')
    this.size = [200, 110]
  }

  async onExecute() {
    // TODO: 实现 EIP-7702 签名逻辑
    this.setOutputData(0, null)
  }
}
