import { LGraphNode, LiteGraph } from 'litegraph.js'

/**
 * signAuthorization 节点 - 签名 EIP-7702 授权
 */
class SignAuthorizationNode extends LGraphNode {
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

/**
 * recoverAuthorizationAddress 节点 - 恢复授权地址
 */
class RecoverAuthorizationAddressNode extends LGraphNode {
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

/**
 * verifyAuthorization 节点 - 验证授权
 */
class VerifyAuthorizationNode extends LGraphNode {
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

export function registerEip7702Nodes() {
  LiteGraph.registerNodeType('EIP-7702/signAuthorization', SignAuthorizationNode)
  LiteGraph.registerNodeType('EIP-7702/recoverAuthorizationAddress', RecoverAuthorizationAddressNode)
  LiteGraph.registerNodeType('EIP-7702/verifyAuthorization', VerifyAuthorizationNode)
}

export {
  SignAuthorizationNode,
  RecoverAuthorizationAddressNode,
  VerifyAuthorizationNode
}
