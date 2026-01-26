import { LGraphNode, LiteGraph } from 'litegraph.js'

/**
 * createSiweMessage 节点 - 创建 SIWE 消息
 */
class CreateSiweMessageNode extends LGraphNode {
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

/**
 * verifySiweMessage 节点 - 验证 SIWE 消息
 */
class VerifySiweMessageNode extends LGraphNode {
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

/**
 * parseSiweMessage 节点 - 解析 SIWE 消息
 */
class ParseSiweMessageNode extends LGraphNode {
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

export function registerSiweNodes() {
  LiteGraph.registerNodeType('SIWE/createSiweMessage', CreateSiweMessageNode)
  LiteGraph.registerNodeType('SIWE/verifySiweMessage', VerifySiweMessageNode)
  LiteGraph.registerNodeType('SIWE/parseSiweMessage', ParseSiweMessageNode)
}

export {
  CreateSiweMessageNode,
  VerifySiweMessageNode,
  ParseSiweMessageNode
}
