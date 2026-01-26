import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import { LGraph, LGraphCanvas, LiteGraph } from 'litegraph.js'
import 'litegraph.js/css/litegraph.css'
import { registerAllNodes } from '../nodes'

// 定义插槽类型到节点类型的映射
const SLOT_TYPE_TO_NODE: Record<string, string> = {
  'chain': 'Chains/Chain',
  'transport': 'Clients & Transports/Transports/http',
  'publicClient': 'Public Actions/Account/getBalance', // 修正路径
  'account': 'Accounts/privateKeyToAccount',
  'address': 'Utilities/Display/Address',
}

// 增强 LiteGraph 原型以支持双击插槽自动连接
/* eslint-disable @typescript-eslint/no-explicit-any */
const LGraphCanvasAny = LGraphCanvas as any;
const originalOnMouseDoubleClick = LGraphCanvasAny.prototype.onMouseDoubleClick;

LGraphCanvasAny.prototype.onMouseDoubleClick = function(this: any, e: MouseEvent) {
  const canvas = this;
  const graph = canvas.graph;
  if (!graph) return originalOnMouseDoubleClick.call(this, e);

  // 获取点击位置下的节点
  const node = canvas.getNodeOnPos(canvas.graph_mouse[0], canvas.graph_mouse[1]);
  if (node) {
    // 检查是否点击了输入插槽
    const input = node.getInputSlot(canvas.graph_mouse[0], canvas.graph_mouse[1]);
    if (input != null) {
      const slot = node.inputs[input];
      // 如果已经有连线，则不触发
      if (slot.link !== null) return originalOnMouseDoubleClick.call(this, e);

      const nodeType = SLOT_TYPE_TO_NODE[slot.type || ''];
      if (nodeType) {
        const newNode = LiteGraph.createNode(nodeType);
        if (newNode) {
          newNode.pos = [node.pos[0] - (newNode.size[0] + 50), node.pos[1] + (input * 30)];
          graph.add(newNode);
          newNode.connect(0, node, input);
          canvas.setDirty(true, true);
          return;
        }
      }
    }

    // 检查是否点击了输出插槽
    const output = node.getOutputSlot(canvas.graph_mouse[0], canvas.graph_mouse[1]);
    if (output != null) {
      const slot = node.outputs[output];
      // 如果已经有连线，则不触发
      if (slot.links && slot.links.length > 0) return originalOnMouseDoubleClick.call(this, e);

      const nodeType = SLOT_TYPE_TO_NODE[slot.type || ''];
      if (nodeType) {
        const newNode = LiteGraph.createNode(nodeType);
        if (newNode) {
          newNode.pos = [node.pos[0] + node.size[0] + 50, node.pos[1] + (output * 30)];
          graph.add(newNode);
          node.connect(output, newNode, 0);
          canvas.setDirty(true, true);
          return;
        }
      }
    }
  }

  return originalOnMouseDoubleClick.call(this, e);
};

export interface CanvasHandle {
  getGraph: () => LGraph | null
  getCanvas: () => LGraphCanvas | null
}

interface CanvasProps {
  onGraphReady?: (graph: LGraph) => void
  onScaleChange?: (scale: number) => void
}

export const Canvas = forwardRef<CanvasHandle, CanvasProps>(({ onGraphReady, onScaleChange }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const graphRef = useRef<LGraph | null>(null)
  const canvasInstanceRef = useRef<LGraphCanvas | null>(null)
  const scaleRef = useRef(1.0)

  // Undo/Redo 历史记录
  const historyRef = useRef<string[]>([])
  const historyIndexRef = useRef(-1)
  const isUndoRedoRef = useRef(false)
  const MAX_HISTORY = 50

  // 保存当前状态到历史记录
  const saveHistory = () => {
    if (isUndoRedoRef.current || !graphRef.current) return
    
    const state = JSON.stringify(graphRef.current.serialize())
    const history = historyRef.current
    const index = historyIndexRef.current

    // 如果在历史中间位置做了新操作，删除后面的历史
    if (index < history.length - 1) {
      history.splice(index + 1)
    }

    // 避免保存重复状态
    if (history.length > 0 && history[history.length - 1] === state) return

    history.push(state)
    if (history.length > MAX_HISTORY) {
      history.shift()
    }
    historyIndexRef.current = history.length - 1
  }

  // 立即执行挂起的保存
  const flushSave = () => {
    const graph = graphRef.current as any
    if (graph && graph._save_timer) {
      clearTimeout(graph._save_timer)
      graph._save_timer = null
      saveHistory()
    }
  }

  // 撤销
  const undo = () => {
    flushSave()
    const history = historyRef.current
    const index = historyIndexRef.current

    if (index <= 0 || !graphRef.current) return

    isUndoRedoRef.current = true
    historyIndexRef.current = index - 1
    const state = JSON.parse(history[historyIndexRef.current])
    graphRef.current.configure(state)
    canvasInstanceRef.current?.setDirty(true, true)
    isUndoRedoRef.current = false
  }

  // 重做
  const redo = () => {
    flushSave()
    const history = historyRef.current
    const index = historyIndexRef.current

    if (index >= history.length - 1 || !graphRef.current) return

    isUndoRedoRef.current = true
    historyIndexRef.current = index + 1
    const state = JSON.parse(history[historyIndexRef.current])
    graphRef.current.configure(state)
    canvasInstanceRef.current?.setDirty(true, true)
    isUndoRedoRef.current = false
  }

  // Expose graph via ref
  useImperativeHandle(ref, () => ({
    getGraph: () => graphRef.current,
    getCanvas: () => canvasInstanceRef.current
  }), [])

  // Initialize graph and canvas
  useEffect(() => {
    if (!canvasRef.current) return

    // Register all custom nodes
    registerAllNodes()

    // Create graph
    const graph = new LGraph()
    graphRef.current = graph

    // Create canvas
    const canvas = new LGraphCanvas(canvasRef.current, graph)
    canvasInstanceRef.current = canvas

    // Store canvas reference in graph for external access
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(graph as any).canvas = canvas

    // Configure canvas appearance
    canvas.background_image = ''
    canvas.render_shadows = false
    canvas.clear_background = true
    canvas.render_curved_connections = true
    canvas.render_connection_arrows = true
    canvas.allow_searchbox = false // Disable default search, use our custom one

    // Start running the graph
    graph.start()

    // Default zoom level (1.0x)
    canvas.ds.scale = 1.0
    onScaleChange?.(1.0)

    // Track scale changes by hooking into the draw method
    const originalRender = canvas.draw;
    canvas.draw = function() {
      // eslint-disable-next-line prefer-rest-params
      originalRender.apply(this, arguments as any);
      if (this.ds.scale !== scaleRef.current) {
        scaleRef.current = this.ds.scale;
        onScaleChange?.(this.ds.scale);
      }
    };

    // Notify parent
    onGraphReady?.(graph)

    // 保存初始状态
    setTimeout(saveHistory, 100);

    // 监听图表变更以自动保存历史
    const debouncedSave = () => {
      // 如果正在进行撤销/重做操作，不保存新历史
      if (isUndoRedoRef.current) return;

      // 简单的防抖，避免连续触发
      if ((graph as any)._save_timer) clearTimeout((graph as any)._save_timer);
      (graph as any)._save_timer = setTimeout(saveHistory, 200);
    };

    (graph as any).onNodeAdded = debouncedSave;
    (graph as any).onNodeRemoved = debouncedSave;
    (graph as any).onConnectionChange = debouncedSave;
    
    // Hook 节点移动结束
    const originalOnNodeMoved = canvas.onNodeMoved;
    canvas.onNodeMoved = function(node: any) {
      if (originalOnNodeMoved) originalOnNodeMoved.apply(this, [node]);
      debouncedSave();
    };

    const originalOnNodeSelectionMoved = (canvas as any).onNodeSelectionMoved;
    (canvas as any).onNodeSelectionMoved = function() {
      if (originalOnNodeSelectionMoved) originalOnNodeSelectionMoved.apply(this, []);
      debouncedSave();
    };

    // Cleanup
    return () => {
      graph.stop()
    }
  }, [onGraphReady, onScaleChange])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current || !canvasInstanceRef.current) return
      const parent = canvasRef.current.parentElement
      if (!parent) return
      const { clientWidth, clientHeight } = parent
      if (!clientWidth || !clientHeight) return
      canvasInstanceRef.current.resize(clientWidth, clientHeight)
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Handle keyboard shortcuts (Backspace/Delete for node deletion)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const isInputActive = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
      
      if (isInputActive) return

      // Undo: Ctrl+Z
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }

      // Redo: Ctrl+Shift+Z or Ctrl+Y
      if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && e.shiftKey) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y')) {
        e.preventDefault();
        redo();
        return;
      }

      // Delete selected nodes with Backspace or Delete key
      if (e.key === 'Backspace' || e.key === 'Delete') {
        const canvas = canvasInstanceRef.current
        if (canvas && canvas.selected_nodes) {
          const selectedNodes = Object.values(canvas.selected_nodes)
          if (selectedNodes.length > 0 && graphRef.current) {
            for (const node of selectedNodes) {
              graphRef.current.remove(node)
            }
            canvas.selected_nodes = {}
            canvas.setDirty(true, true)
            e.preventDefault()
            e.stopPropagation()
          }
        }
      }
    }

    // Use capture to handle event before LiteGraph
    window.addEventListener('keydown', handleKeyDown, true)
    return () => window.removeEventListener('keydown', handleKeyDown, true)
  }, [])

  // Auto-load saved graph on mount
  useEffect(() => {
    const data = localStorage.getItem('viemplay-graph')
    if (data && graphRef.current) {
      try {
        graphRef.current.configure(JSON.parse(data))
      } catch (e) {
        console.error('Failed to auto-load graph:', e)
      }
    }
  }, [])

  return (
    <div className="canvas-container">
      {/* Canvas */}
      <canvas ref={canvasRef} className="litegraph-canvas" />
    </div>
  )
})

Canvas.displayName = 'Canvas'
