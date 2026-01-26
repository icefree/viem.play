import { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react'
import { LGraph, LGraphCanvas } from 'litegraph.js'
import 'litegraph.js/css/litegraph.css'
import { registerAllNodes } from '../nodes'

export interface CanvasHandle {
  getGraph: () => LGraph | null
}

interface CanvasProps {
  onGraphReady?: (graph: LGraph) => void
}

export const Canvas = forwardRef<CanvasHandle, CanvasProps>(({ onGraphReady }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const graphRef = useRef<LGraph | null>(null)
  const canvasInstanceRef = useRef<LGraphCanvas | null>(null)

  // Expose graph via ref
  useImperativeHandle(ref, () => ({
    getGraph: () => graphRef.current
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

    // Notify parent
    onGraphReady?.(graph)

    // Cleanup
    return () => {
      graph.stop()
    }
  }, [onGraphReady])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && canvasInstanceRef.current) {
        canvasRef.current.width = window.innerWidth
        canvasRef.current.height = window.innerHeight
        canvasInstanceRef.current.resize()
      }
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
