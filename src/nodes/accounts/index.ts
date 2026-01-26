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
    this.title = 'privateKeyToAccount'
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
    this.title = 'mnemonicToAccount'
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
    this.title = 'generatePrivateKey'
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
    this.title = 'generateMnemonic'
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
    this.title = 'toAccount'
    this.addInput('address', 'address')
    this.addOutput('account', 'account')
    this.size = [160, 50]
  }

  async onExecute() {
    this.setOutputData(0, null)
  }
}

/**
 * Base Placeholder Node for missing actions
 */
class AccountPlaceholderNode extends LGraphNode {
  constructor(title: string, desc: string) {
    super()
    this.title = title
    this.addOutput('account', 'account')
    this.properties = { description: desc }
    this.color = '#d69e2e'
    this.bgcolor = '#975a16'
    this.size = [180, 40]
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) return
    ctx.font = '10px Arial'
    ctx.fillStyle = '#666'
    ctx.fillText('Placeholder', 10, 30)
  }
}

export function registerAccountNodes() {
  // --- JSON-RPC Account ---
  LiteGraph.registerNodeType('Accounts/JSON-RPC/toAccount', ToAccountNode)

  // --- Local Account ---
  LiteGraph.registerNodeType('Accounts/Local/privateKeyToAccount', PrivateKeyToAccountNode)
  LiteGraph.registerNodeType('Accounts/Local/mnemonicToAccount', MnemonicToAccountNode)
  LiteGraph.registerNodeType('Accounts/Local/hdKeyToAccount', class extends AccountPlaceholderNode { constructor() { super('hdKeyToAccount', 'Create account from HD Key') } })
  LiteGraph.registerNodeType('Accounts/Local/toAccount', class extends AccountPlaceholderNode { constructor() { super('toAccount', 'Create a custom Local Account') } })

  // --- Utils ---
  LiteGraph.registerNodeType('Accounts/Utils/generatePrivateKey', GeneratePrivateKeyNode)
  LiteGraph.registerNodeType('Accounts/Utils/generateMnemonic', GenerateMnemonicNode)
  LiteGraph.registerNodeType('Accounts/Utils/parseAccount', class extends AccountPlaceholderNode { constructor() { super('parseAccount', 'Parse an account') } })
}

export {
  PrivateKeyToAccountNode,
  MnemonicToAccountNode,
  GeneratePrivateKeyNode,
  GenerateMnemonicNode,
  ToAccountNode
}
