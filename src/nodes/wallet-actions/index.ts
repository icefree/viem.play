import { LiteGraph } from 'litegraph.js'
import { SendTransactionNode } from './SendTransactionNode'
import { SignMessageNode } from './SignMessageNode'
import { SignTypedDataNode } from './SignTypedDataNode'
import { SwitchChainNode } from './SwitchChainNode'
import { GetAddressesNode } from './GetAddressesNode'
import { WalletActionPlaceholderNode } from './WalletActionPlaceholderNode'

export function registerWalletActionNodes() {
  // --- Transaction ---
  LiteGraph.registerNodeType('Wallet Actions/Transaction/sendTransaction', SendTransactionNode)
  LiteGraph.registerNodeType('Wallet Actions/Transaction/sendRawTransaction', class extends WalletActionPlaceholderNode { constructor() { super('sendRawTransaction', 'Send a raw transaction') } })
  LiteGraph.registerNodeType('Wallet Actions/Transaction/writeContract', class extends WalletActionPlaceholderNode { constructor() { super('writeContract', 'Write to a contract') } })
  
  // --- Message ---
  LiteGraph.registerNodeType('Wallet Actions/Message/signMessage', SignMessageNode)
  LiteGraph.registerNodeType('Wallet Actions/Message/signTypedData', SignTypedDataNode)
  LiteGraph.registerNodeType('Wallet Actions/Message/verifyMessage', class extends WalletActionPlaceholderNode { constructor() { super('verifyMessage', 'Verify a message signature') } })
  LiteGraph.registerNodeType('Wallet Actions/Message/verifyTypedData', class extends WalletActionPlaceholderNode { constructor() { super('verifyTypedData', 'Verify typed data signature') } })

  // --- Network ---
  LiteGraph.registerNodeType('Wallet Actions/Network/switchChain', SwitchChainNode)
  LiteGraph.registerNodeType('Wallet Actions/Network/addChain', class extends WalletActionPlaceholderNode { constructor() { super('addChain', 'Add a new chain to wallet') } })
  LiteGraph.registerNodeType('Wallet Actions/Network/watchAsset', class extends WalletActionPlaceholderNode { constructor() { super('watchAsset', 'Watch an asset') } })

  // --- Account ---
  LiteGraph.registerNodeType('Wallet Actions/Account/getAddresses', GetAddressesNode)
  LiteGraph.registerNodeType('Wallet Actions/Account/getPermissions', class extends WalletActionPlaceholderNode { constructor() { super('getPermissions', 'Get wallet permissions') } })
  LiteGraph.registerNodeType('Wallet Actions/Account/requestPermissions', class extends WalletActionPlaceholderNode { constructor() { super('requestPermissions', 'Request wallet permissions') } })
}

export {
  SendTransactionNode,
  SignMessageNode,
  SignTypedDataNode,
  SwitchChainNode,
  GetAddressesNode,
  WalletActionPlaceholderNode
}
