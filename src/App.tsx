import { useState, useCallback, useEffect, useRef } from 'react'
import { LGraph } from 'litegraph.js'
import { Canvas } from './components/Canvas'
import { NodeToolbar } from './components/NodeToolbar'
import { NodeSearch } from './components/NodeSearch'
import './App.css'

function App() {
  const [graph, setGraph] = useState<LGraph | null>(null)
  // 追踪鼠标在画布上的位置
  const mousePositionRef = useRef<{ x: number; y: number }>({ x: 400, y: 300 })

  const handleGraphReady = useCallback((g: LGraph) => {
    setGraph(g)
  }, [])

  // 监听鼠标移动，记录最后位置
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // 获取鼠标位置的函数（传递给子组件）
  const getMousePosition = useCallback(() => mousePositionRef.current, [])

  // Save graph to localStorage
  const saveGraph = useCallback(() => {
    if (graph) {
      const data = JSON.stringify(graph.serialize())
      localStorage.setItem('viemplay-graph', data)
      console.log('[ViemPlay] Graph saved')
    }
  }, [graph])

  // Load graph from localStorage
  const loadGraph = useCallback(() => {
    const data = localStorage.getItem('viemplay-graph')
    if (data && graph) {
      try {
        graph.configure(JSON.parse(data))
        console.log('[ViemPlay] Graph loaded')
      } catch (e) {
        console.error('Failed to load graph:', e)
      }
    }
  }, [graph])

  // Clear graph
  const clearGraph = useCallback(() => {
    if (graph) {
      graph.clear()
      console.log('[ViemPlay] Graph cleared')
    }
  }, [graph])

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">Viem Playground</span>
        </div>

        <div className="header-actions">
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

        <div className="header-info">
          <a
            href="https://viem.sh"
            target="_blank"
            rel="noopener noreferrer"
            className="docs-link"
          >
            📖 Viem Docs
          </a>
        </div>
      </header>

      {/* Node Toolbar - eth.build style */}
      <NodeToolbar graph={graph} getMousePosition={getMousePosition} />

      {/* Main Canvas */}
      <main className="app-main">
        <Canvas onGraphReady={handleGraphReady} />
      </main>

      {/* Node Search Modal (Space key) */}
      <NodeSearch graph={graph} getMousePosition={getMousePosition} />

      {/* Compact Help */}
      <aside className="help-panel compact">
        <p>💡 鼠标悬停顶部分类查看节点 · 按 <kbd>{navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}</kbd> + <kbd>K</kbd> 快速搜索</p>
      </aside>
    </div>
  )
}

export default App
