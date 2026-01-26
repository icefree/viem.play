import { Canvas } from './components/Canvas'
import './App.css'

function App() {
  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">Viem Playground</span>
        </div>
        <div className="header-info">
          <span className="info-text">可视化区块链交互工具</span>
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

      {/* Main Canvas */}
      <main className="app-main">
        <Canvas />
      </main>

      {/* Help Panel */}
      <aside className="help-panel">
        <h3>🚀 快速开始</h3>
        <ol>
          <li>右键点击画布添加节点</li>
          <li>连接 <code>Chain</code> → <code>PublicClient</code></li>
          <li>连接 <code>Address</code> + <code>Client</code> → <code>GetBalance</code></li>
          <li>连接 <code>GetBalance</code> → <code>Display</code></li>
        </ol>
        <h4>📦 可用节点</h4>
        <ul>
          <li><strong>core/</strong> TextInput, Address, Display</li>
          <li><strong>viem/</strong> Chain, PublicClient</li>
          <li><strong>viem/</strong> GetBalance, GetBlockNumber, GetGasPrice</li>
        </ul>
      </aside>
    </div>
  )
}

export default App
