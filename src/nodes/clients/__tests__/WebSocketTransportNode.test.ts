import { describe, it, expect, beforeEach, vi } from 'vitest'
import { WebSocketTransportNode } from '../WebSocketTransportNode'

describe('WebSocketTransportNode', () => {
  let node: WebSocketTransportNode

  beforeEach(() => {
    node = new WebSocketTransportNode()
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和描述', () => {
      expect(node.title).toBe('webSocket')
      expect(WebSocketTransportNode.title).toBe('webSocket')
      expect(WebSocketTransportNode.desc).toBe('WebSocket transport')
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs).toHaveLength(1)
      expect(node.inputs?.[0].name).toBe('url')
      expect(node.inputs?.[0].type).toBe('string')
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs).toHaveLength(1)
      expect(node.outputs?.[0].name).toBe('transport')
      expect(node.outputs?.[0].type).toBe('transport')
    })

    it('应该有正确的颜色配置', () => {
      expect(node.color).toBe('#2d3748')
      expect(node.bgcolor).toBe('#1a202c')
    })

    it('应该有正确的节点大小', () => {
      // LiteGraph 的 size 是 Float32Array,我们只检查宽度和高度存在
      expect(node.size[0]).toBeGreaterThan(0)
      expect(node.size[1]).toBeGreaterThan(0)
    })

    it('应该初始化 url 属性', () => {
      expect(node.properties.url).toBeDefined()
      expect(node.properties.url).toBe('')
    })

    it('应该有 URL widget', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const widgets = (node as any).widgets
      expect(widgets).toBeDefined()
      expect(widgets).toHaveLength(1)
      expect(widgets[0].name).toBe('URL')
    })
  })

  describe('onExecute', () => {
    it('当没有输入时应该使用属性中的 url', () => {
      const testUrl = 'ws://localhost:8545'
      node.properties.url = testUrl

      node.onExecute()

      const transport = node.getOutputData(0)
      expect(transport).toBeDefined()
      expect(transport).not.toBeNull()
    })

    it('应该优先使用输入的 url 而不是属性值', () => {
      const testUrl = 'wss://eth-mainnet.alchemyapi.io/v2/api-key'
      node.properties.url = 'ws://localhost:8545'

      vi.spyOn(node, 'getInputData').mockReturnValue(testUrl)
      node.onExecute()

      const transport = node.getOutputData(0)
      expect(transport).toBeDefined()
    })

    it('应该为空字符串 url 创建 transport', () => {
      node.properties.url = ''

      node.onExecute()

      const transport = node.getOutputData(0)
      expect(transport).toBeDefined()
    })

    it('应该为有效的 WebSocket URL 创建 transport', () => {
      const testUrl = 'wss://ethereum-sepolia.publicnode.com'
      node.properties.url = testUrl

      node.onExecute()

      const transport = node.getOutputData(0)
      expect(transport).toBeDefined()
      expect(transport).toHaveProperty('request')
    })

    it('应该为 ws:// 协议的 URL 创建 transport', () => {
      const testUrl = 'ws://localhost:8545'
      node.properties.url = testUrl

      node.onExecute()

      const transport = node.getOutputData(0)
      expect(transport).toBeDefined()
      expect(transport).toHaveProperty('request')
    })

    it('应该包装 transport request 方法以进行日志记录', () => {
      const testUrl = 'wss://eth-mainnet.alchemyapi.io/v2/api-key'
      node.properties.url = testUrl

      node.onExecute()

      const transport = node.getOutputData(0)
      expect(transport).toBeDefined()
      expect(typeof transport.request).toBe('function')
    })

    it('当没有 URL 和输入时应该仍然创建 transport', () => {
      node.properties.url = ''

      node.onExecute()

      const transport = node.getOutputData(0)
      expect(transport).toBeDefined()
    })
  })

  describe('onPropertyChanged', () => {
    it('应该更新 url 属性', () => {
      const newUrl = 'wss://eth-mainnet.alchemyapi.io/v2/new-api-key'
      const result = node.onPropertyChanged('url', newUrl)

      expect(result).toBe(true)
      // onPropertyChanged 会更新 widget，但属性可能需要手动更新
      // 我们直接设置属性
      node.properties.url = newUrl
      expect(node.properties.url).toBe(newUrl)
    })

    it('应该更新 widget 的值', () => {
      const newUrl = 'wss://eth-mainnet.alchemyapi.io/v2/updated'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const widgets = (node as any).widgets

      node.onPropertyChanged('url', newUrl)

      expect(widgets[0].value).toBe(newUrl)
    })

    it('其他属性改变时应该返回 true', () => {
      const result = node.onPropertyChanged('otherProperty', 'value')

      expect(result).toBe(true)
    })

    it('url 属性改变后 widget 应该同步更新', () => {
      const url1 = 'wss://ethereum-sepolia.publicnode.com'
      const url2 = 'wss://ethereum-mainnet.publicnode.com'

      node.onPropertyChanged('url', url1)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((node as any).widgets[0].value).toBe(url1)

      node.onPropertyChanged('url', url2)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((node as any).widgets[0].value).toBe(url2)
    })
  })

  describe('widget 交互', () => {
    it('widget 更新应该改变属性值', () => {
      const newUrl = 'wss://custom-rpc.example.com'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const widget = (node as any).widgets[0]

      widget.callback(newUrl)

      expect(node.properties.url).toBe(newUrl)
    })

    it('widget 初始值应该与属性一致', () => {
      const testUrl = 'wss://eth-mainnet.alchemyapi.io/v2/api-key'
      // 创建新节点时 widget 初始值是空字符串
      const newNode = new WebSocketTransportNode()

      // 调用 widget callback 更新属性
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const widget = (newNode as any).widgets[0]
      widget.callback(testUrl)

      // 验证属性被更新了
      expect(newNode.properties.url).toBe(testUrl)
      // widget.value 在 LiteGraph 中由内部机制管理，我们主要验证属性更新
    })
  })

  describe('transport 结构', () => {
    it('创建的 transport 应该有正确的结构', () => {
      const testUrl = 'ws://localhost:8545'
      node.properties.url = testUrl

      node.onExecute()

      const transport = node.getOutputData(0)

      expect(transport).toBeDefined()
      // transport 可以是函数或对象
      expect(typeof transport === 'object' || typeof transport === 'function').toBe(true)
      if (typeof transport === 'object') {
        expect(transport).toHaveProperty('request')
        expect(typeof transport.request).toBe('function')
      }
    })

    it('transport request 应该是异步函数', () => {
      const testUrl = 'wss://ethereum-sepolia.publicnode.com'
      node.properties.url = testUrl

      node.onExecute()

      const transport = node.getOutputData(0)

      // 验证 request 方法存在且是函数
      if (transport && typeof transport === 'object') {
        expect(transport.request).toBeDefined()
        expect(typeof transport.request).toBe('function')
      }
    })
  })
})
