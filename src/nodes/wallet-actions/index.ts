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

export function registerWalletActionNodes() {
  LiteGraph.registerNodeType('Wallet Actions/sendTransaction', SendTransactionNode)
  LiteGraph.registerNodeType('Wallet Actions/signMessage', SignMessageNode)
  LiteGraph.registerNodeType('Wallet Actions/signTypedData', SignTypedDataNode)
  LiteGraph.registerNodeType('Wallet Actions/switchChain', SwitchChainNode)
  LiteGraph.registerNodeType('Wallet Actions/getAddresses', GetAddressesNode)
}

export {
  SendTransactionNode,
  SignMessageNode,
  SignTypedDataNode,
  SwitchChainNode,
  GetAddressesNode
}
