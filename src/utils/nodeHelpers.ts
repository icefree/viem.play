import { LGraphNode, LiteGraph, type LGraph } from 'litegraph.js'

/**
 * 扩展 LiteGraph 的 MouseEvent 类型
 */
interface LGraphMouseEvent extends MouseEvent {
  canvasX?: number
  canvasY?: number
}

/**
 * 扩展 LGraph 类型,包含 canvas 属性
 */
interface ExtendedLGraph extends LGraph {
  canvas?: {
    canvas: HTMLCanvasElement
    scale: number
    offsetLeft: number
    offsetTop: number
    [key: string]: unknown
  }
}

/**
 * 节点类型映射配置
 * 定义了输入/输出类型与应创建节点的映射关系
 */
interface NodeTypeMapping {
  // 输出节点映射: 类型 -> 节点路径
  output: Record<string, string | string[]>
  // 输入节点映射: 类型 -> 节点路径
  input: Record<string, string | string[]>
}

const NODE_TYPE_MAPPING: NodeTypeMapping = {
  // 输出节点双击映射
  output: {
    'address': 'Utilities/UI/Display',
    'bigint': ['Utilities/UI/Display', 'Utilities/Units/formatEther'],
    'string': 'Utilities/UI/Display',
    'number': 'Utilities/UI/Display',
    'object': 'Utilities/UI/Console',
    'boolean': 'Utilities/UI/Display',
  },
  // 输入节点双击映射
  input: {
    'address': 'Utilities/UI/Address',
    'string': 'Utilities/UI/Text',
    'number': 'Utilities/UI/Number',
    'bigint': ['Utilities/UI/Number', 'Utilities/Units/parseEther'],
    'bytes32': 'Utilities/UI/Bytes32',
    'chain': 'Chains/Chain',
    'account': 'Accounts/privateKeyToAccount',
    'publicClient': 'Clients/PublicClient',
    'walletClient': 'Clients/WalletClient',
    'testClient': 'Clients/TestClient',
  }
}

/**
 * 为节点类添加双击处理能力
 * 采用装饰器模式,不修改原有节点代码
 */
export function addDoubleClickHandlers(nodeClass: any): void {
  // 保存原始方法
  const originalOnOutputDblClick = nodeClass.prototype.onOutputDblClick
  const originalOnInputDblClick = nodeClass.prototype.onInputDblClick

  /**
   * 输出节点双击处理
   */
  nodeClass.prototype.onOutputDblClick = function(index: number, e: LGraphMouseEvent) {
    // 调用原始方法(如果存在)
    if (typeof originalOnOutputDblClick === 'function') {
      originalOnOutputDblClick.call(this, index, e)
    }

    const output = this.outputs?.[index]
    if (!output) return

    const outputType = output.type
    console.log('[ViemPlay] Output double-click:', outputType, output)

    // 获取要创建的节点类型
    const nodeTypeToCreate = getNodeTypeForOutput(outputType)
    if (!nodeTypeToCreate) {
      // 默认创建 Display 节点
      createAndConnectNode.call(this, 'Utilities/UI/Display', index, e, 'output')
      return
    }

    // 支持创建单个或多个节点(如 bigint 需要创建 Display + formatEther)
    if (Array.isArray(nodeTypeToCreate)) {
      createNodeChain.call(this, nodeTypeToCreate, index, e, 'output')
    } else {
      createAndConnectNode.call(this, nodeTypeToCreate, index, e, 'output')
    }
  }

  /**
   * 输入节点双击处理
   */
  nodeClass.prototype.onInputDblClick = function(index: number, e: LGraphMouseEvent) {
    // 调用原始方法(如果存在)
    if (typeof originalOnInputDblClick === 'function') {
      originalOnInputDblClick.call(this, index, e)
    }

    const input = this.inputs?.[index]
    if (!input) return

    const inputType = input.type
    console.log('[ViemPlay] Input double-click:', inputType, input)

    // 获取要创建的节点类型
    const nodeTypeToCreate = getNodeTypeForInput(inputType)
    if (!nodeTypeToCreate) {
      console.warn('[ViemPlay] No node type mapping found for input type:', inputType)
      return
    }

    // 支持创建单个或多个节点
    if (Array.isArray(nodeTypeToCreate)) {
      createNodeChain.call(this, nodeTypeToCreate, index, e, 'input')
    } else {
      createAndConnectNode.call(this, nodeTypeToCreate, index, e, 'input')
    }
  }
}

/**
 * 根据输出类型获取应创建的节点类型
 */
function getNodeTypeForOutput(type: number | string): string | string[] | null {
  // 处理 LiteGraph 的类型常量
  if (type === 0 || type === -1) {
    // 0 表示任意类型, -1 表示 Action 类型
    return 'Utilities/UI/Display'
  }

  const typeStr = String(type)
  return NODE_TYPE_MAPPING.output[typeStr] || null
}

/**
 * 根据输入类型获取应创建的节点类型
 */
function getNodeTypeForInput(type: number | string): string | string[] | null {
  // 处理 LiteGraph 的类型常量
  if (type === 0) {
    // 0 表示任意类型,默认创建文本输入
    return 'Utilities/UI/Text'
  }

  const typeStr = String(type)
  return NODE_TYPE_MAPPING.input[typeStr] || null
}

/**
 * 创建节点并连接到当前节点
 */
function createAndConnectNode(
  this: LGraphNode,
  nodeType: string,
  slotIndex: number,
  e: LGraphMouseEvent,
  direction: 'input' | 'output'
): void {
  if (!this.graph) return

  try {
    const newNode = LiteGraph.createNode(nodeType)
    if (!newNode) {
      console.error('[ViemPlay] Failed to create node:', nodeType)
      return
    }

    // 计算节点位置
    const graph = this.graph as ExtendedLGraph
    const canvas = graph?.canvas
    if (!canvas) return

    // 获取鼠标在画布上的坐标
    const canvasX = e.canvasX || (e.clientX - canvas.canvas.offsetLeft) / canvas.scale
    const canvasY = e.canvasY || (e.clientY - canvas.canvas.offsetTop) / canvas.scale

    // 设置新节点位置
    if (direction === 'output') {
      // 输出节点:创建在右侧
      newNode.pos = [canvasX + 90, canvasY - 25]
    } else {
      // 输入节点:创建在左侧
      newNode.pos = [canvasX - 280, canvasY - 25]
    }

    // 添加到画布
    this.graph.add(newNode)

    // 连接节点(需要延迟,因为节点添加是异步的)
    setTimeout(() => {
      try {
        if (direction === 'output') {
          this.connect(slotIndex, newNode, 0)
        } else {
          newNode.connect(0, this, slotIndex)
        }
      } catch (err) {
        console.error('[ViemPlay] Failed to connect nodes:', err)
      }
    }, 10)

    console.log('[ViemPlay] Created and connected node:', nodeType)
  } catch (err) {
    console.error('[ViemPlay] Error creating node:', err)
  }
}

/**
 * 创建节点链(多个节点连接)
 * 例如: bigint 输出 -> formatEther -> Display
 */
function createNodeChain(
  this: LGraphNode,
  nodeTypes: string[],
  slotIndex: number,
  e: LGraphMouseEvent,
  direction: 'input' | 'output'
): void {
  if (!this.graph || nodeTypes.length === 0) return

  try {
    const nodes: LGraphNode[] = []
    const graph = this.graph as ExtendedLGraph
    const canvas = graph?.canvas
    if (!canvas) return

    const canvasX = e.canvasX || (e.clientX - canvas.canvas.offsetLeft) / canvas.scale
    const canvasY = e.canvasY || (e.clientY - canvas.canvas.offsetTop) / canvas.scale

    // 创建所有节点
    for (let i = 0; i < nodeTypes.length; i++) {
      const newNode = LiteGraph.createNode(nodeTypes[i])
      if (!newNode) {
        console.error('[ViemPlay] Failed to create node:', nodeTypes[i])
        continue
      }

      // 设置位置(连续排列)
      if (direction === 'output') {
        newNode.pos = [canvasX + 90 + i * 200, canvasY - 25]
      } else {
        newNode.pos = [canvasX - 280 - i * 200, canvasY - 25]
      }

      this.graph.add(newNode)
      nodes.push(newNode)
    }

    // 连接节点链
    setTimeout(() => {
      try {
        if (direction === 'output') {
          // 输出方向: this -> node0 -> node1 -> ...
          this.connect(slotIndex, nodes[0], 0)
          for (let i = 0; i < nodes.length - 1; i++) {
            nodes[i].connect(0, nodes[i + 1], 0)
          }
        } else {
          // 输入方向: ... -> node1 -> node0 -> this
          nodes[nodes.length - 1].connect(0, this, slotIndex)
          for (let i = nodes.length - 1; i > 0; i--) {
            nodes[i].connect(0, nodes[i - 1], 0)
          }
        }
      } catch (err) {
        console.error('[ViemPlay] Failed to connect node chain:', err)
      }
    }, 10)

    console.log('[ViemPlay] Created node chain:', nodeTypes)
  } catch (err) {
    console.error('[ViemPlay] Error creating node chain:', err)
  }
}

/**
 * 为所有已注册的节点应用双击处理
 */
export function applyDoubleClickHandlersToAll(): void {
  const nodeTypes = Object.keys(LiteGraph.registered_node_types)
  console.log(`[ViemPlay] Applying double-click handlers to ${nodeTypes.length} node types`)
  
  nodeTypes.forEach(type => {
    const nodeClass = LiteGraph.registered_node_types[type]
    if (nodeClass) {
      addDoubleClickHandlers(nodeClass)
    }
  })
  
  console.log('[ViemPlay] Double-click handlers applied successfully')
}
