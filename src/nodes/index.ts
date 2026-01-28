// Node registration entry point
// 按照 viem 官网分组组织节点 (完整版)
import { LiteGraph } from 'litegraph.js'
import { installAutoNodePairing } from './auto-pair'

// 导入所有分组
import { registerClientNodes } from './clients'
import { registerPublicActionNodes } from './public-actions'
import { registerWalletActionNodes } from './wallet-actions'
import { registerTestActionNodes } from './test-actions'
import { registerAccountNodes } from './accounts'
import { registerChainNodes } from './chains'
import { registerContractNodes } from './contract'
import { registerEnsNodes } from './ens'
import { registerSiweNodes } from './siwe'
import { registerAbiNodes } from './abi'
import { registerEip7702Nodes } from './eip-7702'
import { registerUtilityNodes } from './utilities'
import { registerGlossaryNodes } from './glossary'
import { registerControlNodes } from './control'

/**
 * 注册所有自定义节点到 LiteGraph
 * 
 * 完整分组结构（参考 viem 官网）:
 * 1.  Clients: PublicClient, WalletClient, TestClient
 * 2.  Public Actions: getBalance, getBlockNumber, getGasPrice, getBlock, getTransactionCount
 * 3.  Wallet Actions: sendTransaction, signMessage, signTypedData, switchChain, getAddresses
 * 4.  Test Actions: setBalance, mine, impersonateAccount, snapshot, revert
 * 5.  Accounts: privateKeyToAccount, mnemonicToAccount, generatePrivateKey
 * 6.  Chains: Chain, ChainId, ChainInfo
 * 7.  Contract: readContract, writeContract, simulateContract, deployContract
 * 8.  ENS: getEnsAddress, getEnsName, getEnsAvatar, getEnsText
 * 9.  SIWE: createSiweMessage, verifySiweMessage, parseSiweMessage
 * 10. ABI: parseAbi, encodeAbiParameters, decodeAbiParameters, encodeFunctionData
 * 11. EIP-7702: signAuthorization, recoverAuthorizationAddress, verifyAuthorization
 * 12. Utilities: Text, Number, Address, Display, Console, formatEther, parseEther
 * 13. Glossary: Terms, Units, ChainIds
 */
export function registerAllNodes() {
  // Configure LiteGraph defaults
  LiteGraph.clearRegisteredTypes()

  // Register node categories (按 viem 官网顺序)
  registerClientNodes()          // 1. Clients
  registerPublicActionNodes()    // 2. Public Actions
  registerWalletActionNodes()    // 3. Wallet Actions
  registerTestActionNodes()      // 4. Test Actions
  registerAccountNodes()         // 5. Accounts
  registerChainNodes()           // 6. Chains
  registerContractNodes()        // 7. Contract
  registerEnsNodes()             // 8. ENS
  registerSiweNodes()            // 9. SIWE
  registerAbiNodes()             // 10. ABI
  registerEip7702Nodes()         // 11. EIP-7702
  registerUtilityNodes()         // 12. Utilities
  registerGlossaryNodes()        // 13. Glossary
  registerControlNodes()          // 14. Control (Button, Timer)

  // Install auto node pairing after all nodes are registered
  installAutoNodePairing()

  // 让所有节点默认可调整大小
  const nodeTypes = LiteGraph.registered_node_types
  for (const typeName in nodeTypes) {
    const nodeType = nodeTypes[typeName]
    if (nodeType && nodeType.prototype) {
      nodeType.prototype.resizable = true
    }
  }

  console.log('[ViemPlay] All 14 node categories registered, resizable enabled')
}

// Re-export for convenience
export * from './clients'
export * from './public-actions'
export * from './wallet-actions'
export * from './test-actions'
export * from './accounts'
export * from './chains'
export * from './contract'
export * from './ens'
export * from './siwe'
export * from './abi'
export * from './eip-7702'
export * from './utilities'
export * from './glossary'
export * from './control'
