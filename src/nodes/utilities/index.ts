import { LiteGraph } from 'litegraph.js'
import { TextInputNode } from './TextInputNode'
import { NumberInputNode } from './NumberInputNode'
import { BytesInputNode } from './BytesInputNode'
import { JsonInputNode } from './JsonInputNode'
import { TriggerNode } from './TriggerNode'
import { AddressInputNode } from './AddressInputNode'
import { Bytes32InputNode } from './Bytes32InputNode'
import { DisplayNode } from './DisplayNode'
import { ConsoleLogNode } from './ConsoleLogNode'
import { ToBigIntNode } from './ToBigIntNode'
import { FormatEtherNode } from './FormatEtherNode'
import { ParseEtherNode } from './ParseEtherNode'
import { GetAddressNode } from './GetAddressNode'
import { IsAddressNode } from './IsAddressNode'
import { IsAddressEqualNode } from './IsAddressEqualNode'
import { Keccak256Node } from './Keccak256Node'
import { ConcatNode } from './ConcatNode'
import { IsHexNode } from './IsHexNode'
import { PadNode } from './PadNode'
import { SizeNode } from './SizeNode'
import { SliceNode } from './SliceNode'
import { ToHexNode } from './ToHexNode'
import { FromHexNode } from './FromHexNode'
import { ToRlpNode } from './ToRlpNode'
import { FromRlpNode } from './FromRlpNode'
import { FormatUnitsNode } from './FormatUnitsNode'
import { ParseUnitsNode } from './ParseUnitsNode'
import { HashMessageNode } from './HashMessageNode'
import { ExtractChainNode } from './ExtractChainNode'
import { RecoverAddressNode } from './RecoverAddressNode'
import { VerifyMessageNode } from './VerifyMessageNode'

export function registerUtilityNodes() {
  // --- UI Items (Internal) ---
  LiteGraph.registerNodeType('Utilities/UI/Text', TextInputNode)
  LiteGraph.registerNodeType('Utilities/UI/Number', NumberInputNode)
  LiteGraph.registerNodeType('Utilities/UI/Bytes', BytesInputNode)
  LiteGraph.registerNodeType('Utilities/UI/JSON', JsonInputNode)
  LiteGraph.registerNodeType('Utilities/UI/Trigger', TriggerNode)
  LiteGraph.registerNodeType('Utilities/UI/Address', AddressInputNode)
  LiteGraph.registerNodeType('Utilities/UI/Bytes32', Bytes32InputNode)
  LiteGraph.registerNodeType('Utilities/UI/Display', DisplayNode)
  LiteGraph.registerNodeType('Utilities/UI/Console', ConsoleLogNode)

  // --- Address ---
  LiteGraph.registerNodeType('Utilities/Address/getAddress', GetAddressNode)
  LiteGraph.registerNodeType('Utilities/Address/isAddress', IsAddressNode)
  LiteGraph.registerNodeType('Utilities/Address/isAddressEqual', IsAddressEqualNode)

  // --- Data ---
  LiteGraph.registerNodeType('Utilities/Data/concat', ConcatNode)
  LiteGraph.registerNodeType('Utilities/Data/isHex', IsHexNode)
  LiteGraph.registerNodeType('Utilities/Data/pad', PadNode)
  LiteGraph.registerNodeType('Utilities/Data/size', SizeNode)
  LiteGraph.registerNodeType('Utilities/Data/slice', SliceNode)

  // --- Encoding / Parsing ---
  LiteGraph.registerNodeType('Utilities/Encoding/toHex', ToHexNode)
  LiteGraph.registerNodeType('Utilities/Encoding/fromHex', FromHexNode)
  LiteGraph.registerNodeType('Utilities/Encoding/toRlp', ToRlpNode)
  LiteGraph.registerNodeType('Utilities/Encoding/fromRlp', FromRlpNode)

  // --- Units ---
  LiteGraph.registerNodeType('Utilities/Units/formatEther', FormatEtherNode)
  LiteGraph.registerNodeType('Utilities/Units/parseEther', ParseEtherNode)
  LiteGraph.registerNodeType('Utilities/Units/formatUnits', FormatUnitsNode)
  LiteGraph.registerNodeType('Utilities/Units/parseUnits', ParseUnitsNode)

  // --- Hash ---
  LiteGraph.registerNodeType('Utilities/Hash/keccak256', Keccak256Node)
  LiteGraph.registerNodeType('Utilities/Hash/hashMessage', HashMessageNode)
  
  // --- Chains ---
  LiteGraph.registerNodeType('Utilities/Chains/extractChain', ExtractChainNode)

  // --- Signature ---
  LiteGraph.registerNodeType('Utilities/Signature/recoverAddress', RecoverAddressNode)
  LiteGraph.registerNodeType('Utilities/Signature/verifyMessage', VerifyMessageNode)

  // --- Helpers ---
  LiteGraph.registerNodeType('Utilities/Helpers/toBigInt', ToBigIntNode)
}

export {
  TextInputNode,
  NumberInputNode,
  BytesInputNode,
  JsonInputNode,
  TriggerNode,
  AddressInputNode,
  Bytes32InputNode,
  DisplayNode,
  ConsoleLogNode,
  ToBigIntNode,
  FormatEtherNode,
  ParseEtherNode,
  GetAddressNode,
  IsAddressNode,
  IsAddressEqualNode,
  Keccak256Node,
  ConcatNode,
  IsHexNode,
  PadNode,
  SizeNode,
  SliceNode,
  ToHexNode,
  FromHexNode,
  ToRlpNode,
  FromRlpNode,
  FormatUnitsNode,
  ParseUnitsNode,
  HashMessageNode,
  ExtractChainNode,
  RecoverAddressNode,
  VerifyMessageNode
}
