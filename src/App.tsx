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
          <li>连接 <code>Chains/Chain</code> → <code>Clients/PublicClient</code></li>
          <li>添加 <code>Utilities/Address</code> 输入地址</li>
          <li>连接到 <code>Public Actions/getBalance</code></li>
        </ol>
        <h4>📦 节点分组</h4>
        <ul>
          <li><strong>Clients</strong> PublicClient, WalletClient</li>
          <li><strong>Public Actions</strong> getBalance, getBlockNumber, getGasPrice</li>
          <li><strong>Chains</strong> Chain, ChainId, ChainInfo</li>
          <li><strong>Utilities</strong> Address, Display, formatEther</li>
        </ul>
      </aside>
    </div>
  )
}

export default App
