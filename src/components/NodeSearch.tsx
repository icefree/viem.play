import { useState, useEffect, useCallback, useRef } from 'react'
import { LGraph, LiteGraph } from 'litegraph.js'
import './NodeSearch.css'

// 所有节点的扁平列表
const ALL_NODES = [
  // Clients
  { type: 'Clients/PublicClient', label: 'PublicClient', category: 'Clients' },
  { type: 'Clients/WalletClient', label: 'WalletClient', category: 'Clients' },
  { type: 'Clients/TestClient', label: 'TestClient', category: 'Clients' },
  // Public Actions
  { type: 'Public Actions/getBalance', label: 'getBalance', category: 'Public Actions' },
  { type: 'Public Actions/getBlockNumber', label: 'getBlockNumber', category: 'Public Actions' },
  { type: 'Public Actions/getGasPrice', label: 'getGasPrice', category: 'Public Actions' },
  { type: 'Public Actions/getBlock', label: 'getBlock', category: 'Public Actions' },
  { type: 'Public Actions/getTransactionCount', label: 'getTransactionCount', category: 'Public Actions' },
  // Wallet Actions
  { type: 'Wallet Actions/sendTransaction', label: 'sendTransaction', category: 'Wallet Actions' },
  { type: 'Wallet Actions/signMessage', label: 'signMessage', category: 'Wallet Actions' },
  { type: 'Wallet Actions/signTypedData', label: 'signTypedData', category: 'Wallet Actions' },
  { type: 'Wallet Actions/switchChain', label: 'switchChain', category: 'Wallet Actions' },
  { type: 'Wallet Actions/getAddresses', label: 'getAddresses', category: 'Wallet Actions' },
  // Test Actions
  { type: 'Test Actions/setBalance', label: 'setBalance', category: 'Test Actions' },
  { type: 'Test Actions/mine', label: 'mine', category: 'Test Actions' },
  { type: 'Test Actions/impersonateAccount', label: 'impersonateAccount', category: 'Test Actions' },
  { type: 'Test Actions/setNextBlockTimestamp', label: 'setNextBlockTimestamp', category: 'Test Actions' },
  { type: 'Test Actions/snapshot', label: 'snapshot', category: 'Test Actions' },
  { type: 'Test Actions/revert', label: 'revert', category: 'Test Actions' },
  // Accounts
  { type: 'Accounts/privateKeyToAccount', label: 'privateKeyToAccount', category: 'Accounts' },
  { type: 'Accounts/mnemonicToAccount', label: 'mnemonicToAccount', category: 'Accounts' },
  { type: 'Accounts/generatePrivateKey', label: 'generatePrivateKey', category: 'Accounts' },
  { type: 'Accounts/generateMnemonic', label: 'generateMnemonic', category: 'Accounts' },
  { type: 'Accounts/toAccount', label: 'toAccount', category: 'Accounts' },
  // Chains
  { type: 'Chains/Chain', label: 'Chain', category: 'Chains' },
  { type: 'Chains/ChainId', label: 'ChainId', category: 'Chains' },
  { type: 'Chains/ChainInfo', label: 'ChainInfo', category: 'Chains' },
  // Contract
  { type: 'Contract/readContract', label: 'readContract', category: 'Contract' },
  { type: 'Contract/writeContract', label: 'writeContract', category: 'Contract' },
  { type: 'Contract/simulateContract', label: 'simulateContract', category: 'Contract' },
  { type: 'Contract/getContractEvents', label: 'getContractEvents', category: 'Contract' },
  { type: 'Contract/deployContract', label: 'deployContract', category: 'Contract' },
  // ENS
  { type: 'ENS/getEnsAddress', label: 'getEnsAddress', category: 'ENS' },
  { type: 'ENS/getEnsName', label: 'getEnsName', category: 'ENS' },
  { type: 'ENS/getEnsAvatar', label: 'getEnsAvatar', category: 'ENS' },
  { type: 'ENS/getEnsText', label: 'getEnsText', category: 'ENS' },
  // SIWE
  { type: 'SIWE/createSiweMessage', label: 'createSiweMessage', category: 'SIWE' },
  { type: 'SIWE/verifySiweMessage', label: 'verifySiweMessage', category: 'SIWE' },
  { type: 'SIWE/parseSiweMessage', label: 'parseSiweMessage', category: 'SIWE' },
  // ABI
  { type: 'ABI/parseAbi', label: 'parseAbi', category: 'ABI' },
  { type: 'ABI/encodeAbiParameters', label: 'encodeAbiParameters', category: 'ABI' },
  { type: 'ABI/decodeAbiParameters', label: 'decodeAbiParameters', category: 'ABI' },
  { type: 'ABI/encodeFunctionData', label: 'encodeFunctionData', category: 'ABI' },
  { type: 'ABI/decodeFunctionResult', label: 'decodeFunctionResult', category: 'ABI' },
  { type: 'ABI/decodeEventLog', label: 'decodeEventLog', category: 'ABI' },
  // EIP-7702
  { type: 'EIP-7702/signAuthorization', label: 'signAuthorization', category: 'EIP-7702' },
  { type: 'EIP-7702/recoverAuthorizationAddress', label: 'recoverAuthorizationAddress', category: 'EIP-7702' },
  { type: 'EIP-7702/verifyAuthorization', label: 'verifyAuthorization', category: 'EIP-7702' },
  // Utilities
  { type: 'Utilities/Text', label: 'Text', category: 'Utilities' },
  { type: 'Utilities/Number', label: 'Number', category: 'Utilities' },
  { type: 'Utilities/Address', label: 'Address', category: 'Utilities' },
  { type: 'Utilities/Bytes32', label: 'Bytes32', category: 'Utilities' },
  { type: 'Utilities/Display', label: 'Display', category: 'Utilities' },
  { type: 'Utilities/Console', label: 'Console', category: 'Utilities' },
  { type: 'Utilities/toBigInt', label: 'toBigInt', category: 'Utilities' },
  { type: 'Utilities/formatEther', label: 'formatEther', category: 'Utilities' },
  { type: 'Utilities/parseEther', label: 'parseEther', category: 'Utilities' },
  // Glossary
  { type: 'Glossary/Terms', label: 'Terms', category: 'Glossary' },
  { type: 'Glossary/Units', label: 'Units', category: 'Glossary' },
  { type: 'Glossary/ChainIds', label: 'ChainIds', category: 'Glossary' },
]

interface NodeSearchProps {
  graph: LGraph | null
  getMousePosition: () => { x: number; y: number }
}

export function NodeSearch({ graph, getMousePosition }: NodeSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // 过滤节点
  const filteredNodes = query.trim()
    ? ALL_NODES.filter(node =>
        node.label.toLowerCase().includes(query.toLowerCase()) ||
        node.category.toLowerCase().includes(query.toLowerCase())
      )
    : ALL_NODES

  // 添加节点
  const addNode = useCallback((nodeType: string) => {
    if (!graph) return

    const node = LiteGraph.createNode(nodeType)
    if (node) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const canvas = (graph as any).canvas
      const mousePos = getMousePosition()
      
      if (canvas) {
        // 将屏幕坐标转换为画布坐标
        const canvasX = (mousePos.x - canvas.ds.offset[0]) / canvas.ds.scale
        const canvasY = (mousePos.y - canvas.ds.offset[1]) / canvas.ds.scale
        // 以鼠标位置为中心
        node.pos = [canvasX - (node.size?.[0] || 200) / 2, canvasY - (node.size?.[1] || 60) / 2]
      } else {
        node.pos = [mousePos.x, mousePos.y]
      }
      graph.add(node)
    }
    setIsOpen(false)
    setQuery('')
    setSelectedIndex(0)
  }, [graph, getMousePosition])

  // 键盘事件处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 空格键打开搜索（当不在输入框中且不是在节点输入时）
      // 使用 capture 阶段拦截事件，防止被 LiteGraph 消费
      if (e.code === 'Space' && !isOpen) {
        const target = e.target as HTMLElement
        const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
        if (!isInput) {
          e.preventDefault()
          e.stopPropagation()
          setIsOpen(true)
          return
        }
      }

      if (!isOpen) return

      switch (e.key) {
        case 'Escape':
          setIsOpen(false)
          setQuery('')
          setSelectedIndex(0)
          break
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => Math.min(prev + 1, filteredNodes.length - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => Math.max(prev - 1, 0))
          break
        case 'Enter':
          e.preventDefault()
          if (filteredNodes[selectedIndex]) {
            addNode(filteredNodes[selectedIndex].type)
          }
          break
      }
    }

    // 使用 capture 模式，在事件到达 LiteGraph 之前捕获
    window.addEventListener('keydown', handleKeyDown, true)
    return () => window.removeEventListener('keydown', handleKeyDown, true)
  }, [isOpen, filteredNodes, selectedIndex, addNode])

  // 打开时聚焦输入框
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="node-search-overlay" onClick={() => setIsOpen(false)}>
      <div className="node-search-modal" onClick={e => e.stopPropagation()}>
        <div className="search-header">
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="搜索节点... (按 ↑↓ 选择, Enter 添加, Esc 关闭)"
            value={query}
            onChange={e => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
          />
        </div>
        <div className="search-results">
          {filteredNodes.slice(0, 15).map((node, index) => (
            <div
              key={node.type}
              className={`search-result-item ${index === selectedIndex ? 'selected' : ''}`}
              onClick={() => addNode(node.type)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <span className="result-label">{node.label}</span>
              <span className="result-category">{node.category}</span>
            </div>
          ))}
          {filteredNodes.length === 0 && (
            <div className="search-no-results">没有找到匹配的节点</div>
          )}
        </div>
        <div className="search-hint">
          按 <kbd>Space</kbd> 打开 · <kbd>↑</kbd><kbd>↓</kbd> 选择 · <kbd>Enter</kbd> 添加 · <kbd>Esc</kbd> 关闭
        </div>
      </div>
    </div>
  )
}
