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

export function registerContractNodes() {
  LiteGraph.registerNodeType('Contract/readContract', ReadContractNode)
  LiteGraph.registerNodeType('Contract/writeContract', WriteContractNode)
  LiteGraph.registerNodeType('Contract/simulateContract', SimulateContractNode)
  LiteGraph.registerNodeType('Contract/getContractEvents', GetContractEventsNode)
  LiteGraph.registerNodeType('Contract/deployContract', DeployContractNode)
}

export {
  ReadContractNode,
  WriteContractNode,
  SimulateContractNode,
  GetContractEventsNode,
  DeployContractNode
}
