import { LiteGraph } from 'litegraph.js'
import { SendTransactionNode } from './SendTransactionNode'
import { SignMessageNode } from './SignMessageNode'
import { SignTypedDataNode } from './SignTypedDataNode'
import { SwitchChainNode } from './SwitchChainNode'
import { GetAddressesNode } from './GetAddressesNode'
import { SendRawTransactionNode } from './SendRawTransactionNode'
import { WriteContractWalletNode } from './WriteContractWalletNode'
import { VerifyMessageWalletNode } from './VerifyMessageWalletNode'
import { VerifyTypedDataNode } from './VerifyTypedDataNode'
import { AddChainNode } from './AddChainNode'
import { WatchAssetNode } from './WatchAssetNode'
import { GetPermissionsNode } from './GetPermissionsNode'
import { RequestPermissionsNode } from './RequestPermissionsNode'

export function registerWalletActionNodes() {
  // --- Transaction ---
  LiteGraph.registerNodeType('Wallet Actions/Transaction/sendTransaction', SendTransactionNode)
  LiteGraph.registerNodeType('Wallet Actions/Transaction/sendRawTransaction', SendRawTransactionNode)
  LiteGraph.registerNodeType('Wallet Actions/Transaction/writeContract', WriteContractWalletNode)
  
  // --- Message ---
  LiteGraph.registerNodeType('Wallet Actions/Message/signMessage', SignMessageNode)
  LiteGraph.registerNodeType('Wallet Actions/Message/signTypedData', SignTypedDataNode)
  LiteGraph.registerNodeType('Wallet Actions/Message/verifyMessage', VerifyMessageWalletNode)
  LiteGraph.registerNodeType('Wallet Actions/Message/verifyTypedData', VerifyTypedDataNode)

  // --- Network ---
  LiteGraph.registerNodeType('Wallet Actions/Network/switchChain', SwitchChainNode)
  LiteGraph.registerNodeType('Wallet Actions/Network/addChain', AddChainNode)
  LiteGraph.registerNodeType('Wallet Actions/Network/watchAsset', WatchAssetNode)

  // --- Account ---
  LiteGraph.registerNodeType('Wallet Actions/Account/getAddresses', GetAddressesNode)
  LiteGraph.registerNodeType('Wallet Actions/Account/getPermissions', GetPermissionsNode)
  LiteGraph.registerNodeType('Wallet Actions/Account/requestPermissions', RequestPermissionsNode)
}

export {
  SendTransactionNode,
  SignMessageNode,
  SignTypedDataNode,
  SwitchChainNode,
  GetAddressesNode,
  SendRawTransactionNode,
  WriteContractWalletNode,
  VerifyMessageWalletNode,
  VerifyTypedDataNode,
  AddChainNode,
  WatchAssetNode,
  GetPermissionsNode,
  RequestPermissionsNode
}
