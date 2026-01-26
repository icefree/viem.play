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

/**
 * Base Placeholder Node for missing actions
 */
class TestActionPlaceholderNode extends LGraphNode {
  constructor(title: string, desc: string) {
    super()
    this.title = title
    this.addInput('client', 'testClient')
    this.properties = { description: desc }
    this.color = '#805ad5'
    this.bgcolor = '#553c9a'
    this.size = [180, 40]
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) return
    ctx.font = '10px Arial'
    ctx.fillStyle = '#666'
    ctx.fillText('Placeholder', 10, 30)
  }
}

export function registerTestActionNodes() {
  // --- Account ---
  LiteGraph.registerNodeType('Test Actions/Account/setBalance', SetBalanceNode)
  LiteGraph.registerNodeType('Test Actions/Account/impersonateAccount', ImpersonateAccountNode)
  LiteGraph.registerNodeType('Test Actions/Account/stopImpersonatingAccount', class extends TestActionPlaceholderNode { constructor() { super('stopImpersonatingAccount', 'Stop impersonating an account') } })
  LiteGraph.registerNodeType('Test Actions/Account/setCode', class extends TestActionPlaceholderNode { constructor() { super('setCode', 'Set code of a contract') } })
  LiteGraph.registerNodeType('Test Actions/Account/setNonce', class extends TestActionPlaceholderNode { constructor() { super('setNonce', 'Set nonce of an account') } })
  LiteGraph.registerNodeType('Test Actions/Account/setStorageAt', class extends TestActionPlaceholderNode { constructor() { super('setStorageAt', 'Set storage selection at a contract address') } })

  // --- Block ---
  LiteGraph.registerNodeType('Test Actions/Block/mine', MineNode)
  LiteGraph.registerNodeType('Test Actions/Block/setNextBlockTimestamp', SetNextBlockTimestampNode)
  LiteGraph.registerNodeType('Test Actions/Block/getBlockBadHash', class extends TestActionPlaceholderNode { constructor() { super('getBlockBadHash', 'Get block bad hash') } })
  LiteGraph.registerNodeType('Test Actions/Block/setBlockTimestampInterval', class extends TestActionPlaceholderNode { constructor() { super('setBlockTimestampInterval', 'Set block timestamp interval') } })
  LiteGraph.registerNodeType('Test Actions/Block/setNextBlockBaseFeePerGas', class extends TestActionPlaceholderNode { constructor() { super('setNextBlockBaseFeePerGas', 'Set next block base fee per gas') } })

  // --- State ---
  LiteGraph.registerNodeType('Test Actions/State/snapshot', SnapshotNode)
  LiteGraph.registerNodeType('Test Actions/State/revert', RevertNode)
  LiteGraph.registerNodeType('Test Actions/State/reset', class extends TestActionPlaceholderNode { constructor() { super('reset', 'Reset chain state') } })
  LiteGraph.registerNodeType('Test Actions/State/dropTransaction', class extends TestActionPlaceholderNode { constructor() { super('dropTransaction', 'Drop a pending transaction') } })
  LiteGraph.registerNodeType('Test Actions/State/dumpState', class extends TestActionPlaceholderNode { constructor() { super('dumpState', 'Dump chain state') } })
  LiteGraph.registerNodeType('Test Actions/State/loadState', class extends TestActionPlaceholderNode { constructor() { super('loadState', 'Load chain state') } })

  // --- Other ---
  LiteGraph.registerNodeType('Test Actions/Other/inspect', class extends TestActionPlaceholderNode { constructor() { super('inspect', 'Inspect a transaction') } })
  LiteGraph.registerNodeType('Test Actions/Other/setLoggingEnabled', class extends TestActionPlaceholderNode { constructor() { super('setLoggingEnabled', 'Enable/disable logging') } })
  LiteGraph.registerNodeType('Test Actions/Other/setRpcUrl', class extends TestActionPlaceholderNode { constructor() { super('setRpcUrl', 'Set RPC URL') } })
}

export {
  SetBalanceNode,
  MineNode,
  ImpersonateAccountNode,
  SetNextBlockTimestampNode,
  SnapshotNode,
  RevertNode
}
