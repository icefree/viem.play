import { LiteGraph } from 'litegraph.js'
import { ToAccountNode } from './ToAccountNode'
import { PrivateKeyToAccountNode } from './PrivateKeyToAccountNode'
import { MnemonicToAccountNode } from './MnemonicToAccountNode'
import { GeneratePrivateKeyNode } from './GeneratePrivateKeyNode'
import { GenerateMnemonicNode } from './GenerateMnemonicNode'
import { AccountPlaceholderNode } from './AccountPlaceholderNode'

export function registerAccountNodes() {
  // --- JSON-RPC Account ---
  LiteGraph.registerNodeType('Accounts/JSON-RPC/toAccount', ToAccountNode)

  // --- Local Account ---
  LiteGraph.registerNodeType('Accounts/Local/privateKeyToAccount', PrivateKeyToAccountNode)
  LiteGraph.registerNodeType('Accounts/Local/mnemonicToAccount', MnemonicToAccountNode)
  LiteGraph.registerNodeType('Accounts/Local/hdKeyToAccount', class extends AccountPlaceholderNode { constructor() { super('hdKeyToAccount', 'Create account from HD Key') } })
  LiteGraph.registerNodeType('Accounts/Local/toAccount', class extends AccountPlaceholderNode { constructor() { super('toAccount', 'Create a custom Local Account') } })

  // --- Utils ---
  LiteGraph.registerNodeType('Accounts/Utils/generatePrivateKey', GeneratePrivateKeyNode)
  LiteGraph.registerNodeType('Accounts/Utils/generateMnemonic', GenerateMnemonicNode)
  LiteGraph.registerNodeType('Accounts/Utils/parseAccount', class extends AccountPlaceholderNode { constructor() { super('parseAccount', 'Parse an account') } })
}

export {
  PrivateKeyToAccountNode,
  MnemonicToAccountNode,
  GeneratePrivateKeyNode,
  GenerateMnemonicNode,
  ToAccountNode,
  AccountPlaceholderNode
}
