import { useRef, useCallback, useState, useEffect } from 'react'
import { LGraph, LiteGraph } from 'litegraph.js'
import './NodeToolbar.css'

// 节点分类配置
const NODE_CATEGORIES = [
  {
    name: 'Clients',
    color: '#276749',
    nodes: [
      { type: 'Clients/PublicClient', label: 'PublicClient' },
      { type: 'Clients/WalletClient', label: 'WalletClient' },
      { type: 'Clients/TestClient', label: 'TestClient' },
    ]
  },
  {
    name: 'Public Actions',
    color: '#6b46c1',
    nodes: [
      { type: 'Public Actions/getBalance', label: 'getBalance' },
      { type: 'Public Actions/getBlockNumber', label: 'getBlockNumber' },
      { type: 'Public Actions/getGasPrice', label: 'getGasPrice' },
      { type: 'Public Actions/getBlock', label: 'getBlock' },
      { type: 'Public Actions/getTransactionCount', label: 'getTransactionCount' },
    ]
  },
  {
    name: 'Wallet Actions',
    color: '#c53030',
    nodes: [
      { type: 'Wallet Actions/sendTransaction', label: 'sendTransaction' },
      { type: 'Wallet Actions/signMessage', label: 'signMessage' },
      { type: 'Wallet Actions/signTypedData', label: 'signTypedData' },
      { type: 'Wallet Actions/switchChain', label: 'switchChain' },
      { type: 'Wallet Actions/getAddresses', label: 'getAddresses' },
    ]
  },
  {
    name: 'Test Actions',
    color: '#805ad5',
    nodes: [
      { type: 'Test Actions/setBalance', label: 'setBalance' },
      { type: 'Test Actions/mine', label: 'mine' },
      { type: 'Test Actions/impersonateAccount', label: 'impersonateAccount' },
      { type: 'Test Actions/setNextBlockTimestamp', label: 'setNextBlockTimestamp' },
      { type: 'Test Actions/snapshot', label: 'snapshot' },
      { type: 'Test Actions/revert', label: 'revert' },
    ]
  },
  {
    name: 'Accounts',
    color: '#d69e2e',
    nodes: [
      { type: 'Accounts/privateKeyToAccount', label: 'privateKeyToAccount' },
      { type: 'Accounts/mnemonicToAccount', label: 'mnemonicToAccount' },
      { type: 'Accounts/generatePrivateKey', label: 'generatePrivateKey' },
      { type: 'Accounts/generateMnemonic', label: 'generateMnemonic' },
      { type: 'Accounts/toAccount', label: 'toAccount' },
    ]
  },
  {
    name: 'Chains',
    color: '#2c5282',
    nodes: [
      { type: 'Chains/Chain', label: 'Chain' },
      { type: 'Chains/ChainId', label: 'ChainId' },
      { type: 'Chains/ChainInfo', label: 'ChainInfo' },
    ]
  },
  {
    name: 'Contract',
    color: '#3182ce',
    nodes: [
      { type: 'Contract/readContract', label: 'readContract' },
      { type: 'Contract/writeContract', label: 'writeContract' },
      { type: 'Contract/simulateContract', label: 'simulateContract' },
      { type: 'Contract/getContractEvents', label: 'getContractEvents' },
      { type: 'Contract/deployContract', label: 'deployContract' },
    ]
  },
  {
    name: 'ENS',
    color: '#319795',
    nodes: [
      { type: 'ENS/getEnsAddress', label: 'getEnsAddress' },
      { type: 'ENS/getEnsName', label: 'getEnsName' },
      { type: 'ENS/getEnsAvatar', label: 'getEnsAvatar' },
      { type: 'ENS/getEnsText', label: 'getEnsText' },
    ]
  },
  {
    name: 'SIWE',
    color: '#ed8936',
    nodes: [
      { type: 'SIWE/createSiweMessage', label: 'createSiweMessage' },
      { type: 'SIWE/verifySiweMessage', label: 'verifySiweMessage' },
      { type: 'SIWE/parseSiweMessage', label: 'parseSiweMessage' },
    ]
  },
  {
    name: 'ABI',
    color: '#e53e3e',
    nodes: [
      { type: 'ABI/parseAbi', label: 'parseAbi' },
      { type: 'ABI/encodeAbiParameters', label: 'encodeAbiParameters' },
      { type: 'ABI/decodeAbiParameters', label: 'decodeAbiParameters' },
      { type: 'ABI/encodeFunctionData', label: 'encodeFunctionData' },
      { type: 'ABI/decodeFunctionResult', label: 'decodeFunctionResult' },
      { type: 'ABI/decodeEventLog', label: 'decodeEventLog' },
    ]
  },
  {
    name: 'EIP-7702',
    color: '#667eea',
    nodes: [
      { type: 'EIP-7702/signAuthorization', label: 'signAuthorization' },
      { type: 'EIP-7702/recoverAuthorizationAddress', label: 'recoverAuthorizationAddress' },
      { type: 'EIP-7702/verifyAuthorization', label: 'verifyAuthorization' },
    ]
  },
  {
    name: 'Utilities',
    color: '#38a169',
    nodes: [
      { type: 'Utilities/Text', label: 'Text' },
      { type: 'Utilities/Number', label: 'Number' },
      { type: 'Utilities/Address', label: 'Address' },
      { type: 'Utilities/Bytes32', label: 'Bytes32' },
      { type: 'Utilities/Display', label: 'Display' },
      { type: 'Utilities/Console', label: 'Console' },
      { type: 'Utilities/toBigInt', label: 'toBigInt' },
      { type: 'Utilities/formatEther', label: 'formatEther' },
      { type: 'Utilities/parseEther', label: 'parseEther' },
    ]
  },
  {
    name: 'Glossary',
    color: '#718096',
    nodes: [
      { type: 'Glossary/Terms', label: 'Terms' },
      { type: 'Glossary/Units', label: 'Units' },
      { type: 'Glossary/ChainIds', label: 'ChainIds' },
    ]
  },
]

interface NodeToolbarProps {
  graph: LGraph | null
  getMousePosition: () => { x: number; y: number }
}

export function NodeToolbar({ graph, getMousePosition }: NodeToolbarProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [dropdownPosition, setDropdownPosition] = useState<{ left: number } | null>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<number | null>(null)

  // 添加节点到画布
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
      setActiveCategory(null)
    }
  }, [graph, getMousePosition])

  // 处理鼠标进入分类
  const handleMouseEnter = useCallback((categoryName: string, event: React.MouseEvent<HTMLButtonElement>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    const rect = event.currentTarget.getBoundingClientRect()
    setDropdownPosition({ left: rect.left })
    setActiveCategory(categoryName)
  }, [])

  // 处理鼠标离开
  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = window.setTimeout(() => {
      setActiveCategory(null)
      setDropdownPosition(null)
    }, 200)
  }, [])

  // 处理下拉菜单鼠标进入
  const handleDropdownEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const activeNodes = NODE_CATEGORIES.find(c => c.name === activeCategory)?.nodes || []
  const activeColor = NODE_CATEGORIES.find(c => c.name === activeCategory)?.color || '#4a5568'

  return (
    <div className="node-toolbar" ref={toolbarRef}>
      <div className="node-toolbar-categories">
        {NODE_CATEGORIES.map((category) => (
          <button
            key={category.name}
            className={`category-btn ${activeCategory === category.name ? 'active' : ''}`}
            style={{ 
              '--category-color': category.color,
              backgroundColor: activeCategory === category.name ? category.color : undefined
            } as React.CSSProperties}
            onMouseEnter={(e) => handleMouseEnter(category.name, e)}
            onMouseLeave={handleMouseLeave}
          >
            {category.name.toUpperCase()}
          </button>
        ))}
      </div>

      {/* 下拉节点列表 */}
      {activeCategory && dropdownPosition && (
        <div 
          className="node-dropdown"
          style={{ left: dropdownPosition.left }}
          onMouseEnter={handleDropdownEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="dropdown-header" style={{ backgroundColor: activeColor }}>
            {activeCategory.toUpperCase()}
          </div>
          <div className="dropdown-nodes">
            {activeNodes.map((node) => (
              <button
                key={node.type}
                className="node-btn"
                style={{ '--node-color': activeColor } as React.CSSProperties}
                onClick={() => addNode(node.type)}
              >
                {node.label.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
