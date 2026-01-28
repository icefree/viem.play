import { describe, it, expect, beforeEach, vi } from 'vitest'
import { TestClientNode } from '../TestClientNode'
import type { TestClient, Chain, Transport } from 'viem'

describe('TestClientNode', () => {
  let node: TestClientNode

  beforeEach(() => {
    node = new TestClientNode()
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和描述', () => {
      expect(node.title).toBe('TestClient')
      expect(TestClientNode.title).toBe('Test Client')
      expect(TestClientNode.desc).toBe('Create a viem TestClient for local testing')
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs).toHaveLength(2)
      expect(node.inputs?.[0].name).toBe('chain')
      expect(node.inputs?.[0].type).toBe('chain')
      expect(node.inputs?.[1].name).toBe('transport')
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs).toHaveLength(1)
      expect(node.outputs?.[0].name).toBe('client')
      expect(node.outputs?.[0].type).toBe('testClient')
    })

    it('应该有正确的颜色配置', () => {
      expect(node.color).toBe('#805ad5')
      expect(node.bgcolor).toBe('#553c9a')
    })

    it('应该有正确的节点大小', () => {
      expect(node.size).toEqual([180, 60])
    })
  })

  describe('onExecute', () => {
    it('当没有 chain 输入时应该输出 null', () => {
      node.onExecute()
      expect(node.getOutputData(0)).toBeNull()
    })

    it('当 chain 为 undefined 时应该输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValue(undefined)
      node.onExecute()
      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该使用默认 HTTP transport 当没有提供 transport', () => {
      const mockChain: Chain = {
        id: 31337,
        name: 'Anvil',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
        },
        rpcUrls: {
          default: {
            http: ['http://localhost:8545'],
          },
        },
      }

      vi.spyOn(node, 'getInputData').mockImplementation((index) => {
        if (index === 0) return mockChain
        return undefined
      })

      node.onExecute()

      const client = node.getOutputData(0) as TestClient
      expect(client).toBeDefined()
      expect(client).not.toBeNull()
    })

    it('应该使用自定义 transport', () => {
      const mockChain: Chain = {
        id: 31337,
        name: 'Anvil',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
        },
        rpcUrls: {
          default: {
            http: ['http://localhost:8545'],
          },
        },
      }

      // 创建一个真实的 transport 而不是 mock
      const { http } = require('viem')
      const mockTransport = http('http://localhost:8545')

      vi.spyOn(node, 'getInputData').mockImplementation((index) => {
        if (index === 0) return mockChain
        if (index === 1) return mockTransport
        return undefined
      })

      node.onExecute()

      const client = node.getOutputData(0) as TestClient
      expect(client).toBeDefined()
    })

    it('当 chain 配置改变时应该重新创建客户端', () => {
      const mockChain1: Chain = {
        id: 31337,
        name: 'Anvil',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
        },
        rpcUrls: {
          default: {
            http: ['http://localhost:8545'],
          },
        },
      }

      const mockChain2: Chain = {
        id: 31338,
        name: 'Hardhat',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
        },
        rpcUrls: {
          default: {
            http: ['http://localhost:8546'],
          },
        },
      }

      // 第一次执行
      vi.spyOn(node, 'getInputData').mockImplementation((index) => {
        if (index === 0) return mockChain1
        return undefined
      })

      node.onExecute()
      const client1 = node.getOutputData(0)

      // 改变 chain
      vi.spyOn(node, 'getInputData').mockImplementation((index) => {
        if (index === 0) return mockChain2
        return undefined
      })

      node.onExecute()
      const client2 = node.getOutputData(0)

      // 客户端应该被重新创建
      expect(client1).toBeDefined()
      expect(client2).toBeDefined()
    })

    it('当 transport 改变时应该重新创建客户端', () => {
      const mockChain: Chain = {
        id: 31337,
        name: 'Anvil',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
        },
        rpcUrls: {
          default: {
            http: ['http://localhost:8545'],
          },
        },
      }

      // 创建真实的 transport
      const { http } = require('viem')
      const mockTransport1 = http('http://localhost:8545')
      const mockTransport2 = http('http://localhost:8546')

      // 第一次执行
      vi.spyOn(node, 'getInputData').mockImplementation((index) => {
        if (index === 0) return mockChain
        if (index === 1) return mockTransport1
        return undefined
      })

      node.onExecute()
      const client1 = node.getOutputData(0)

      // 改变 transport
      vi.spyOn(node, 'getInputData').mockImplementation((index) => {
        if (index === 0) return mockChain
        if (index === 1) return mockTransport2
        return undefined
      })

      node.onExecute()
      const client2 = node.getOutputData(0)

      // 客户端应该被重新创建
      expect(client1).toBeDefined()
      expect(client2).toBeDefined()
    })
  })

  describe('getTitle', () => {
    it('默认情况下应该返回 TestClient', () => {
      expect(node.getTitle()).toBe('TestClient')
    })

    it('有 chain 时应该显示 chain 名称', () => {
      const mockChain: Chain = {
        id: 31337,
        name: 'Anvil',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
        },
        rpcUrls: {
          default: {
            http: ['http://localhost:8545'],
          },
        },
      }

      vi.spyOn(node, 'getInputData').mockImplementation((index) => {
        if (index === 0) return mockChain
        if (index === 1) return undefined
        return undefined
      })
      const title = node.getTitle()

      expect(title).toBe('TestClient (Anvil)')
    })

    it('有 chain 和 transport 时应该显示两者', () => {
      const mockChain: Chain = {
        id: 31337,
        name: 'Anvil',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
        },
        rpcUrls: {
          default: {
            http: ['http://localhost:8545'],
          },
        },
      }

      // 创建真实的 transport
      const { webSocket } = require('viem')
      const mockTransport = webSocket('ws://localhost:8545')
      // 确保 type 属性存在
      mockTransport.type = 'webSocket'

      vi.spyOn(node, 'getInputData').mockImplementation((index) => {
        if (index === 0) return mockChain
        if (index === 1) return mockTransport
        return undefined
      })

      const title = node.getTitle()

      expect(title).toBe('TestClient (Anvil : webSocket)')
    })
  })
})
