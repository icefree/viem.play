import { LGraphNode, LiteGraph } from 'litegraph.js'

/**
 * readContract 节点 - 读取合约
 */
class ReadContractNode extends LGraphNode {
  static title = 'readContract'
  static desc = 'Read data from a contract'

  color = '#3182ce'
  bgcolor = '#2a4365'

  constructor() {
    super()
    this.title = 'readContract'
    this.addInput('client', 'publicClient')
    this.addInput('address', 'address')
    this.addInput('abi', 'abi')
    this.addInput('functionName', 'string')
    this.addInput('args', 'array')
    this.addOutput('result', 0)
    this.size = [180, 130]
  }

  async onExecute() {
    // TODO: 实现 readContract 逻辑
    this.setOutputData(0, null)
  }
}

/**
 * writeContract 节点 - 写入合约
 */
class WriteContractNode extends LGraphNode {
  static title = 'writeContract'
  static desc = 'Write data to a contract'

  color = '#3182ce'
  bgcolor = '#2a4365'

  constructor() {
    super()
    this.title = 'writeContract'
    this.addInput('client', 'walletClient')
    this.addInput('address', 'address')
    this.addInput('abi', 'abi')
    this.addInput('functionName', 'string')
    this.addInput('args', 'array')
    this.addOutput('hash', 'string')
    this.size = [180, 130]
  }

  async onExecute() {
    this.setOutputData(0, null)
  }
}

/**
 * simulateContract 节点 - 模拟合约调用
 */
class SimulateContractNode extends LGraphNode {
  static title = 'simulateContract'
  static desc = 'Simulate a contract call'

  color = '#3182ce'
  bgcolor = '#2a4365'

  constructor() {
    super()
    this.title = 'simulateContract'
    this.addInput('client', 'publicClient')
    this.addInput('address', 'address')
    this.addInput('abi', 'abi')
    this.addInput('functionName', 'string')
    this.addInput('args', 'array')
    this.addOutput('result', 0)
    this.addOutput('request', 'object')
    this.size = [180, 150]
  }

  async onExecute() {
    this.setOutputData(0, null)
    this.setOutputData(1, null)
  }
}

/**
 * getContractEvents 节点 - 获取合约事件
 */
class GetContractEventsNode extends LGraphNode {
  static title = 'getContractEvents'
  static desc = 'Get contract events'

  color = '#3182ce'
  bgcolor = '#2a4365'

  constructor() {
    super()
    this.title = 'getContractEvents'
    this.addInput('client', 'publicClient')
    this.addInput('address', 'address')
    this.addInput('abi', 'abi')
    this.addInput('eventName', 'string')
    this.addOutput('events', 'array')
    this.size = [180, 110]
  }

  async onExecute() {
    this.setOutputData(0, null)
  }
}

/**
 * deployContract 节点 - 部署合约
 */
class DeployContractNode extends LGraphNode {
  static title = 'deployContract'
  static desc = 'Deploy a contract'

  color = '#3182ce'
  bgcolor = '#2a4365'

  constructor() {
    super()
    this.title = 'deployContract'
    this.addInput('client', 'walletClient')
    this.addInput('abi', 'abi')
    this.addInput('bytecode', 'bytes')
    this.addInput('args', 'array')
    this.addOutput('hash', 'string')
    this.addOutput('address', 'address')
    this.size = [180, 130]
  }

  async onExecute() {
    this.setOutputData(0, null)
    this.setOutputData(1, null)
  }
}

/**
 * Base Placeholder Node for missing actions
 */
class ContractPlaceholderNode extends LGraphNode {
  constructor(title: string, desc: string) {
    super()
    this.title = title
    this.addInput('client', 'publicClient')
    this.properties = { description: desc }
    this.color = '#3182ce'
    this.bgcolor = '#2a4365'
    this.size = [180, 40]
  }
}

export function registerContractNodes() {
  // --- Actions ---
  LiteGraph.registerNodeType('Contract/Actions/readContract', ReadContractNode)
  LiteGraph.registerNodeType('Contract/Actions/writeContract', WriteContractNode)
  LiteGraph.registerNodeType('Contract/Actions/simulateContract', SimulateContractNode)
  LiteGraph.registerNodeType('Contract/Actions/deployContract', DeployContractNode)
  LiteGraph.registerNodeType('Contract/Actions/multicall', class extends ContractPlaceholderNode { constructor() { super('multicall', 'Execute multiple calls') } })

  // --- Event ---
  LiteGraph.registerNodeType('Contract/Event/getContractEvents', GetContractEventsNode)
  LiteGraph.registerNodeType('Contract/Event/createContractEventFilter', class extends ContractPlaceholderNode { constructor() { super('createContractEventFilter', 'Create filter for contract events') } })
  LiteGraph.registerNodeType('Contract/Event/watchContractEvent', class extends ContractPlaceholderNode { constructor() { super('watchContractEvent', 'Watch for contract events') } })

  // --- Utils ---
  LiteGraph.registerNodeType('Contract/Utils/decodeFunctionData', class extends ContractPlaceholderNode { constructor() { super('decodeFunctionData', 'Decode function data') } })
  LiteGraph.registerNodeType('Contract/Utils/decodeFunctionResult', class extends ContractPlaceholderNode { constructor() { super('decodeFunctionResult', 'Decode function result') } })
  LiteGraph.registerNodeType('Contract/Utils/encodeDeployData', class extends ContractPlaceholderNode { constructor() { super('encodeDeployData', 'Encode deployment data') } })
  LiteGraph.registerNodeType('Contract/Utils/encodeErrorResult', class extends ContractPlaceholderNode { constructor() { super('encodeErrorResult', 'Encode error result') } })
  LiteGraph.registerNodeType('Contract/Utils/encodeFunctionData', class extends ContractPlaceholderNode { constructor() { super('encodeFunctionData', 'Encode function data') } })
  LiteGraph.registerNodeType('Contract/Utils/encodeFunctionResult', class extends ContractPlaceholderNode { constructor() { super('encodeFunctionResult', 'Encode function result') } })
}

export {
  ReadContractNode,
  WriteContractNode,
  SimulateContractNode,
  GetContractEventsNode,
  DeployContractNode
}
