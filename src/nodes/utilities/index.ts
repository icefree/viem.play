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
import { UtilityPlaceholderNode } from './UtilityPlaceholderNode'

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
  LiteGraph.registerNodeType('Utilities/Data/concat', class extends UtilityPlaceholderNode { constructor() { super('concat', 'Concatenate hex/byte data') } })
  LiteGraph.registerNodeType('Utilities/Data/isHex', class extends UtilityPlaceholderNode { constructor() { super('isHex', 'Check if value is hex') } })
  LiteGraph.registerNodeType('Utilities/Data/pad', class extends UtilityPlaceholderNode { constructor() { super('pad', 'Pad hex/byte data') } })
  LiteGraph.registerNodeType('Utilities/Data/size', class extends UtilityPlaceholderNode { constructor() { super('size', 'Get size of hex/byte data') } })
  LiteGraph.registerNodeType('Utilities/Data/slice', class extends UtilityPlaceholderNode { constructor() { super('slice', 'Slice hex/byte data') } })

  // --- Encoding / Parsing ---
  LiteGraph.registerNodeType('Utilities/Encoding/toHex', class extends UtilityPlaceholderNode { constructor() { super('toHex', 'Convert to hex') } })
  LiteGraph.registerNodeType('Utilities/Encoding/fromHex', class extends UtilityPlaceholderNode { constructor() { super('fromHex', 'Parse from hex') } })
  LiteGraph.registerNodeType('Utilities/Encoding/toRlp', class extends UtilityPlaceholderNode { constructor() { super('toRlp', 'Encode to RLP') } })
  LiteGraph.registerNodeType('Utilities/Encoding/fromRlp', class extends UtilityPlaceholderNode { constructor() { super('fromRlp', 'Decode from RLP') } })

  // --- Units ---
  LiteGraph.registerNodeType('Utilities/Units/formatEther', FormatEtherNode)
  LiteGraph.registerNodeType('Utilities/Units/parseEther', ParseEtherNode)
  LiteGraph.registerNodeType('Utilities/Units/formatUnits', class extends UtilityPlaceholderNode { constructor() { super('formatUnits', 'Format units') } })
  LiteGraph.registerNodeType('Utilities/Units/parseUnits', class extends UtilityPlaceholderNode { constructor() { super('parseUnits', 'Parse units') } })

  // --- Hash ---
  LiteGraph.registerNodeType('Utilities/Hash/keccak256', Keccak256Node)
  LiteGraph.registerNodeType('Utilities/Hash/hashMessage', class extends UtilityPlaceholderNode { constructor() { super('hashMessage', 'Hash a message') } })
  
  // --- Chains ---
  LiteGraph.registerNodeType('Utilities/Chains/extractChain', class extends UtilityPlaceholderNode { constructor() { super('extractChain', 'Extract chain from client') } })

  // --- Signature ---
  LiteGraph.registerNodeType('Utilities/Signature/recoverAddress', class extends UtilityPlaceholderNode { constructor() { super('recoverAddress', 'Recover address from signature') } })
  LiteGraph.registerNodeType('Utilities/Signature/verifyMessage', class extends UtilityPlaceholderNode { constructor() { super('verifyMessage', 'Verify a message signature') } })

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
  UtilityPlaceholderNode
}
