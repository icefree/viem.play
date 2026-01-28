import { LiteGraph } from 'litegraph.js'
import { GetEnsAddressNode } from './GetEnsAddressNode'
import { GetEnsNameNode } from './GetEnsNameNode'
import { GetEnsAvatarNode } from './GetEnsAvatarNode'
import { GetEnsTextNode } from './GetEnsTextNode'
import { EnsPlaceholderNode } from './EnsPlaceholderNode'

export function registerEnsNodes() {
  // --- Actions ---
  LiteGraph.registerNodeType('ENS/Actions/getEnsAddress', GetEnsAddressNode)
  LiteGraph.registerNodeType('ENS/Actions/getEnsName', GetEnsNameNode)
  LiteGraph.registerNodeType('ENS/Actions/getEnsAvatar', GetEnsAvatarNode)
  LiteGraph.registerNodeType('ENS/Actions/getEnsText', GetEnsTextNode)
  LiteGraph.registerNodeType('ENS/Actions/getEnsResolver', class extends EnsPlaceholderNode { constructor() { super('getEnsResolver', 'Get ENS resolver') } })

  // --- Utils ---
  LiteGraph.registerNodeType('ENS/Utils/labelhash', class extends EnsPlaceholderNode { constructor() { super('labelhash', 'Hash an ENS label') } })
  LiteGraph.registerNodeType('ENS/Utils/namehash', class extends EnsPlaceholderNode { constructor() { super('namehash', 'Hash an ENS name') } })
  LiteGraph.registerNodeType('ENS/Utils/normalize', class extends EnsPlaceholderNode { constructor() { super('normalize', 'Normalize an ENS name') } })
}

export {
  GetEnsAddressNode,
  GetEnsNameNode,
  GetEnsAvatarNode,
  GetEnsTextNode,
  EnsPlaceholderNode
}
