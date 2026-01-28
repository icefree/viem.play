import { LiteGraph } from 'litegraph.js'
import { ParseAbiNode } from './ParseAbiNode'
import { EncodeAbiParametersNode } from './EncodeAbiParametersNode'
import { DecodeAbiParametersNode } from './DecodeAbiParametersNode'
import { EncodeFunctionDataNode } from './EncodeFunctionDataNode'
import { DecodeFunctionResultNode } from './DecodeFunctionResultNode'
import { DecodeEventLogNode } from './DecodeEventLogNode'
import { ParseAbiItemNode } from './ParseAbiItemNode'
import { ParseAbiParameterNode } from './ParseAbiParameterNode'
import { EncodeEventTopicsNode } from './EncodeEventTopicsNode'
import { EncodeFunctionResultAbiNode } from './EncodeFunctionResultAbiNode'
import { DecodeFunctionDataAbiNode } from './DecodeFunctionDataAbiNode'

export function registerAbiNodes() {
  // --- Parsing ---
  LiteGraph.registerNodeType('ABI/Parsing/parseAbi', ParseAbiNode)
  LiteGraph.registerNodeType('ABI/Parsing/parseAbiItem', ParseAbiItemNode)
  LiteGraph.registerNodeType('ABI/Parsing/parseAbiParameter', ParseAbiParameterNode)

  // --- Encoding ---
  LiteGraph.registerNodeType('ABI/Encoding/encodeAbiParameters', EncodeAbiParametersNode)
  LiteGraph.registerNodeType('ABI/Encoding/encodeFunctionData', EncodeFunctionDataNode)
  LiteGraph.registerNodeType('ABI/Encoding/encodeEventTopics', EncodeEventTopicsNode)
  LiteGraph.registerNodeType('ABI/Encoding/encodeFunctionResult', EncodeFunctionResultAbiNode)

  // --- Decoding ---
  LiteGraph.registerNodeType('ABI/Decoding/decodeAbiParameters', DecodeAbiParametersNode)
  LiteGraph.registerNodeType('ABI/Decoding/decodeFunctionResult', DecodeFunctionResultNode)
  LiteGraph.registerNodeType('ABI/Decoding/decodeEventLog', DecodeEventLogNode)
  LiteGraph.registerNodeType('ABI/Decoding/decodeFunctionData', DecodeFunctionDataAbiNode)
}

export {
  ParseAbiNode,
  EncodeAbiParametersNode,
  DecodeAbiParametersNode,
  EncodeFunctionDataNode,
  DecodeFunctionResultNode,
  DecodeEventLogNode,
  ParseAbiItemNode,
  ParseAbiParameterNode,
  EncodeEventTopicsNode,
  EncodeFunctionResultAbiNode,
  DecodeFunctionDataAbiNode
}
