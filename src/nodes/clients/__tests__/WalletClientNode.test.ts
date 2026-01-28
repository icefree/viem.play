import { describe, it, expect, beforeEach, vi } from 'vitest'
import { WalletClientNode } from '../WalletClientNode'
import { type WalletClient, type Chain, http, webSocket } from 'viem'

describe('WalletClientNode', () => {
  let node: WalletClientNode

  beforeEach(() => {
    node = new WalletClientNode()
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和描述', () => {
      expect(node.title).toBe('WalletClient')
      expect(WalletClientNode.title).toBe('Wallet Client')
      expect(WalletClientNode.desc).toBe('Create a viem WalletClient for sending transactions')
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs).toHaveLength(3)
      expect(node.inputs?.[0].name).toBe('chain')
      expect(node.inputs?.[0].type).toBe('chain')
      expect(node.inputs?.[1].name).toBe('transport')
      expect(node.inputs?.[2].name).toBe('account')
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs).toHaveLength(1)
      expect(node.outputs?.[0].name).toBe('client')
      expect(node.outputs?.[0].type).toBe('walletClient')
    })

    it('应该有正确的颜色配置', () => {
      expect(node.color).toBe('#c53030')
      expect(node.bgcolor).toBe('#742a2a')
    })

    it('应该有正确的节点大小', () => {
      expect(node.size).toEqual([180, 80])
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
        id: 1,
        name: 'Ethereum',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
        },
        rpcUrls: {
          default: {
            http: ['https://eth.llamarpc.com'],
          },
        },
      }

      vi.spyOn(node, 'getInputData').mockImplementation((index) => {
        if (index === 0) return mockChain
        return undefined
      })

      node.onExecute()

      const client = node.getOutputData(0) as WalletClient
      expect(client).toBeDefined()
      expect(client).not.toBeNull()
    })

    it('应该创建包含 account 的 WalletClient', () => {
      const mockChain: Chain = {
        id: 1,
        name: 'Ethereum',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
        },
        rpcUrls: {
          default: {
            http: ['https://eth.llamarpc.com'],
          },
        },
      }

      const mockAccount = {
        address: '0x1234567890123456789012345678901234567890' as `0x${string}`,
        type: 'local' as const,
      }

      vi.spyOn(node, 'getInputData').mockImplementation((index) => {
        if (index === 0) return mockChain
        if (index === 2) return mockAccount
        return undefined
      })

      node.onExecute()

      const client = node.getOutputData(0) as WalletClient
      expect(client).toBeDefined()
    })

    it('应该使用自定义 transport', () => {
      const mockChain: Chain = {
        id: 1,
        name: 'Ethereum',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
        },
        rpcUrls: {
          default: {
            http: ['https://eth.llamarpc.com'],
          },
        },
      }

      const mockTransport = http('https://eth.llamarpc.com')

      vi.spyOn(node, 'getInputData').mockImplementation((index) => {
        if (index === 0) return mockChain
        if (index === 1) return mockTransport
        return undefined
      })

      node.onExecute()

      const client = node.getOutputData(0) as WalletClient
      expect(client).toBeDefined()
    })

    it('当 chain 配置改变时应该重新创建客户端', () => {
      const mockChain1: Chain = {
        id: 1,
        name: 'Ethereum',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
        },
        rpcUrls: {
          default: {
            http: ['https://eth.llamarpc.com'],
          },
        },
      }

      const mockChain2: Chain = {
        id: 137,
        name: 'Polygon',
        nativeCurrency: {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18,
        },
        rpcUrls: {
          default: {
            http: ['https://polygon.llamarpc.com'],
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

    it('应该支持字符串类型的 account 地址', () => {
      const mockChain: Chain = {
        id: 1,
        name: 'Ethereum',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
        },
        rpcUrls: {
          default: {
            http: ['https://eth.llamarpc.com'],
          },
        },
      }

      const accountAddress = '0x1234567890123456789012345678901234567890'

      vi.spyOn(node, 'getInputData').mockImplementation((index) => {
        if (index === 0) return mockChain
        if (index === 2) return accountAddress
        return undefined
      })

      node.onExecute()

      const client = node.getOutputData(0) as WalletClient
      expect(client).toBeDefined()
    })
  })

  describe('getTitle', () => {
    it('默认情况下应该返回 WalletClient', () => {
      expect(node.getTitle()).toBe('WalletClient')
    })

    it('有 chain 时应该显示 chain 名称', () => {
      const mockChain: Chain = {
        id: 1,
        name: 'Ethereum',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
        },
        rpcUrls: {
          default: {
            http: ['https://eth.llamarpc.com'],
          },
        },
      }

      vi.spyOn(node, 'getInputData').mockImplementation((index) => {
        if (index === 0) return mockChain
        if (index === 1) return undefined
        return undefined
      })
      const title = node.getTitle()

      expect(title).toBe('WalletClient (Ethereum)')
    })

    it('有 chain 和 transport 时应该显示两者', () => {
      const mockChain: Chain = {
        id: 1,
        name: 'Ethereum',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
        },
        rpcUrls: {
          default: {
            http: ['https://eth.llamarpc.com'],
          },
        },
      }

      const mockTransport = webSocket('wss://eth-mainnet.alchemyapi.io/v2/api-key')
      // @ts-ignore
      mockTransport({}).config.type = 'webSocket'

      vi.spyOn(node, 'getInputData').mockImplementation((index) => {
        if (index === 0) return mockChain
        if (index === 1) return mockTransport
        return undefined
      })

      const title = node.getTitle()

      expect(title).toBe('WalletClient (Ethereum : webSocket)')
    })
  })
})
