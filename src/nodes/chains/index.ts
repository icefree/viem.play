import { LiteGraph } from 'litegraph.js'
import { ChainNode } from './ChainNode'
import { ChainIdNode } from './ChainIdNode'
import { ChainInfoNode } from './ChainInfoNode'

export function registerChainNodes() {
  LiteGraph.registerNodeType('Chains/Chain', ChainNode)
  LiteGraph.registerNodeType('Chains/ChainId', ChainIdNode)
  LiteGraph.registerNodeType('Chains/ChainInfo', ChainInfoNode)
}

export { ChainNode, ChainIdNode, ChainInfoNode }
export * from './constants'
