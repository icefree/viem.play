import { LiteGraph } from 'litegraph.js'
import { ToAccountNode } from './ToAccountNode'
import { PrivateKeyToAccountNode } from './PrivateKeyToAccountNode'
import { MnemonicToAccountNode } from './MnemonicToAccountNode'
import { GeneratePrivateKeyNode } from './GeneratePrivateKeyNode'
import { GenerateMnemonicNode } from './GenerateMnemonicNode'
import { HdKeyToAccountNode } from './HdKeyToAccountNode'
import { LocalToAccountNode } from './LocalToAccountNode'
import { ParseAccountNode } from './ParseAccountNode'

export function registerAccountNodes() {
  // --- JSON-RPC Account ---
  LiteGraph.registerNodeType('Accounts/JSON-RPC/toAccount', ToAccountNode)

  // --- Local Account ---
  LiteGraph.registerNodeType('Accounts/Local/privateKeyToAccount', PrivateKeyToAccountNode)
  LiteGraph.registerNodeType('Accounts/Local/mnemonicToAccount', MnemonicToAccountNode)
  LiteGraph.registerNodeType('Accounts/Local/hdKeyToAccount', HdKeyToAccountNode)
  LiteGraph.registerNodeType('Accounts/Local/toAccount', LocalToAccountNode)

  // --- Utils ---
  LiteGraph.registerNodeType('Accounts/Utils/generatePrivateKey', GeneratePrivateKeyNode)
  LiteGraph.registerNodeType('Accounts/Utils/generateMnemonic', GenerateMnemonicNode)
  LiteGraph.registerNodeType('Accounts/Utils/parseAccount', ParseAccountNode)
}

export {
  PrivateKeyToAccountNode,
  MnemonicToAccountNode,
  GeneratePrivateKeyNode,
  GenerateMnemonicNode,
  ToAccountNode,
  HdKeyToAccountNode,
  LocalToAccountNode,
  ParseAccountNode
}
