import { useRef, useEffect, useCallback } from 'react'
import { LGraph, LGraphCanvas } from 'litegraph.js'
import 'litegraph.js/css/litegraph.css'
import { registerAllNodes } from '../nodes'

interface CanvasProps {
  onGraphChange?: (graph: LGraph) => void
}

export function Canvas({ onGraphChange }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const graphRef = useRef<LGraph | null>(null)
  const canvasInstanceRef = useRef<LGraphCanvas | null>(null)

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

    // Configure canvas appearance
    canvas.background_image = undefined
    canvas.render_shadows = false
    canvas.clear_background = true
    canvas.render_curved_connections = true
    canvas.render_connection_arrows = true

    // Start running the graph
    graph.start()

    // Notify parent
    onGraphChange?.(graph)

    // Cleanup
    return () => {
      graph.stop()
    }
  }, [onGraphChange])

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

  // Save graph to localStorage
  const saveGraph = useCallback(() => {
    if (graphRef.current) {
      const data = JSON.stringify(graphRef.current.serialize())
      localStorage.setItem('viemplay-graph', data)
      console.log('[ViemPlay] Graph saved')
    }
  }, [])

  // Load graph from localStorage
  const loadGraph = useCallback(() => {
    const data = localStorage.getItem('viemplay-graph')
    if (data && graphRef.current) {
      try {
        graphRef.current.configure(JSON.parse(data))
        console.log('[ViemPlay] Graph loaded')
      } catch (e) {
        console.error('Failed to load graph:', e)
      }
    }
  }, [])

  // Clear graph
  const clearGraph = useCallback(() => {
    if (graphRef.current) {
      graphRef.current.clear()
      console.log('[ViemPlay] Graph cleared')
    }
  }, [])

  // Expose methods to parent via ref
  useEffect(() => {
    // Auto-load saved graph on mount
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
      {/* Toolbar */}
      <div className="canvas-toolbar">
        <button onClick={saveGraph} className="toolbar-btn">
          💾 Save
        </button>
        <button onClick={loadGraph} className="toolbar-btn">
          📂 Load
        </button>
        <button onClick={clearGraph} className="toolbar-btn danger">
          🗑️ Clear
        </button>
      </div>

      {/* Canvas */}
      <canvas ref={canvasRef} className="litegraph-canvas" />
    </div>
  )
}
