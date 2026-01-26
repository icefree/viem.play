import { LGraphNode, LiteGraph } from 'litegraph.js'

/**
 * sendTransaction 节点 - 发送交易
 */
class SendTransactionNode extends LGraphNode {
  static title = 'sendTransaction'
  static desc = 'Send a transaction'

  color = '#c53030'
  bgcolor = '#742a2a'

  constructor() {
    super()
    this.addInput('client', 'walletClient')
    this.addInput('to', 'address')
    this.addInput('value', 'bigint')
    this.addInput('data', 'bytes')
    this.addOutput('hash', 'string')
    this.size = [180, 110]
  }

  async onExecute() {
    // TODO: 实现 sendTransaction 逻辑
    this.setOutputData(0, null)
  }
}

/**
 * signMessage 节点 - 签名消息
 */
class SignMessageNode extends LGraphNode {
  static title = 'signMessage'
  static desc = 'Sign a message with wallet'

  color = '#c53030'
  bgcolor = '#742a2a'

  constructor() {
    super()
    this.addInput('client', 'walletClient')
    this.addInput('message', 'string')
    this.addOutput('signature', 'string')
    this.size = [180, 70]
  }

  async onExecute() {
    // TODO: 实现 signMessage 逻辑
    this.setOutputData(0, null)
  }
}

/**
 * signTypedData 节点 - 签名类型化数据
 */
class SignTypedDataNode extends LGraphNode {
  static title = 'signTypedData'
  static desc = 'Sign typed data (EIP-712)'

  color = '#c53030'
  bgcolor = '#742a2a'

  constructor() {
    super()
    this.addInput('client', 'walletClient')
    this.addInput('typedData', 'object')
    this.addOutput('signature', 'string')
    this.size = [180, 70]
  }

  async onExecute() {
    this.setOutputData(0, null)
  }
}

/**
 * switchChain 节点 - 切换链
 */
class SwitchChainNode extends LGraphNode {
  static title = 'switchChain'
  static desc = 'Switch to a different chain'

  color = '#c53030'
  bgcolor = '#742a2a'

  constructor() {
    super()
    this.addInput('client', 'walletClient')
    this.addInput('chainId', 'number')
    this.addOutput('success', 'boolean')
    this.size = [160, 70]
  }

  async onExecute() {
    this.setOutputData(0, null)
  }
}

/**
 * getAddresses 节点 - 获取钱包地址
 */
class GetAddressesNode extends LGraphNode {
  static title = 'getAddresses'
  static desc = 'Get wallet addresses'

  color = '#c53030'
  bgcolor = '#742a2a'

  constructor() {
    super()
    this.addInput('client', 'walletClient')
    this.addOutput('addresses', 'array')
    this.size = [160, 50]
  }

  async onExecute() {
    this.setOutputData(0, null)
  }
}

/**
 * Base Placeholder Node for missing actions
 */
class WalletActionPlaceholderNode extends LGraphNode {
  constructor(title: string, desc: string) {
    super()
    this.title = title
    this.addInput('client', 'walletClient')
    this.properties = { description: desc }
    this.color = '#c53030'
    this.bgcolor = '#742a2a'
    this.size = [180, 40]
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) return
    ctx.font = '10px Arial'
    ctx.fillStyle = '#666'
    ctx.fillText('Placeholder', 10, 30)
  }
}

export function registerWalletActionNodes() {
  // --- Transaction ---
  LiteGraph.registerNodeType('Wallet Actions/Transaction/sendTransaction', SendTransactionNode)
  LiteGraph.registerNodeType('Wallet Actions/Transaction/sendRawTransaction', class extends WalletActionPlaceholderNode { constructor() { super('sendRawTransaction', 'Send a signed transaction') } })
  LiteGraph.registerNodeType('Wallet Actions/Transaction/prepareTransactionRequest', class extends WalletActionPlaceholderNode { constructor() { super('prepareTransactionRequest', 'Prepare transaction request') } })

  // --- Sign ---
  LiteGraph.registerNodeType('Wallet Actions/Sign/signMessage', SignMessageNode)
  LiteGraph.registerNodeType('Wallet Actions/Sign/signTypedData', SignTypedDataNode)
  LiteGraph.registerNodeType('Wallet Actions/Sign/signTransaction', class extends WalletActionPlaceholderNode { constructor() { super('signTransaction', 'Sign a transaction') } })

  // --- Account ---
  LiteGraph.registerNodeType('Wallet Actions/Account/getAddresses', GetAddressesNode)
  LiteGraph.registerNodeType('Wallet Actions/Account/requestAddresses', class extends WalletActionPlaceholderNode { constructor() { super('requestAddresses', 'Request wallet addresses') } })
  LiteGraph.registerNodeType('Wallet Actions/Account/getPermissions', class extends WalletActionPlaceholderNode { constructor() { super('getPermissions', 'Get wallet permissions') } })
  LiteGraph.registerNodeType('Wallet Actions/Account/requestPermissions', class extends WalletActionPlaceholderNode { constructor() { super('requestPermissions', 'Request wallet permissions') } })

  // --- Asset ---
  LiteGraph.registerNodeType('Wallet Actions/Asset/watchAsset', class extends WalletActionPlaceholderNode { constructor() { super('watchAsset', 'Watch for an asset') } })

  // --- Chain ---
  LiteGraph.registerNodeType('Wallet Actions/Chain/switchChain', SwitchChainNode)
  LiteGraph.registerNodeType('Wallet Actions/Chain/addChain', class extends WalletActionPlaceholderNode { constructor() { super('addChain', 'Add a chain to the wallet') } })
  LiteGraph.registerNodeType('Wallet Actions/Chain/watchAsset', class extends WalletActionPlaceholderNode { constructor() { super('watchAsset', 'Watch for an asset') } })
}

export {
  SendTransactionNode,
  SignMessageNode,
  SignTypedDataNode,
  SwitchChainNode,
  GetAddressesNode
}
