import { LiteGraph } from 'litegraph.js'
import { SetBalanceNode } from './SetBalanceNode'
import { MineNode } from './MineNode'
import { ImpersonateAccountNode } from './ImpersonateAccountNode'
import { SetNextBlockTimestampNode } from './SetNextBlockTimestampNode'
import { SnapshotNode } from './SnapshotNode'
import { RevertNode } from './RevertNode'
import { TestActionPlaceholderNode } from './TestActionPlaceholderNode'

export function registerTestActionNodes() {
  // --- Account ---
  LiteGraph.registerNodeType('Test Actions/Account/setBalance', SetBalanceNode)
  LiteGraph.registerNodeType('Test Actions/Account/impersonateAccount', ImpersonateAccountNode)
  LiteGraph.registerNodeType('Test Actions/Account/stopImpersonatingAccount', class extends TestActionPlaceholderNode { constructor() { super('stopImpersonatingAccount', 'Stop impersonating an account') } })
  LiteGraph.registerNodeType('Test Actions/Account/setCode', class extends TestActionPlaceholderNode { constructor() { super('setCode', 'Set bytecode of a contract') } })
  LiteGraph.registerNodeType('Test Actions/Account/setStorageAt', class extends TestActionPlaceholderNode { constructor() { super('setStorageAt', 'Set storage at an address') } })

  // --- Block ---
  LiteGraph.registerNodeType('Test Actions/Block/mine', MineNode)
  LiteGraph.registerNodeType('Test Actions/Block/setIntervalMining', class extends TestActionPlaceholderNode { constructor() { super('setIntervalMining', 'Set automatic mining interval') } })
  LiteGraph.registerNodeType('Test Actions/Block/setNextBlockTimestamp', SetNextBlockTimestampNode)
  LiteGraph.registerNodeType('Test Actions/Block/setBlockTimestampInterval', class extends TestActionPlaceholderNode { constructor() { super('setBlockTimestampInterval', 'Set block timestamp interval') } })

  // --- Network ---
  LiteGraph.registerNodeType('Test Actions/Network/dropTransaction', class extends TestActionPlaceholderNode { constructor() { super('dropTransaction', 'Remove transaction from mempool') } })
  LiteGraph.registerNodeType('Test Actions/Network/reset', class extends TestActionPlaceholderNode { constructor() { super('reset', 'Reset forking state') } })
  LiteGraph.registerNodeType('Test Actions/Network/setRpcUrl', class extends TestActionPlaceholderNode { constructor() { super('setRpcUrl', 'Set RPC URL') } })

  // --- State ---
  LiteGraph.registerNodeType('Test Actions/State/snapshot', SnapshotNode)
  LiteGraph.registerNodeType('Test Actions/State/revert', RevertNode)
  
  // --- Transaction ---
  LiteGraph.registerNodeType('Test Actions/Transaction/sendUnsignedTransaction', class extends TestActionPlaceholderNode { constructor() { super('sendUnsignedTransaction', 'Send transaction without signature') } })
}

export {
  SetBalanceNode,
  MineNode,
  ImpersonateAccountNode,
  SetNextBlockTimestampNode,
  SnapshotNode,
  RevertNode,
  TestActionPlaceholderNode
}
