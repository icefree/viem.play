import { LiteGraph } from 'litegraph.js'
import { GetBalanceNode } from './GetBalanceNode'
import { GetBlockNumberNode } from './GetBlockNumberNode'
import { GetGasPriceNode } from './GetGasPriceNode'
import { GetBlockNode } from './GetBlockNode'
import { GetTransactionCountNode } from './GetTransactionCountNode'
import { GetBlockTransactionCountNode } from './GetBlockTransactionCountNode'
import { WatchBlockNumberNode } from './WatchBlockNumberNode'
import { WatchBlocksNode } from './WatchBlocksNode'
import { WaitForTransactionReceiptNode } from './WaitForTransactionReceiptNode'
import { GetBytecodeNode } from './GetBytecodeNode'
import { GetStorageAtNode } from './GetStorageAtNode'
import { GetProofNode } from './GetProofNode'
import { GetTransactionNode } from './GetTransactionNode'
import { GetTransactionReceiptNode } from './GetTransactionReceiptNode'
import { WatchPendingTransactionsNode } from './WatchPendingTransactionsNode'
import { CallNode } from './CallNode'
import { EstimateGasNode } from './EstimateGasNode'
import { CreatePendingTransactionFilterNode } from './CreatePendingTransactionFilterNode'
import { GetLogsNode } from './GetLogsNode'
import { WatchEventNode } from './WatchEventNode'
import { CreateEventFilterNode } from './CreateEventFilterNode'
import { GetFilterChangesNode } from './GetFilterChangesNode'
import { GetFilterLogsNode } from './GetFilterLogsNode'
import { UninstallFilterNode } from './UninstallFilterNode'
import { GetChainIdNode } from './GetChainIdNode'
import { GetFeeHistoryNode } from './GetFeeHistoryNode'
import { EstimateMaxPriorityFeePerGasNode } from './EstimateMaxPriorityFeePerGasNode'
import { EstimateFeesPerGasNode } from './EstimateFeesPerGasNode'
import { PrepareTransactionRequestNode } from './PrepareTransactionRequestNode'

export function registerPublicActionNodes() {
  // --- Account ---
  LiteGraph.registerNodeType('Public Actions/Account/getBalance', GetBalanceNode)
  LiteGraph.registerNodeType('Public Actions/Account/getTransactionCount', GetTransactionCountNode)
  LiteGraph.registerNodeType('Public Actions/Account/getBytecode', GetBytecodeNode)
  LiteGraph.registerNodeType('Public Actions/Account/getStorageAt', GetStorageAtNode)
  LiteGraph.registerNodeType('Public Actions/Account/getProof', GetProofNode)

  // --- Block ---
  LiteGraph.registerNodeType('Public Actions/Block/getBlock', GetBlockNode)
  LiteGraph.registerNodeType('Public Actions/Block/getBlockNumber', GetBlockNumberNode)
  LiteGraph.registerNodeType('Public Actions/Block/getBlockTransactionCount', GetBlockTransactionCountNode)
  LiteGraph.registerNodeType('Public Actions/Block/watchBlocks', WatchBlocksNode)
  LiteGraph.registerNodeType('Public Actions/Block/watchBlockNumber', WatchBlockNumberNode)

  // --- Transaction ---
  LiteGraph.registerNodeType('Public Actions/Transaction/getTransaction', GetTransactionNode)
  LiteGraph.registerNodeType('Public Actions/Transaction/getTransactionReceipt', GetTransactionReceiptNode)
  LiteGraph.registerNodeType('Public Actions/Transaction/waitForTransactionReceipt', WaitForTransactionReceiptNode)
  LiteGraph.registerNodeType('Public Actions/Transaction/watchPendingTransactions', WatchPendingTransactionsNode)
  LiteGraph.registerNodeType('Public Actions/Transaction/call', CallNode)
  LiteGraph.registerNodeType('Public Actions/Transaction/estimateGas', EstimateGasNode)
  LiteGraph.registerNodeType('Public Actions/Transaction/createPendingTransactionFilter', CreatePendingTransactionFilterNode)

  // --- Event ---
  LiteGraph.registerNodeType('Public Actions/Event/getLogs', GetLogsNode)
  LiteGraph.registerNodeType('Public Actions/Event/watchEvent', WatchEventNode)
  LiteGraph.registerNodeType('Public Actions/Event/createEventFilter', CreateEventFilterNode)
  LiteGraph.registerNodeType('Public Actions/Event/getFilterChanges', GetFilterChangesNode)
  LiteGraph.registerNodeType('Public Actions/Event/getFilterLogs', GetFilterLogsNode)
  LiteGraph.registerNodeType('Public Actions/Event/uninstallFilter', UninstallFilterNode)

  // --- Other ---
  LiteGraph.registerNodeType('Public Actions/Other/getGasPrice', GetGasPriceNode)
  LiteGraph.registerNodeType('Public Actions/Other/getChainId', GetChainIdNode)
  LiteGraph.registerNodeType('Public Actions/Other/getFeeHistory', GetFeeHistoryNode)
  LiteGraph.registerNodeType('Public Actions/Other/estimateMaxPriorityFeePerGas', EstimateMaxPriorityFeePerGasNode)
  LiteGraph.registerNodeType('Public Actions/Other/estimateFeesPerGas', EstimateFeesPerGasNode)
  LiteGraph.registerNodeType('Public Actions/Other/prepareTransactionRequest', PrepareTransactionRequestNode)
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
  WaitForTransactionReceiptNode,
  GetBytecodeNode,
  GetStorageAtNode,
  GetProofNode,
  GetTransactionNode,
  GetTransactionReceiptNode,
  WatchPendingTransactionsNode,
  CallNode,
  EstimateGasNode,
  CreatePendingTransactionFilterNode,
  GetLogsNode,
  WatchEventNode,
  CreateEventFilterNode,
  GetFilterChangesNode,
  GetFilterLogsNode,
  UninstallFilterNode,
  GetChainIdNode,
  GetFeeHistoryNode,
  EstimateMaxPriorityFeePerGasNode,
  EstimateFeesPerGasNode,
  PrepareTransactionRequestNode
}
