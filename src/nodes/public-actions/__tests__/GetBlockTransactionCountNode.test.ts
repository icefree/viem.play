import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GetBlockTransactionCountNode } from '../GetBlockTransactionCountNode'
import { createMockPublicClient } from '../../../../tests/utils/helpers'
import type { PublicClient } from 'viem'

describe('GetBlockTransactionCountNode', () => {
  let node: GetBlockTransactionCountNode
  let mockClient: PublicClient

  beforeEach(() => {
    node = new GetBlockTransactionCountNode()
    mockClient = createMockPublicClient()
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和输入输出', () => {
      expect(node.title).toBe('getBlockTransactionCount')
      expect(node.inputs).toHaveLength(4)
      expect(node.outputs).toHaveLength(1)
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs?.[0].name).toBe('trigger')
      expect(node.inputs?.[1].name).toBe('client')
      expect(node.inputs?.[2].name).toBe('blockNumber')
      expect(node.inputs?.[3].name).toBe('blockHash')
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs?.[0].name).toBe('count')
      expect(node.outputs?.[0].type).toBe('number')
    })
  })

  describe('fetchCount', () => {
    it('当没有 client 时应该输出 null', async () => {
      node.getInputData = vi.fn().mockReturnValue(undefined) as typeof node.getInputData

      await node.fetchCount()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该成功获取最新区块的交易数量', async () => {
      mockClient.getBlockTransactionCount = vi.fn().mockResolvedValue(150)
      node.getInputData = vi.fn((idx) => (idx === 1 ? mockClient : undefined)) as typeof node.getInputData

      await node.fetchCount()

      expect(mockClient.getBlockTransactionCount).toHaveBeenCalledWith()
      expect(node.getOutputData(0)).toBe(150)
    })

    it('应该根据 blockNumber 获取交易数量', async () => {
      const blockNumber = 12345n
      mockClient.getBlockTransactionCount = vi.fn().mockResolvedValue(50)
      node.getInputData = vi.fn((idx) => {
        if (idx === 1) return mockClient
        if (idx === 2) return blockNumber
        return undefined
      }) as typeof node.getInputData

      await node.fetchCount()

      expect(mockClient.getBlockTransactionCount).toHaveBeenCalledWith({ blockNumber })
    })

    it('应该优先使用 blockHash 获取交易数量', async () => {
      const blockNumber = 12345n
      const blockHash = '0xabc123...' as `0x${string}`
      mockClient.getBlockTransactionCount = vi.fn().mockResolvedValue(75)
      node.getInputData = vi.fn((idx) => {
        if (idx === 1) return mockClient
        if (idx === 2) return blockNumber
        if (idx === 3) return blockHash
        return undefined
      }) as typeof node.getInputData

      await node.fetchCount()

      // blockHash 优先级更高
      expect(mockClient.getBlockTransactionCount).toHaveBeenCalledWith({ blockHash })
    })

    it('应该处理 API 错误', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      mockClient.getBlockTransactionCount = vi.fn().mockRejectedValue(new Error('API Error'))
      node.getInputData = vi.fn((idx) => (idx === 1 ? mockClient : undefined)) as typeof node.getInputData

      await node.fetchCount()

      expect(consoleError).toHaveBeenCalledWith('GetBlockTransactionCount error:', expect.any(Error))
      consoleError.mockRestore()
    })
  })

  describe('onAction', () => {
    it('触发 trigger action 时应该调用 fetchCount', async () => {
      const fetchSpy = vi.spyOn(node, 'fetchCount').mockResolvedValue()

      await node.onAction('trigger')

      expect(fetchSpy).toHaveBeenCalled()
    })
  })

  describe('onDrawForeground', () => {
    it('应该在画布上显示交易数量', async () => {
      const ctx = {
        font: '',
        fillStyle: '',
        fillText: vi.fn(),
      } as unknown as CanvasRenderingContext2D

      mockClient.getBlockTransactionCount = vi.fn().mockResolvedValue(42)
      node.getInputData = vi.fn((idx) => (idx === 1 ? mockClient : undefined)) as typeof node.getInputData
      await node.fetchCount()

      node.onDrawForeground(ctx)

      expect(ctx.fillText).toHaveBeenCalledWith('Txs: 42', 10, 75)
    })

    it('没有数据时应该显示 "No data"', () => {
      const ctx = {
        font: '',
        fillStyle: '',
        fillText: vi.fn(),
      } as unknown as CanvasRenderingContext2D

      node.onDrawForeground(ctx)

      expect(ctx.fillText).toHaveBeenCalledWith('No data', 10, 75)
    })
  })
})
