import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ChainIdNode } from '../ChainIdNode'
import type { Chain } from 'viem'

describe('ChainIdNode', () => {
  let node: ChainIdNode

  beforeEach(() => {
    node = new ChainIdNode()
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和描述', () => {
      expect(node.title).toBe('Chain ID')
      expect(ChainIdNode.title).toBe('Chain ID')
      expect(ChainIdNode.desc).toBe('Get chain ID from chain object')
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs).toHaveLength(1)
      expect(node.inputs?.[0].name).toBe('chain')
      expect(node.inputs?.[0].type).toBe('chain')
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs).toHaveLength(1)
      expect(node.outputs?.[0].name).toBe('chainId')
      expect(node.outputs?.[0].type).toBe('number')
    })

    it('应该有正确的颜色配置', () => {
      expect(node.color).toBe('#2c5282')
      expect(node.bgcolor).toBe('#1a365d')
    })

    it('应该有正确的节点大小', () => {
      expect(node.size).toEqual([140, 50])
    })
  })

  describe('onExecute', () => {
    it('应该输出 chain ID', () => {
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

      expect(node.getOutputData(0)).toBe(1)
    })

    it('应该输出其他链的 ID', () => {
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

      expect(node.getOutputData(0)).toBe(137)
    })

    it('当没有 chain 输入时应该输出 null', () => {
      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('当 chain 为 undefined 时应该输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValue(undefined)
      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })
  })

  describe('onDrawForeground', () => {
    it('应该在画布上显示 chain ID', () => {
      const ctx = {
        font: '',
        fillStyle: '',
        fillText: vi.fn(),
      } as unknown as CanvasRenderingContext2D

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
      node.onDrawForeground(ctx)

      expect(ctx.fillStyle).toBe('#e2e8f0')
      expect(ctx.font).toBe('12px monospace')
      expect(ctx.fillText).toHaveBeenCalledWith('ID: 1', 10, 35)
    })

    it('节点折叠时不应该绘制', () => {
      const ctx = {
        fillText: vi.fn(),
      } as unknown as CanvasRenderingContext2D

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

      node.flags = { collapsed: true }
      vi.spyOn(node, 'getInputData').mockReturnValue(mockChain)
      node.onDrawForeground(ctx)

      expect(ctx.fillText).not.toHaveBeenCalled()
    })

    it('没有 chain 时不应该绘制文本', () => {
      const ctx = {
        fillText: vi.fn(),
      } as unknown as CanvasRenderingContext2D

      node.onDrawForeground(ctx)

      expect(ctx.fillText).not.toHaveBeenCalled()
    })
  })
})
