import { LiteGraph } from 'litegraph.js'
import { CreateSiweMessageNode } from './CreateSiweMessageNode'
import { VerifySiweMessageNode } from './VerifySiweMessageNode'
import { ParseSiweMessageNode } from './ParseSiweMessageNode'

export function registerSiweNodes() {
  LiteGraph.registerNodeType('SIWE/createSiweMessage', CreateSiweMessageNode)
  LiteGraph.registerNodeType('SIWE/verifySiweMessage', VerifySiweMessageNode)
  LiteGraph.registerNodeType('SIWE/parseSiweMessage', ParseSiweMessageNode)
}

export {
  CreateSiweMessageNode,
  VerifySiweMessageNode,
  ParseSiweMessageNode
}
