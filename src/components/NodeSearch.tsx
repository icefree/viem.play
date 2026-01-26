import { useState, useEffect, useCallback, useRef } from 'react'
import { LGraph, LiteGraph } from 'litegraph.js'
import './NodeSearch.css'

interface NodeItem {
  type: string
  label: string
  category: string
}

export function NodeSearch({ graph, getMousePosition }: NodeSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [allNodes, setAllNodes] = useState<NodeItem[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  // Dynamically build all nodes list from LiteGraph
  useEffect(() => {
    const buildNodesList = () => {
      const types = Object.keys(LiteGraph.registered_node_types)
      const nodeList: NodeItem[] = types.map(type => {
        const parts = type.split('/')
        return {
          type,
          label: parts[parts.length - 1],
          category: parts.slice(0, -1).join(' > ')
        }
      })
      // Sort alphabetically by label
      nodeList.sort((a, b) => a.label.localeCompare(b.label))
      setAllNodes(nodeList)
    }

    if (isOpen) {
      buildNodesList()
    }
  }, [isOpen])

  // 过滤节点
  const filteredNodes = query.trim()
    ? allNodes.filter(node =>
        node.label.toLowerCase().includes(query.toLowerCase()) ||
        node.category.toLowerCase().includes(query.toLowerCase())
      )
    : allNodes

  // 添加节点
  const addNode = useCallback((nodeType: string) => {
    if (!graph) return

    const node = LiteGraph.createNode(nodeType)
    if (node) {
      // 设置节点标题为组件名（从 type 中提取）
      const componentName = nodeType.split('/').pop() || nodeType
      node.title = componentName
      
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
      // Command+K 或 Ctrl+K 打开搜索
      if ((e.metaKey || e.ctrlKey) && e.key === 'k' && !isOpen) {
        e.preventDefault()
        e.stopPropagation()
        setIsOpen(true)
        return
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
            placeholder="Search nodes... (↑↓ to select, Enter to add, Esc to close)"
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
            <div className="search-no-results">No nodes found</div>
          )}
        </div>
        <div className="search-hint">
          Press <kbd>{navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}</kbd> + <kbd>K</kbd> to open · <kbd>↑</kbd><kbd>↓</kbd> to select · <kbd>Enter</kbd> to add · <kbd>Esc</kbd> to close
        </div>
      </div>
    </div>
  )
}
