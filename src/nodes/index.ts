// Node registration entry point
// 按照 viem 官网分组组织节点
import { LiteGraph } from 'litegraph.js'

// 导入各分组
import { registerClientNodes } from './clients'
import { registerChainNodes } from './chains'
import { registerPublicActionNodes } from './public-actions'
import { registerUtilityNodes } from './utilities'

/**
 * 注册所有自定义节点到 LiteGraph
 * 
 * 分组结构（参考 viem 官网）:
 * - Clients: PublicClient, WalletClient, TestClient
 * - Chains: Chain, ChainId, ChainInfo
 * - Public Actions: getBalance, getBlockNumber, getGasPrice, getBlock, getTransactionCount
 * - Utilities: Text, Number, Address, Display, Console, formatEther, parseEther
 */
export function registerAllNodes() {
  // Configure LiteGraph defaults
  LiteGraph.clearRegisteredTypes()

  // Register node categories (按 viem 官网顺序)
  registerClientNodes()          // Clients 放在第一位
  registerPublicActionNodes()    // Public Actions
  registerChainNodes()           // Chains
  registerUtilityNodes()         // Utilities

  console.log('[ViemPlay] All nodes registered with viem-style categories')
}

// Re-export for convenience
export * from './clients'
export * from './chains'
export * from './public-actions'
export * from './utilities'
