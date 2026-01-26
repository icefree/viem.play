import { useRef, useCallback, useState, useEffect } from 'react'
import { LGraph, LiteGraph } from 'litegraph.js'
import './NodeToolbar.css'

// Define the base categories and their colors
const CATEGORY_CONFIG: Record<string, { color: string }> = {
  'Clients & Transports': { color: '#276749' },
  'Public Actions': { color: '#6b46c1' },
  'Wallet Actions': { color: '#c53030' },
  'Test Actions': { color: '#805ad5' },
  'Accounts': { color: '#d69e2e' },
  'Chains': { color: '#2c5282' },
  'Contract': { color: '#3182ce' },
  'ENS': { color: '#319795' },
  'SIWE': { color: '#ed8936' },
  'ABI': { color: '#e53e3e' },
  'EIP-7702': { color: '#667eea' },
  'Utilities': { color: '#38a169' },
  'Glossary': { color: '#718096' },
}

interface NodeItem {
  type: string
  label: string
}

interface SubCategory {
  name: string
  nodes: NodeItem[]
}

interface Category {
  name: string
  color: string
  subcategories: SubCategory[]
  directNodes: NodeItem[]
}

interface NodeToolbarProps {
  graph: LGraph | null
  getMousePosition: () => { x: number; y: number }
}

export function NodeToolbar({ graph, getMousePosition }: NodeToolbarProps) {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null)
  const [dropdownPosition, setDropdownPosition] = useState<{ left: number } | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const toolbarRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<number | null>(null)

  // Dynamically build categories from LiteGraph
  useEffect(() => {
    const buildCategories = () => {
      const types = Object.keys(LiteGraph.registered_node_types)
      const catMap = new Map<string, Category>()

      // Initialize based on our config to preserve order
      Object.keys(CATEGORY_CONFIG).forEach(name => {
        catMap.set(name, {
          name,
          color: CATEGORY_CONFIG[name].color,
          subcategories: [],
          directNodes: []
        })
      })

      types.forEach(type => {
        const parts = type.split('/')
        if (parts.length < 2) return

        const rootName = parts[0]
        const category = catMap.get(rootName)
        if (!category) return

        if (parts.length === 2) {
          // Direct node: Category/Node
          category.directNodes.push({ type, label: parts[1] })
        } else if (parts.length === 3) {
          // Nested node: Category/Sub/Node
          const subName = parts[1]
          let sub = category.subcategories.find(s => s.name === subName)
          if (!sub) {
            sub = { name: subName, nodes: [] }
            category.subcategories.push(sub)
          }
          sub.nodes.push({ type, label: parts[2] })
        }
      })

      // Sort nodes alphabetically
      catMap.forEach(cat => {
        cat.directNodes.sort((a, b) => a.label.localeCompare(b.label))
        cat.subcategories.sort((a, b) => a.name.localeCompare(b.name))
        cat.subcategories.forEach(sub => {
          sub.nodes.sort((a, b) => a.label.localeCompare(b.label))
        })
      })

      setCategories(Array.from(catMap.values()).filter(c => c.directNodes.length > 0 || c.subcategories.length > 0))
    }

    // Small delay to ensure all nodes are registered
    const timer = setTimeout(buildCategories, 500)
    return () => clearTimeout(timer)
  }, [])

  // 添加节点到画布
  const addNode = useCallback((nodeType: string) => {
    if (!graph) return

    const node = LiteGraph.createNode(nodeType)
    if (node) {
      // 设置节点标题为组件名
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
      setActiveCategory(null)
    }
  }, [graph, getMousePosition])

  // 处理鼠标进入分类
  const handleMouseEnter = useCallback((category: Category, event: React.MouseEvent<HTMLButtonElement>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    const rect = event.currentTarget.getBoundingClientRect()
    setDropdownPosition({ left: rect.left })
    setActiveCategory(category)
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

  return (
    <div className="node-toolbar" ref={toolbarRef}>
      <div className="node-toolbar-categories">
        {categories.map((category) => (
          <button
            key={category.name}
            className={`category-btn ${activeCategory?.name === category.name ? 'active' : ''}`}
            style={{ 
              '--category-color': category.color,
              backgroundColor: activeCategory?.name === category.name ? category.color : undefined
            } as React.CSSProperties}
            onMouseEnter={(e) => handleMouseEnter(category, e)}
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
          <div className="dropdown-content">
            {/* Direct Nodes */}
            {activeCategory.directNodes.length > 0 && (
              <div className="dropdown-section">
                <div className="dropdown-nodes">
                  {activeCategory.directNodes.map((node) => (
                    <button
                      key={node.type}
                      className="node-btn"
                      style={{ '--node-color': activeCategory.color } as React.CSSProperties}
                      onClick={() => addNode(node.type)}
                    >
                      {node.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Subcategories */}
            {activeCategory.subcategories.map(sub => (
              <div key={sub.name} className="dropdown-section">
                <div className="dropdown-section-title">{sub.name}</div>
                <div className="dropdown-nodes">
                  {sub.nodes.map(node => (
                    <button
                      key={node.type}
                      className="node-btn"
                      style={{ '--node-color': activeCategory.color } as React.CSSProperties}
                      onClick={() => addNode(node.type)}
                    >
                      {node.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
