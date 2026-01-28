import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ChainInfoNode } from '../ChainInfoNode'
import type { Chain } from 'viem'

describe('ChainInfoNode', () => {
  let node: ChainInfoNode

  beforeEach(() => {
    node = new ChainInfoNode()
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和描述', () => {
      expect(node.title).toBe('Chain Info')
      expect(ChainInfoNode.title).toBe('Chain Info')
      expect(ChainInfoNode.desc).toBe('Display chain information')
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs).toHaveLength(1)
      expect(node.inputs?.[0].name).toBe('chain')
      expect(node.inputs?.[0].type).toBe('chain')
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs).toHaveLength(3)
      expect(node.outputs?.[0].name).toBe('name')
      expect(node.outputs?.[0].type).toBe('string')
      expect(node.outputs?.[1].name).toBe('nativeCurrency')
      expect(node.outputs?.[1].type).toBe('object')
      expect(node.outputs?.[2].name).toBe('rpcUrl')
      expect(node.outputs?.[2].type).toBe('string')
    })

    it('应该有正确的颜色配置', () => {
      expect(node.color).toBe('#2c5282')
      expect(node.bgcolor).toBe('#1a365d')
    })

    it('应该有正确的节点大小', () => {
      expect(node.size).toEqual([180, 90])
    })
  })

  describe('onExecute', () => {
    it('应该输出 chain name', () => {
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

      vi.spyOn(node, 'getInputData').mockReturnValue(mockChain)
      node.onExecute()

      expect(node.getOutputData(0)).toBe('Ethereum')
    })

    it('应该输出 nativeCurrency', () => {
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

      vi.spyOn(node, 'getInputData').mockReturnValue(mockChain)
      node.onExecute()

      expect(node.getOutputData(1)).toEqual({
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
      })
    })

    it('应该输出 rpcUrl', () => {
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

      vi.spyOn(node, 'getInputData').mockReturnValue(mockChain)
      node.onExecute()

      expect(node.getOutputData(2)).toBe('https://eth.llamarpc.com')
    })

    it('应该输出 Polygon 链的信息', () => {
      const mockChain: Chain = {
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

      vi.spyOn(node, 'getInputData').mockReturnValue(mockChain)
      node.onExecute()

      expect(node.getOutputData(0)).toBe('Polygon')
      expect(node.getOutputData(1)).toEqual({
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18,
      })
      expect(node.getOutputData(2)).toBe('https://polygon.llamarpc.com')
    })

    it('当没有 chain 输入时所有输出应该为 null', () => {
      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
      expect(node.getOutputData(1)).toBeNull()
      expect(node.getOutputData(2)).toBeNull()
    })

    it('当 chain 为 undefined 时所有输出应该为 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValue(undefined)
      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
      expect(node.getOutputData(1)).toBeNull()
      expect(node.getOutputData(2)).toBeNull()
    })

    it('应该正确处理有多个 RPC URL 的链', () => {
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
            http: [
              'https://eth.llamarpc.com',
              'https://rpc.ankr.com/eth',
              'https://cloudflare-eth.com',
            ],
          },
        },
      }

      vi.spyOn(node, 'getInputData').mockReturnValue(mockChain)
      node.onExecute()

      // 应该返回第一个 RPC URL
      expect(node.getOutputData(2)).toBe('https://eth.llamarpc.com')
    })
  })
})
