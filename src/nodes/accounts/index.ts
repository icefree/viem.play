import { LGraphNode, LiteGraph } from 'litegraph.js'

/**
 * privateKeyToAccount 节点 - 从私钥创建账户
 */
class PrivateKeyToAccountNode extends LGraphNode {
  static title = 'privateKeyToAccount'
  static desc = 'Create account from private key'

  color = '#d69e2e'
  bgcolor = '#975a16'

  constructor() {
    super()
    this.addInput('privateKey', 'string')
    this.addOutput('account', 'account')
    this.addOutput('address', 'address')
    this.size = [200, 70]
  }

  async onExecute() {
    // TODO: 实现私钥转账户逻辑
    this.setOutputData(0, null)
    this.setOutputData(1, null)
  }
}

/**
 * mnemonicToAccount 节点 - 从助记词创建账户
 */
class MnemonicToAccountNode extends LGraphNode {
  static title = 'mnemonicToAccount'
  static desc = 'Create account from mnemonic'

  color = '#d69e2e'
  bgcolor = '#975a16'

  constructor() {
    super()
    this.addInput('mnemonic', 'string')
    this.addInput('index', 'number')
    this.addOutput('account', 'account')
    this.addOutput('address', 'address')
    this.size = [200, 90]
  }

  async onExecute() {
    this.setOutputData(0, null)
    this.setOutputData(1, null)
  }
}

/**
 * generatePrivateKey 节点 - 生成新私钥
 */
class GeneratePrivateKeyNode extends LGraphNode {
  static title = 'generatePrivateKey'
  static desc = 'Generate a new private key'

  color = '#d69e2e'
  bgcolor = '#975a16'

  constructor() {
    super()
    this.addOutput('privateKey', 'string')
    this.size = [180, 50]
  }

  async onExecute() {
    // 暂不实现，避免安全问题
    this.setOutputData(0, null)
  }
}

/**
 * generateMnemonic 节点 - 生成新助记词
 */
class GenerateMnemonicNode extends LGraphNode {
  static title = 'generateMnemonic'
  static desc = 'Generate a new mnemonic phrase'

  color = '#d69e2e'
  bgcolor = '#975a16'

  constructor() {
    super()
    this.addOutput('mnemonic', 'string')
    this.size = [180, 50]
  }

  async onExecute() {
    this.setOutputData(0, null)
  }
}

/**
 * toAccount 节点 - 创建 JSON-RPC 账户
 */
class ToAccountNode extends LGraphNode {
  static title = 'toAccount'
  static desc = 'Create a JSON-RPC Account'

  color = '#d69e2e'
  bgcolor = '#975a16'

  constructor() {
    super()
    this.addInput('address', 'address')
    this.addOutput('account', 'account')
    this.size = [160, 50]
  }

  async onExecute() {
    this.setOutputData(0, null)
  }
}

export function registerAccountNodes() {
  LiteGraph.registerNodeType('Accounts/privateKeyToAccount', PrivateKeyToAccountNode)
  LiteGraph.registerNodeType('Accounts/mnemonicToAccount', MnemonicToAccountNode)
  LiteGraph.registerNodeType('Accounts/generatePrivateKey', GeneratePrivateKeyNode)
  LiteGraph.registerNodeType('Accounts/generateMnemonic', GenerateMnemonicNode)
  LiteGraph.registerNodeType('Accounts/toAccount', ToAccountNode)
}

export {
  PrivateKeyToAccountNode,
  MnemonicToAccountNode,
  GeneratePrivateKeyNode,
  GenerateMnemonicNode,
  ToAccountNode
}
