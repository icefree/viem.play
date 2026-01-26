import { useState, useCallback } from 'react'
import { LGraph } from 'litegraph.js'
import { Canvas } from './components/Canvas'
import { NodeToolbar } from './components/NodeToolbar'
import { NodeSearch } from './components/NodeSearch'
import './App.css'

function App() {
  const [graph, setGraph] = useState<LGraph | null>(null)

  const handleGraphReady = useCallback((g: LGraph) => {
    setGraph(g)
  }, [])

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">Viem Playground</span>
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
      <NodeToolbar graph={graph} />

      {/* Main Canvas */}
      <main className="app-main">
        <Canvas onGraphReady={handleGraphReady} />
      </main>

      {/* Node Search Modal (Space key) */}
      <NodeSearch graph={graph} />

      {/* Compact Help */}
      <aside className="help-panel compact">
        <p>💡 鼠标悬停顶部分类查看节点 · 按 <kbd>Space</kbd> 快速搜索</p>
      </aside>
    </div>
  )
}

export default App
