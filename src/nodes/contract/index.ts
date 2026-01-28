import { LiteGraph } from 'litegraph.js'
import { ReadContractNode } from './ReadContractNode'
import { WriteContractNode } from './WriteContractNode'
import { SimulateContractNode } from './SimulateContractNode'
import { DeployContractNode } from './DeployContractNode'
import { GetContractEventsNode } from './GetContractEventsNode'
import { MulticallNode } from './MulticallNode'
import { CreateContractEventFilterNode } from './CreateContractEventFilterNode'
import { WatchContractEventNode } from './WatchContractEventNode'
import { DecodeFunctionDataNode } from './DecodeFunctionDataNode'
import { DecodeFunctionResultNode as DecodeFunctionResultContractNode } from './DecodeFunctionResultContractNode'
import { EncodeDeployDataNode } from './EncodeDeployDataNode'
import { EncodeErrorResultNode } from './EncodeErrorResultNode'
import { EncodeFunctionDataContractNode } from './EncodeFunctionDataContractNode'
import { EncodeFunctionResultContractNode } from './EncodeFunctionResultContractNode'

export function registerContractNodes() {
  // --- Actions ---
  LiteGraph.registerNodeType('Contract/Actions/readContract', ReadContractNode)
  LiteGraph.registerNodeType('Contract/Actions/writeContract', WriteContractNode)
  LiteGraph.registerNodeType('Contract/Actions/simulateContract', SimulateContractNode)
  LiteGraph.registerNodeType('Contract/Actions/deployContract', DeployContractNode)
  LiteGraph.registerNodeType('Contract/Actions/multicall', MulticallNode)

  // --- Event ---
  LiteGraph.registerNodeType('Contract/Event/getContractEvents', GetContractEventsNode)
  LiteGraph.registerNodeType('Contract/Event/createContractEventFilter', CreateContractEventFilterNode)
  LiteGraph.registerNodeType('Contract/Event/watchContractEvent', WatchContractEventNode)

  // --- Utils ---
  LiteGraph.registerNodeType('Contract/Utils/decodeFunctionData', DecodeFunctionDataNode)
  LiteGraph.registerNodeType('Contract/Utils/decodeFunctionResult', DecodeFunctionResultContractNode)
  LiteGraph.registerNodeType('Contract/Utils/encodeDeployData', EncodeDeployDataNode)
  LiteGraph.registerNodeType('Contract/Utils/encodeErrorResult', EncodeErrorResultNode)
  LiteGraph.registerNodeType('Contract/Utils/encodeFunctionData', EncodeFunctionDataContractNode)
  LiteGraph.registerNodeType('Contract/Utils/encodeFunctionResult', EncodeFunctionResultContractNode)
}

export {
  ReadContractNode,
  WriteContractNode,
  SimulateContractNode,
  DeployContractNode,
  GetContractEventsNode,
  MulticallNode,
  CreateContractEventFilterNode,
  WatchContractEventNode,
  DecodeFunctionDataNode,
  DecodeFunctionResultContractNode,
  EncodeDeployDataNode,
  EncodeErrorResultNode,
  EncodeFunctionDataContractNode,
  EncodeFunctionResultContractNode
}
