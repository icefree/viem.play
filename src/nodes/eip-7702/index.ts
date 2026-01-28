import { LiteGraph } from 'litegraph.js'
import { SignAuthorizationNode } from './SignAuthorizationNode'
import { RecoverAuthorizationAddressNode } from './RecoverAuthorizationAddressNode'
import { VerifyAuthorizationNode } from './VerifyAuthorizationNode'

export function registerEip7702Nodes() {
  LiteGraph.registerNodeType('EIP-7702/signAuthorization', SignAuthorizationNode)
  LiteGraph.registerNodeType('EIP-7702/recoverAuthorizationAddress', RecoverAuthorizationAddressNode)
  LiteGraph.registerNodeType('EIP-7702/verifyAuthorization', VerifyAuthorizationNode)
}

export {
  SignAuthorizationNode,
  RecoverAuthorizationAddressNode,
  VerifyAuthorizationNode
}
