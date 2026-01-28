import { LiteGraph } from 'litegraph.js'
import { GetBalanceNode } from './GetBalanceNode'
import { GetBlockNumberNode } from './GetBlockNumberNode'
import { GetGasPriceNode } from './GetGasPriceNode'
import { GetBlockNode } from './GetBlockNode'
import { GetTransactionCountNode } from './GetTransactionCountNode'
import { GetBlockTransactionCountNode } from './GetBlockTransactionCountNode'
import { WatchBlockNumberNode } from './WatchBlockNumberNode'
import { WatchBlocksNode } from './WatchBlocksNode'
import { PublicActionPlaceholderNode } from './PublicActionPlaceholderNode'

export function registerPublicActionNodes() {
  // --- Account ---
  LiteGraph.registerNodeType('Public Actions/Account/getBalance', GetBalanceNode)
  LiteGraph.registerNodeType('Public Actions/Account/getTransactionCount', GetTransactionCountNode)
  LiteGraph.registerNodeType('Public Actions/Account/getBytecode', class extends PublicActionPlaceholderNode { constructor() { super('getBytecode', 'Get bytecode of a contract') } })
  LiteGraph.registerNodeType('Public Actions/Account/getStorageAt', class extends PublicActionPlaceholderNode { constructor() { super('getStorageAt', 'Get storage selection at a contract address') } })
  LiteGraph.registerNodeType('Public Actions/Account/getProof', class extends PublicActionPlaceholderNode { constructor() { super('getProof', 'Get account and storage proof') } })

  // --- Block ---
  LiteGraph.registerNodeType('Public Actions/Block/getBlock', GetBlockNode)
  LiteGraph.registerNodeType('Public Actions/Block/getBlockNumber', GetBlockNumberNode)
  LiteGraph.registerNodeType('Public Actions/Block/getBlockTransactionCount', GetBlockTransactionCountNode)
  LiteGraph.registerNodeType('Public Actions/Block/watchBlocks', WatchBlocksNode)
  LiteGraph.registerNodeType('Public Actions/Block/watchBlockNumber', WatchBlockNumberNode)

  // --- Transaction ---
  LiteGraph.registerNodeType('Public Actions/Transaction/getTransaction', class extends PublicActionPlaceholderNode { constructor() { super('getTransaction', 'Get transaction information') } })
  LiteGraph.registerNodeType('Public Actions/Transaction/getTransactionReceipt', class extends PublicActionPlaceholderNode { constructor() { super('getTransactionReceipt', 'Get transaction receipt') } })
  LiteGraph.registerNodeType('Public Actions/Transaction/waitForTransactionReceipt', class extends PublicActionPlaceholderNode { constructor() { super('waitForTransactionReceipt', 'Wait for transaction receipt') } })
  LiteGraph.registerNodeType('Public Actions/Transaction/watchPendingTransactions', class extends PublicActionPlaceholderNode { constructor() { super('watchPendingTransactions', 'Watch for pending transactions') } })
  LiteGraph.registerNodeType('Public Actions/Transaction/call', class extends PublicActionPlaceholderNode { constructor() { super('call', 'Executes a new message call') } })
  LiteGraph.registerNodeType('Public Actions/Transaction/estimateGas', class extends PublicActionPlaceholderNode { constructor() { super('estimateGas', 'Estimate gas for a transaction') } })
  LiteGraph.registerNodeType('Public Actions/Transaction/createPendingTransactionFilter', class extends PublicActionPlaceholderNode { constructor() { super('createPendingTransactionFilter', 'Create filter for pending transactions') } })

  // --- Event ---
  LiteGraph.registerNodeType('Public Actions/Event/getLogs', class extends PublicActionPlaceholderNode { constructor() { super('getLogs', 'Get historical logs') } })
  LiteGraph.registerNodeType('Public Actions/Event/watchEvent', class extends PublicActionPlaceholderNode { constructor() { super('watchEvent', 'Watch for events') } })
  LiteGraph.registerNodeType('Public Actions/Event/createEventFilter', class extends PublicActionPlaceholderNode { constructor() { super('createEventFilter', 'Create filter for events') } })
  LiteGraph.registerNodeType('Public Actions/Event/getFilterChanges', class extends PublicActionPlaceholderNode { constructor() { super('getFilterChanges', 'Get changes since last poll') } })
  LiteGraph.registerNodeType('Public Actions/Event/getFilterLogs', class extends PublicActionPlaceholderNode { constructor() { super('getFilterLogs', 'Get logs matching a filter') } })
  LiteGraph.registerNodeType('Public Actions/Event/uninstallFilter', class extends PublicActionPlaceholderNode { constructor() { super('uninstallFilter', 'Uninstall a filter') } })

  // --- Other ---
  LiteGraph.registerNodeType('Public Actions/Other/getGasPrice', GetGasPriceNode)
  LiteGraph.registerNodeType('Public Actions/Other/getChainId', class extends PublicActionPlaceholderNode { constructor() { super('getChainId', 'Get chain ID') } })
  LiteGraph.registerNodeType('Public Actions/Other/getFeeHistory', class extends PublicActionPlaceholderNode { constructor() { super('getFeeHistory', 'Get fee history') } })
  LiteGraph.registerNodeType('Public Actions/Other/estimateMaxPriorityFeePerGas', class extends PublicActionPlaceholderNode { constructor() { super('estimateMaxPriorityFeePerGas', 'Estimate max priority fee per gas') } })
  LiteGraph.registerNodeType('Public Actions/Other/estimateFeesPerGas', class extends PublicActionPlaceholderNode { constructor() { super('estimateFeesPerGas', 'Estimate fees per gas') } })
  LiteGraph.registerNodeType('Public Actions/Other/prepareTransactionRequest', class extends PublicActionPlaceholderNode { constructor() { super('prepareTransactionRequest', 'Prepare transaction request') } })
}

export { 
  GetBalanceNode, 
  GetBlockNumberNode, 
  GetGasPriceNode, 
  GetBlockNode, 
  GetTransactionCountNode,
  GetBlockTransactionCountNode,
  WatchBlockNumberNode,
  WatchBlocksNode,
  PublicActionPlaceholderNode
}
