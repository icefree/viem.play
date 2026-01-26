// Node registration entry point
import { LiteGraph } from 'litegraph.js'
import { registerCoreNodes } from './core'
import { registerChainNode } from './viem/ChainNode'
import { registerClientNode } from './viem/ClientNode'
import { registerActionNodes } from './viem/actions'

/**
 * 注册所有自定义节点到 LiteGraph
 */
export function registerAllNodes() {
  // Configure LiteGraph defaults
  LiteGraph.clearRegisteredTypes()

  // Register node categories
  registerCoreNodes()
  registerChainNode()
  registerClientNode()
  registerActionNodes()

  console.log('[ViemPlay] All nodes registered')
}

// Re-export for convenience
export * from './core'
export * from './viem/ChainNode'
export * from './viem/ClientNode'
export * from './viem/actions'
