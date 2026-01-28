import { LiteGraph } from 'litegraph.js'
import { ParseAbiNode } from './ParseAbiNode'
import { EncodeAbiParametersNode } from './EncodeAbiParametersNode'
import { DecodeAbiParametersNode } from './DecodeAbiParametersNode'
import { EncodeFunctionDataNode } from './EncodeFunctionDataNode'
import { DecodeFunctionResultNode } from './DecodeFunctionResultNode'
import { DecodeEventLogNode } from './DecodeEventLogNode'
import { AbiPlaceholderNode } from './AbiPlaceholderNode'

export function registerAbiNodes() {
  // --- Parsing ---
  LiteGraph.registerNodeType('ABI/Parsing/parseAbi', ParseAbiNode)
  LiteGraph.registerNodeType('ABI/Parsing/parseAbiItem', class extends AbiPlaceholderNode { constructor() { super('parseAbiItem', 'Parse a single ABI item') } })
  LiteGraph.registerNodeType('ABI/Parsing/parseAbiParameter', class extends AbiPlaceholderNode { constructor() { super('parseAbiParameter', 'Parse a single ABI parameter') } })

  // --- Encoding ---
  LiteGraph.registerNodeType('ABI/Encoding/encodeAbiParameters', EncodeAbiParametersNode)
  LiteGraph.registerNodeType('ABI/Encoding/encodeFunctionData', EncodeFunctionDataNode)
  LiteGraph.registerNodeType('ABI/Encoding/encodeEventTopics', class extends AbiPlaceholderNode { constructor() { super('encodeEventTopics', 'Encode event topics') } })
  LiteGraph.registerNodeType('ABI/Encoding/encodeFunctionResult', class extends AbiPlaceholderNode { constructor() { super('encodeFunctionResult', 'Encode function result') } })

  // --- Decoding ---
  LiteGraph.registerNodeType('ABI/Decoding/decodeAbiParameters', DecodeAbiParametersNode)
  LiteGraph.registerNodeType('ABI/Decoding/decodeFunctionResult', DecodeFunctionResultNode)
  LiteGraph.registerNodeType('ABI/Decoding/decodeEventLog', DecodeEventLogNode)
  LiteGraph.registerNodeType('ABI/Decoding/decodeFunctionData', class extends AbiPlaceholderNode { constructor() { super('decodeFunctionData', 'Decode function data') } })
}

export {
  ParseAbiNode,
  EncodeAbiParametersNode,
  DecodeAbiParametersNode,
  EncodeFunctionDataNode,
  DecodeFunctionResultNode,
  DecodeEventLogNode,
  AbiPlaceholderNode
}
