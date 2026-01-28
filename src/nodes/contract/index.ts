import { LiteGraph } from 'litegraph.js'
import { ReadContractNode } from './ReadContractNode'
import { WriteContractNode } from './WriteContractNode'
import { SimulateContractNode } from './SimulateContractNode'
import { DeployContractNode } from './DeployContractNode'
import { GetContractEventsNode } from './GetContractEventsNode'
import { ContractPlaceholderNode } from './ContractPlaceholderNode'

export function registerContractNodes() {
  // --- Actions ---
  LiteGraph.registerNodeType('Contract/Actions/readContract', ReadContractNode)
  LiteGraph.registerNodeType('Contract/Actions/writeContract', WriteContractNode)
  LiteGraph.registerNodeType('Contract/Actions/simulateContract', SimulateContractNode)
  LiteGraph.registerNodeType('Contract/Actions/deployContract', DeployContractNode)
  LiteGraph.registerNodeType('Contract/Actions/multicall', class extends ContractPlaceholderNode { constructor() { super('multicall', 'Execute multiple calls') } })

  // --- Event ---
  LiteGraph.registerNodeType('Contract/Event/getContractEvents', GetContractEventsNode)
  LiteGraph.registerNodeType('Contract/Event/createContractEventFilter', class extends ContractPlaceholderNode { constructor() { super('createContractEventFilter', 'Create filter for contract events') } })
  LiteGraph.registerNodeType('Contract/Event/watchContractEvent', class extends ContractPlaceholderNode { constructor() { super('watchContractEvent', 'Watch for contract events') } })

  // --- Utils ---
  LiteGraph.registerNodeType('Contract/Utils/decodeFunctionData', class extends ContractPlaceholderNode { constructor() { super('decodeFunctionData', 'Decode function data') } })
  LiteGraph.registerNodeType('Contract/Utils/decodeFunctionResult', class extends ContractPlaceholderNode { constructor() { super('decodeFunctionResult', 'Decode function result') } })
  LiteGraph.registerNodeType('Contract/Utils/encodeDeployData', class extends ContractPlaceholderNode { constructor() { super('encodeDeployData', 'Encode deployment data') } })
  LiteGraph.registerNodeType('Contract/Utils/encodeErrorResult', class extends ContractPlaceholderNode { constructor() { super('encodeErrorResult', 'Encode error result') } })
  LiteGraph.registerNodeType('Contract/Utils/encodeFunctionData', class extends ContractPlaceholderNode { constructor() { super('encodeFunctionData', 'Encode function data') } })
  LiteGraph.registerNodeType('Contract/Utils/encodeFunctionResult', class extends ContractPlaceholderNode { constructor() { super('encodeFunctionResult', 'Encode function result') } })
}

export {
  ReadContractNode,
  WriteContractNode,
  SimulateContractNode,
  DeployContractNode,
  GetContractEventsNode,
  ContractPlaceholderNode
}
