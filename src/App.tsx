import { useState, useCallback, useEffect, useRef } from 'react'
import { LGraph } from 'litegraph.js'
import { Canvas } from './components/Canvas'
import type { CanvasHandle } from './components/Canvas'
import { NodeToolbar } from './components/NodeToolbar'
import { NodeSearch } from './components/NodeSearch'
import { Minimap } from './components/Minimap'
import { ShortcutsPanel } from './components/ShortcutsPanel'
import { generateShareUrl, parseShareUrl, copyToClipboard } from './utils/shareUtils'
import './App.css'

function App() {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [graph, setGraph] = useState<LGraph | null>(null)
  const [canvasInstance, setCanvasInstance] = useState<any>(null)
  const [scale, setScale] = useState(1)
  const [isScaleMenuOpen, setIsScaleMenuOpen] = useState(false)
  const [shareText, setShareText] = useState('🔗 Share')
  
  const canvasRef = useRef<CanvasHandle>(null)
  const zoomLevels = [0.5, 0.75, 0.9, 1.0, 1.1, 1.25, 1.5, 2.0]

  // 追踪鼠标在画布上的位置
  const mousePositionRef = useRef<{ x: number; y: number }>({ x: 400, y: 300 })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleGraphReady = useCallback((g: LGraph) => {
    setGraph(g)
    // Get canvas instance after a short delay to ensure it's fully initialized
    setTimeout(() => {
      if (canvasRef.current) {
        setCanvasInstance(canvasRef.current.getCanvas())
      }
    }, 100)
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

  // Save graph to localStorage and download as file
  const saveGraph = useCallback(() => {
    if (graph) {
      const graphData = graph.serialize()
      const dataStr = JSON.stringify(graphData, null, 2)
      
      // Save to localStorage
      localStorage.setItem('viemplay-graph', dataStr)
      console.log('[ViemPlay] Graph saved to localStorage')

      // Download as file
      const blob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
      link.href = url
      link.download = `viem-play-design-${timestamp}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }, [graph])

  // Handle file upload
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !graph) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        const data = JSON.parse(content)
        graph.clear() // Clear existing graph before configuring
        graph.configure(data)
        
        // Also save to localStorage for persistence
        localStorage.setItem('viemplay-graph', content)
        console.log('[ViemPlay] Graph loaded from file')
      } catch (err) {
        console.error('Failed to load file:', err)
        alert('加载文件失败，请检查文件格式是否正确。')
      }
    }
    reader.readAsText(file)
    // Reset input value to allow uploading the same file again
    e.target.value = ''
  }, [graph])

  // Trigger file input for loading
  const loadGraph = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  // Clear graph
  const clearGraph = useCallback(() => {
    if (graph) {
      const confirmed = window.confirm('Are you sure you want to clear all nodes?')
      if (confirmed) {
        graph.clear()
        localStorage.removeItem('viemplay-graph')
        console.log('[ViemPlay] Graph cleared')
      }
    }
  }, [graph])

  // Handle Share to URL
  const handleShare = useCallback(async () => {
    if (!graph) return

    try {
      const data = graph.serialize()
      const url = await generateShareUrl(data)
      const success = await copyToClipboard(url)

      if (success) {
        setShareText('✅ Copied!')
        setTimeout(() => {
          setShareText('🔗 Share')
        }, 2000)
      } else {
        prompt('Copy this link:', url)
      }
    } catch (err) {
      console.error('Failed to generate share link:', err)
      alert('Failed to generate share link.')
    }
  }, [graph])

  // Load shared graph from URL
  useEffect(() => {
    const loadSharedGraph = async () => {
      if (!graph) return

      const sharedData = await parseShareUrl()
      if (sharedData) {
        try {
          // Give a small delay to ensure LiteGraph is ready and any local auto-load is done
          setTimeout(() => {
            graph.clear()
            graph.configure(sharedData)
            console.log('[ViemPlay] Shared graph loaded')
            
            // Clean up the URL only if we want to "consume" the share, 
            // but keeping it allows refreshing. Keeping it is better UX for sharing.
          }, 100)
        } catch (err) {
          console.error('Failed to load shared graph:', err)
        }
      }
    }

    loadSharedGraph()
  }, [graph])

  const handleScaleSelect = useCallback((newScale: number) => {
    if (graph && canvasInstance) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (canvasInstance as any).ds.scale = newScale;
      // Center the view slightly or just refresh
      canvasInstance.setDirty(true, true);
      setScale(newScale);
      setIsScaleMenuOpen(false);
    }
  }, [graph, canvasInstance])

  return (
    <div className="app">
      {/* Hidden file input for loading */}
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept=".json" 
        onChange={handleFileChange} 
      />

      {/* Header */}
      <header className="app-header">
        <div className="logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">Viem Playground</span>
          <div className="scale-container">
            <button 
              className={`scale-badge interactive ${isScaleMenuOpen ? 'active' : ''}`}
              onClick={() => setIsScaleMenuOpen(!isScaleMenuOpen)}
            >
              {(scale * 100).toFixed(0)}%
            </button>
            {isScaleMenuOpen && (
              <div className="scale-menu">
                {zoomLevels.map(z => (
                  <button 
                    key={z} 
                    className={`scale-item ${z === scale ? 'selected' : ''}`}
                    onClick={() => handleScaleSelect(z)}
                  >
                    {(z * 100).toFixed(0)}%
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="header-actions">
          <button 
            id="share-btn"
            onClick={handleShare} 
            className="toolbar-btn" 
            title="Share graph via URL"
          >
            {shareText}
          </button>
          <button onClick={saveGraph} className="toolbar-btn" title="Save design and download as JSON">
            💾 Save
          </button>
          <button onClick={loadGraph} className="toolbar-btn" title="Load design from JSON file">
            📂 Load
          </button>
          <button onClick={clearGraph} className="toolbar-btn danger" title="Clear workspace">
            🗑️ Clear
          </button>
        </div>

        <div className="header-tip">
          <p>💡 Hover categories to add nodes · Press <kbd>{navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}</kbd> + <kbd>K</kbd> to search</p>
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
        <Canvas ref={canvasRef} onGraphReady={handleGraphReady} onScaleChange={setScale} />
        <Minimap graph={graph} canvas={canvasInstance} />
      </main>

      {/* Node Search Modal (Space key) */}
      <NodeSearch graph={graph} getMousePosition={getMousePosition} />
      
      {/* Floating Shortcuts Panel */}
      <ShortcutsPanel />
    </div>
  )
}

export default App
