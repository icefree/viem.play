import { useRef, useEffect } from 'react'
import { LGraph, LGraphCanvas, LGraphNode } from 'litegraph.js'
import './Minimap.css'

interface MinimapProps {
  graph: LGraph | null
  canvas: LGraphCanvas | null
}

export const Minimap = ({ graph, canvas }: MinimapProps) => {
  const minimapCanvasRef = useRef<HTMLCanvasElement>(null)
  const mappingRef = useRef({ minX: 0, minY: 0, scale: 1, offsetX: 0, offsetY: 0 })
  
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!graph || !canvas || !minimapCanvasRef.current) return
    
    const rect = minimapCanvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const { minX, minY, scale, offsetX, offsetY } = mappingRef.current
    
    // Convert minimap coordinates back to graph coordinates
    const graphX = (x - offsetX) / scale + minX
    const graphY = (y - offsetY) / scale + minY
    
    // Pan canvas to center this point
    const viewW = canvas.canvas.width / canvas.ds.scale
    const viewH = canvas.canvas.height / canvas.ds.scale
    
    // eslint-disable-next-line
    canvas.ds.offset[0] = - (graphX - viewW / 2) * canvas.ds.scale
    // eslint-disable-next-line
    canvas.ds.offset[1] = - (graphY - viewH / 2) * canvas.ds.scale
    
    canvas.setDirty(true, true)
  }

  useEffect(() => {
    if (!graph || !canvas || !minimapCanvasRef.current) return
    
    let animationId: number
    const ctx = minimapCanvasRef.current.getContext('2d')
    if (!ctx) return
    
    const draw = () => {
      if (!graph || !canvas || !minimapCanvasRef.current) return
      
      const width = minimapCanvasRef.current.width
      const height = minimapCanvasRef.current.height
      
      // Clear
      ctx.clearRect(0, 0, width, height)
      
      // Get all nodes and their bounds
      const nodes = (graph as any)._nodes as LGraphNode[]
      if (!nodes || nodes.length === 0) {
        animationId = requestAnimationFrame(draw)
        return
      }
      
      // Calculate total bounds of nodes
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
      nodes.forEach((node: LGraphNode) => {
        minX = Math.min(minX, node.pos[0])
        minY = Math.min(minY, node.pos[1])
        maxX = Math.max(maxX, node.pos[0] + node.size[0])
        maxY = Math.max(maxY, node.pos[1] + node.size[1])
      })
      
      // Also consider current view in bounds to ensure we see where we are
      const viewX = -canvas.ds.offset[0] / canvas.ds.scale
      const viewY = -canvas.ds.offset[1] / canvas.ds.scale
      const viewW = canvas.canvas.width / canvas.ds.scale
      const viewH = canvas.canvas.height / canvas.ds.scale
      
      minX = Math.min(minX, viewX)
      minY = Math.min(minY, viewY)
      maxX = Math.max(maxX, viewX + viewW)
      maxY = Math.max(maxY, viewY + viewH)
      
      // Add padding
      const padding = 100
      minX -= padding
      minY -= padding
      maxX += padding
      maxY += padding
      
      const contentW = maxX - minX
      const contentH = maxY - minY
      
      // Scale to fit minimap
      const scaleX = width / contentW
      const scaleY = height / contentH
      const scale = Math.min(scaleX, scaleY)
      
      const offsetX = (width - contentW * scale) / 2
      const offsetY = (height - contentH * scale) / 2
      
      // Store for click handling
      mappingRef.current = { minX, minY, scale, offsetX, offsetY }
      
      const toMinimapX = (x: number) => (x - minX) * scale + offsetX
      const toMinimapY = (y: number) => (y - minY) * scale + offsetY
      
      // Draw nodes
      ctx.fillStyle = 'rgba(88, 166, 255, 0.5)'
      nodes.forEach((node: LGraphNode) => {
        const nx = toMinimapX(node.pos[0])
        const ny = toMinimapY(node.pos[1])
        const nw = node.size[0] * scale
        const nh = node.size[1] * scale
        ctx.fillRect(nx, ny, Math.max(nw, 2), Math.max(nh, 2))
      })
      
      // Draw viewport
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
      ctx.lineWidth = 1
      const vx = toMinimapX(viewX)
      const vy = toMinimapY(viewY)
      const vw = viewW * scale
      const vh = viewH * scale
      ctx.strokeRect(vx, vy, vw, vh)
      
      // Draw semi-transparent overlay for outside viewport
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
      // Top
      ctx.fillRect(0, 0, width, vy)
      // Bottom
      ctx.fillRect(0, vy + vh, width, height - (vy + vh))
      // Left
      ctx.fillRect(0, vy, vx, vh)
      // Right
      ctx.fillRect(vx + vw, vy, width - (vx + vw), vh)
      
      animationId = requestAnimationFrame(draw)
    }
    
    animationId = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animationId)
  }, [graph, canvas])
  
  return (
    <div className="minimap-container">
      <div className="minimap-label">Overview</div>
      <canvas 
        ref={minimapCanvasRef} 
        width={200} 
        height={120} 
        className="minimap-canvas"
        onClick={handleCanvasClick}
      />
    </div>
  )
}
