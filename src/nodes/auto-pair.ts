import { LiteGraph, LGraphNode } from 'litegraph.js'

type CanvasMouseEvent = MouseEvent & {
  canvasX?: number
  canvasY?: number
}

const AUTO_PAIR_FLAG = '__viemplayAutoPairing__'

const NODE_TYPES = {
  text: 'Utilities/UI/Text',
  number: 'Utilities/UI/Number',
  bytes: 'Utilities/UI/Bytes',
  json: 'Utilities/UI/JSON',
  trigger: 'Utilities/UI/Trigger',
  button: 'Control/Button',
  timer: 'Control/Timer',
  address: 'Utilities/UI/Address',
  bytes32: 'Utilities/UI/Bytes32',
  display: 'Utilities/UI/Display',
  console: 'Utilities/UI/Console',
  toBigInt: 'Utilities/Helpers/toBigInt',
  parseAbi: 'ABI/Parsing/parseAbi',
  chain: 'Chains/Chain',
  publicClient: 'Clients & Transports/Clients/PublicClient',
  walletClient: 'Clients & Transports/Clients/WalletClient',
  testClient: 'Clients & Transports/Clients/TestClient',
  toAccount: 'Accounts/JSON-RPC/toAccount',
  transport: 'Clients & Transports/Transports/http'
} as const

const GAP_X = 240
const OUTPUT_OFFSET_X = 80
const OFFSET_Y = -20

function getBasePos(node: LGraphNode, e?: CanvasMouseEvent) {
  const fallbackX = Array.isArray(node.pos) ? node.pos[0] : 0
  const fallbackY = Array.isArray(node.pos) ? node.pos[1] : 0
  const x = typeof e?.canvasX === 'number' ? e.canvasX : fallbackX
  const y = typeof e?.canvasY === 'number' ? e.canvasY : fallbackY
  return { x, y }
}

function createNode(graph: LGraphNode['graph'], type: string, x: number, y: number) {
  if (!graph) return null
  const node = LiteGraph.createNode(type)
  if (!node) return null
  node.pos = [x, y]
  graph.add(node)
  return node
}

function findFirstInputIndexByType(node: LGraphNode, type: unknown) {
  if (!node.inputs) return -1
  for (let i = 0; i < node.inputs.length; i += 1) {
    if (node.inputs[i]?.type === type) return i
  }
  return -1
}

function attachInputAutoPairing(nodeType: typeof LGraphNode) {
  const proto = nodeType.prototype as any
  if (proto[AUTO_PAIR_FLAG]) return
  proto[AUTO_PAIR_FLAG] = true

  const originalOnInputDblClick = proto.onInputDblClick
  proto.onInputDblClick = function (index: number, e: CanvasMouseEvent) {
    if (typeof originalOnInputDblClick === 'function') {
      originalOnInputDblClick.call(this, index, e)
    }

    const input = this.inputs?.[index]
    if (!input || !this.graph) return

    // 如果已经有连线，则不响应
    if (input.link !== null && input.link !== undefined) return

    const { x, y } = getBasePos(this, e)
    const leftX = x - GAP_X
    const leftX2 = x - GAP_X * 2

    switch (input.type) {
      case LiteGraph.ACTION:
      case -1: {
        // 根据输入名称决定：trigger -> Button, timer -> Timer
        const nodeType = input.name === 'timer' ? NODE_TYPES.timer : NODE_TYPES.button
        const newNode = createNode(this.graph, nodeType, leftX, y + OFFSET_Y)
        if (newNode) newNode.connect(0, this, index)
        break
      }
      case 'string': {
        const textNode = createNode(this.graph, NODE_TYPES.text, leftX, y + OFFSET_Y)
        if (textNode) textNode.connect(0, this, index)
        break
      }
      case 'number': {
        const numberNode = createNode(this.graph, NODE_TYPES.number, leftX, y + OFFSET_Y)
        if (numberNode) numberNode.connect(0, this, index)
        break
      }
      case 'address': {
        const addressNode = createNode(this.graph, NODE_TYPES.address, leftX, y + OFFSET_Y)
        if (addressNode) addressNode.connect(0, this, index)
        break
      }
      case 'bytes32': {
        const bytes32Node = createNode(this.graph, NODE_TYPES.bytes32, leftX, y + OFFSET_Y)
        if (bytes32Node) bytes32Node.connect(0, this, index)
        break
      }
      case 'bytes': {
        const bytesNode = createNode(this.graph, NODE_TYPES.bytes, leftX, y + OFFSET_Y)
        if (bytesNode) bytesNode.connect(0, this, index)
        break
      }
      case 'object':
      case 'array': {
        const jsonNode = createNode(this.graph, NODE_TYPES.json, leftX, y + OFFSET_Y)
        if (jsonNode) jsonNode.connect(0, this, index)
        break
      }
      case 'bigint': {
        const textNode = createNode(this.graph, NODE_TYPES.text, leftX2, y + OFFSET_Y)
        const toBigIntNode = createNode(this.graph, NODE_TYPES.toBigInt, leftX, y + OFFSET_Y)
        if (textNode && toBigIntNode) {
          textNode.connect(0, toBigIntNode, 0)
          toBigIntNode.connect(0, this, index)
        }
        break
      }
      case 'abi': {
        const textNode = createNode(this.graph, NODE_TYPES.text, leftX2, y + OFFSET_Y)
        const parseAbiNode = createNode(this.graph, NODE_TYPES.parseAbi, leftX, y + OFFSET_Y)
        if (textNode && parseAbiNode) {
          textNode.connect(0, parseAbiNode, 0)
          parseAbiNode.connect(0, this, index)
        }
        break
      }
      case 'chain': {
        const chainNode = createNode(this.graph, NODE_TYPES.chain, leftX, y + OFFSET_Y)
        if (chainNode) chainNode.connect(0, this, index)
        break
      }
      case 'publicClient': {
        const chainNode = createNode(this.graph, NODE_TYPES.chain, leftX2, y + OFFSET_Y)
        const clientNode = createNode(this.graph, NODE_TYPES.publicClient, leftX, y + OFFSET_Y)
        if (chainNode && clientNode) {
          chainNode.connect(0, clientNode, 0)
          clientNode.connect(0, this, index)
        }
        break
      }
      case 'testClient': {
        const chainNode = createNode(this.graph, NODE_TYPES.chain, leftX2, y + OFFSET_Y)
        const clientNode = createNode(this.graph, NODE_TYPES.testClient, leftX, y + OFFSET_Y)
        if (chainNode && clientNode) {
          chainNode.connect(0, clientNode, 0)
          clientNode.connect(0, this, index)
        }
        break
      }
      case 'walletClient': {
        const chainNode = createNode(this.graph, NODE_TYPES.chain, leftX2, y + OFFSET_Y)
        const clientNode = createNode(this.graph, NODE_TYPES.walletClient, leftX, y + OFFSET_Y)
        if (chainNode && clientNode) {
          chainNode.connect(0, clientNode, 0)
          clientNode.connect(0, this, index)
        }
        break
      }
      case 'account': {
        const addressNode = createNode(this.graph, NODE_TYPES.address, leftX2, y + OFFSET_Y)
        const accountNode = createNode(this.graph, NODE_TYPES.toAccount, leftX, y + OFFSET_Y)
        if (addressNode && accountNode) {
          addressNode.connect(0, accountNode, 0)
          accountNode.connect(0, this, index)
        }
        break
      }
      case 'transport': {
        const transportNode = createNode(this.graph, NODE_TYPES.transport, leftX, y + OFFSET_Y)
        if (transportNode) transportNode.connect(0, this, index)
        break
      }
      case '': {
        // 空类型时根据输入名称决定创建哪个节点
        const name = input.name?.toLowerCase() || ''
        if (name.includes('permission') || name.includes('json') || name.includes('data') || name.includes('args')) {
          const jsonNode = createNode(this.graph, NODE_TYPES.json, leftX, y + OFFSET_Y)
          if (jsonNode) jsonNode.connect(0, this, index)
        } else if (name.includes('address')) {
          const addressNode = createNode(this.graph, NODE_TYPES.address, leftX, y + OFFSET_Y)
          if (addressNode) addressNode.connect(0, this, index)
        } else if (name.includes('value') || name.includes('amount')) {
          const numberNode = createNode(this.graph, NODE_TYPES.number, leftX, y + OFFSET_Y)
          if (numberNode) numberNode.connect(0, this, index)
        } else {
          // 默认创建 Display 节点用于调试
          console.log('[ViemPlay] No auto input pairing for type:', input.type, 'name:', input.name)
        }
        break
      }
      default:
        console.log('[ViemPlay] No auto input pairing for type:', input.type)
    }
  }

  const originalOnOutputDblClick = proto.onOutputDblClick
  proto.onOutputDblClick = function (index: number, e: CanvasMouseEvent) {
    if (typeof originalOnOutputDblClick === 'function') {
      originalOnOutputDblClick.call(this, index, e)
    }

    if (!this.graph || !this.outputs?.[index]) return

    const output = this.outputs?.[index]
    // 如果已经有连线，则不响应
    if (output?.links && output.links.length > 0) return

    const { x, y } = getBasePos(this, e)

    if (output?.type === LiteGraph.EVENT || (output?.type as any) === -1) {
      const consoleNode = createNode(this.graph, NODE_TYPES.console, x + OUTPUT_OFFSET_X, y + OFFSET_Y)
      if (consoleNode) {
        const triggerIndex = findFirstInputIndexByType(consoleNode, LiteGraph.ACTION)
        if (triggerIndex >= 0) {
          this.connect(index, consoleNode, triggerIndex)
        }
      }
      return
    }

    const displayNode = createNode(this.graph, NODE_TYPES.display, x + OUTPUT_OFFSET_X, y + OFFSET_Y)
    if (displayNode) this.connect(index, displayNode, 0)
  }
}

export function installAutoNodePairing() {
  const nodeTypes = Object.values(LiteGraph.registered_node_types)
  nodeTypes.forEach((nodeType) => {
    if (!nodeType || typeof nodeType !== 'function') return
    attachInputAutoPairing(nodeType as any)
  })
}
