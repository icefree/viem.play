import { LiteGraph } from 'litegraph.js'
import { GetEnsAddressNode } from './GetEnsAddressNode'
import { GetEnsNameNode } from './GetEnsNameNode'
import { GetEnsAvatarNode } from './GetEnsAvatarNode'
import { GetEnsTextNode } from './GetEnsTextNode'
import { GetEnsResolverNode } from './GetEnsResolverNode'
import { LabelhashNode } from './LabelhashNode'
import { NamehashNode } from './NamehashNode'
import { NormalizeNode } from './NormalizeNode'

export function registerEnsNodes() {
  // --- Actions ---
  LiteGraph.registerNodeType('ENS/Actions/getEnsAddress', GetEnsAddressNode)
  LiteGraph.registerNodeType('ENS/Actions/getEnsName', GetEnsNameNode)
  LiteGraph.registerNodeType('ENS/Actions/getEnsAvatar', GetEnsAvatarNode)
  LiteGraph.registerNodeType('ENS/Actions/getEnsText', GetEnsTextNode)
  LiteGraph.registerNodeType('ENS/Actions/getEnsResolver', GetEnsResolverNode)

  // --- Utils ---
  LiteGraph.registerNodeType('ENS/Utils/labelhash', LabelhashNode)
  LiteGraph.registerNodeType('ENS/Utils/namehash', NamehashNode)
  LiteGraph.registerNodeType('ENS/Utils/normalize', NormalizeNode)
}

export {
  GetEnsAddressNode,
  GetEnsNameNode,
  GetEnsAvatarNode,
  GetEnsTextNode,
  GetEnsResolverNode,
  LabelhashNode,
  NamehashNode,
  NormalizeNode
}
