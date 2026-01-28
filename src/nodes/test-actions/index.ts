import { LiteGraph } from 'litegraph.js'
import { SetBalanceNode } from './SetBalanceNode'
import { MineNode } from './MineNode'
import { ImpersonateAccountNode } from './ImpersonateAccountNode'
import { SetNextBlockTimestampNode } from './SetNextBlockTimestampNode'
import { SnapshotNode } from './SnapshotNode'
import { RevertNode } from './RevertNode'
import { SetCodeNode } from './SetCodeNode'
import { StopImpersonatingAccountNode } from './StopImpersonatingAccountNode'
import { SetStorageAtNode } from './SetStorageAtNode'
import { SetIntervalMiningNode } from './SetIntervalMiningNode'
import { SetBlockTimestampIntervalNode } from './SetBlockTimestampIntervalNode'
import { DropTransactionNode } from './DropTransactionNode'
import { ResetForkNode } from './ResetForkNode'
import { SetRpcUrlNode } from './SetRpcUrlNode'
import { SendUnsignedTransactionNode } from './SendUnsignedTransactionNode'

export function registerTestActionNodes() {
  // --- Account ---
  LiteGraph.registerNodeType('Test Actions/Account/setBalance', SetBalanceNode)
  LiteGraph.registerNodeType('Test Actions/Account/impersonateAccount', ImpersonateAccountNode)
  LiteGraph.registerNodeType('Test Actions/Account/stopImpersonatingAccount', StopImpersonatingAccountNode)
  LiteGraph.registerNodeType('Test Actions/Account/setCode', SetCodeNode)
  LiteGraph.registerNodeType('Test Actions/Account/setStorageAt', SetStorageAtNode)

  // --- Block ---
  LiteGraph.registerNodeType('Test Actions/Block/mine', MineNode)
  LiteGraph.registerNodeType('Test Actions/Block/setIntervalMining', SetIntervalMiningNode)
  LiteGraph.registerNodeType('Test Actions/Block/setNextBlockTimestamp', SetNextBlockTimestampNode)
  LiteGraph.registerNodeType('Test Actions/Block/setBlockTimestampInterval', SetBlockTimestampIntervalNode)

  // --- Network ---
  LiteGraph.registerNodeType('Test Actions/Network/dropTransaction', DropTransactionNode)
  LiteGraph.registerNodeType('Test Actions/Network/reset', ResetForkNode)
  LiteGraph.registerNodeType('Test Actions/Network/setRpcUrl', SetRpcUrlNode)

  // --- State ---
  LiteGraph.registerNodeType('Test Actions/State/snapshot', SnapshotNode)
  LiteGraph.registerNodeType('Test Actions/State/revert', RevertNode)
  
  // --- Transaction ---
  LiteGraph.registerNodeType('Test Actions/Transaction/sendUnsignedTransaction', SendUnsignedTransactionNode)
}

export {
  SetBalanceNode,
  MineNode,
  ImpersonateAccountNode,
  SetNextBlockTimestampNode,
  SnapshotNode,
  RevertNode,
  SetCodeNode,
  StopImpersonatingAccountNode,
  SetStorageAtNode,
  SetIntervalMiningNode,
  SetBlockTimestampIntervalNode,
  DropTransactionNode,
  ResetForkNode,
  SetRpcUrlNode,
  SendUnsignedTransactionNode
}
