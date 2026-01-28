import { LiteGraph } from 'litegraph.js'
import { TermsNode } from './TermsNode'
import { UnitsNode } from './UnitsNode'
import { ChainIdsNode } from './ChainIdsNode'

export function registerGlossaryNodes() {
  LiteGraph.registerNodeType('Glossary/Terms', TermsNode)
  LiteGraph.registerNodeType('Glossary/Units', UnitsNode)
  LiteGraph.registerNodeType('Glossary/ChainIds', ChainIdsNode)
}

export {
  TermsNode,
  UnitsNode,
  ChainIdsNode
}
