import { LGraphNode, LiteGraph } from 'litegraph.js'

/**
 * setBalance 节点 - 设置账户余额 (Test Only)
 */
class SetBalanceNode extends LGraphNode {
  static title = 'setBalance'
  static desc = 'Set account balance (Anvil/Hardhat only)'

  color = '#805ad5'
  bgcolor = '#553c9a'

  constructor() {
    super()
    this.addInput('client', 'testClient')
    this.addInput('address', 'address')
    this.addInput('value', 'bigint')
    this.addOutput('success', 'boolean')
    this.size = [180, 90]
  }

  async onExecute() {
    this.setOutputData(0, null)
  }
}

/**
 * mine 节点 - 挖矿区块 (Test Only)
 */
class MineNode extends LGraphNode {
  static title = 'mine'
  static desc = 'Mine blocks (Anvil/Hardhat only)'

  color = '#805ad5'
  bgcolor = '#553c9a'

  constructor() {
    super()
    this.addInput('client', 'testClient')
    this.addInput('blocks', 'number')
    this.addOutput('success', 'boolean')
    this.size = [160, 70]
  }

  async onExecute() {
    this.setOutputData(0, null)
  }
}

/**
 * impersonateAccount 节点 - 模拟账户 (Test Only)
 */
class ImpersonateAccountNode extends LGraphNode {
  static title = 'impersonateAccount'
  static desc = 'Impersonate an account (Anvil/Hardhat only)'

  color = '#805ad5'
  bgcolor = '#553c9a'

  constructor() {
    super()
    this.addInput('client', 'testClient')
    this.addInput('address', 'address')
    this.addOutput('success', 'boolean')
    this.size = [200, 70]
  }

  async onExecute() {
    this.setOutputData(0, null)
  }
}

/**
 * setNextBlockTimestamp 节点 - 设置下一个区块时间戳
 */
class SetNextBlockTimestampNode extends LGraphNode {
  static title = 'setNextBlockTimestamp'
  static desc = 'Set next block timestamp'

  color = '#805ad5'
  bgcolor = '#553c9a'

  constructor() {
    super()
    this.addInput('client', 'testClient')
    this.addInput('timestamp', 'bigint')
    this.addOutput('success', 'boolean')
    this.size = [200, 70]
  }

  async onExecute() {
    this.setOutputData(0, null)
  }
}

/**
 * snapshot 节点 - 创建状态快照
 */
class SnapshotNode extends LGraphNode {
  static title = 'snapshot'
  static desc = 'Create a state snapshot'

  color = '#805ad5'
  bgcolor = '#553c9a'

  constructor() {
    super()
    this.addInput('client', 'testClient')
    this.addOutput('snapshotId', 'string')
    this.size = [160, 50]
  }

  async onExecute() {
    this.setOutputData(0, null)
  }
}

/**
 * revert 节点 - 恢复到快照
 */
class RevertNode extends LGraphNode {
  static title = 'revert'
  static desc = 'Revert to a snapshot'

  color = '#805ad5'
  bgcolor = '#553c9a'

  constructor() {
    super()
    this.addInput('client', 'testClient')
    this.addInput('snapshotId', 'string')
    this.addOutput('success', 'boolean')
    this.size = [160, 70]
  }

  async onExecute() {
    this.setOutputData(0, null)
  }
}

export function registerTestActionNodes() {
  LiteGraph.registerNodeType('Test Actions/setBalance', SetBalanceNode)
  LiteGraph.registerNodeType('Test Actions/mine', MineNode)
  LiteGraph.registerNodeType('Test Actions/impersonateAccount', ImpersonateAccountNode)
  LiteGraph.registerNodeType('Test Actions/setNextBlockTimestamp', SetNextBlockTimestampNode)
  LiteGraph.registerNodeType('Test Actions/snapshot', SnapshotNode)
  LiteGraph.registerNodeType('Test Actions/revert', RevertNode)
}

export {
  SetBalanceNode,
  MineNode,
  ImpersonateAccountNode,
  SetNextBlockTimestampNode,
  SnapshotNode,
  RevertNode
}
