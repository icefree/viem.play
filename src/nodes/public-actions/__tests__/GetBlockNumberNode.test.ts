import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GetBlockNumberNode } from '../GetBlockNumberNode'
import { createMockPublicClient } from '../../../../tests/utils/helpers'
import type { PublicClient } from 'viem'

describe('GetBlockNumberNode', () => {
  let node: GetBlockNumberNode
  let mockClient: PublicClient

  beforeEach(() => {
    node = new GetBlockNumberNode()
    mockClient = createMockPublicClient()
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和输入输出', () => {
      expect(node.title).toBe('getBlockNumber')
      expect(node.inputs).toHaveLength(2)
      expect(node.outputs).toHaveLength(1)
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs?.[0].name).toBe('trigger')
      expect(node.inputs?.[1].name).toBe('client')
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs?.[0].name).toBe('blockNumber')
      expect(node.outputs?.[0].type).toBe('bigint')
    })
  })

  describe('fetchBlockNumber', () => {
    it('当没有 client 时应该输出 null', async () => {
      node.getInputData = vi.fn().mockReturnValue(undefined)

      await node.fetchBlockNumber()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该成功获取区块号', async () => {
      const expectedBlockNumber = 12345678n
      mockClient.getBlockNumber = vi.fn().mockResolvedValue(expectedBlockNumber)
      node.getInputData = vi.fn((idx) => (idx === 1 ? mockClient : undefined))

      await node.fetchBlockNumber()
      node.onExecute()

      expect(mockClient.getBlockNumber).toHaveBeenCalled()
      expect(node.getOutputData(0)).toBe(expectedBlockNumber)
    })

    it('应该处理 API 错误', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      mockClient.getBlockNumber = vi.fn().mockRejectedValue(new Error('Network Error'))
      node.getInputData = vi.fn((idx) => (idx === 1 ? mockClient : undefined))

      await node.fetchBlockNumber()

      expect(consoleError).toHaveBeenCalledWith('GetBlockNumber error:', expect.any(Error))
      consoleError.mockRestore()
    })

    it('应该防止并发请求', async () => {
      mockClient.getBlockNumber = vi.fn().mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(12345n), 100))
      )
      node.getInputData = vi.fn((idx) => (idx === 1 ? mockClient : undefined))

      const promise1 = node.fetchBlockNumber()
      const promise2 = node.fetchBlockNumber()

      await Promise.all([promise1, promise2])

      expect(mockClient.getBlockNumber).toHaveBeenCalledTimes(1)
    })
  })

  describe('onAction', () => {
    it('触发 trigger action 时应该调用 fetchBlockNumber', async () => {
      const fetchSpy = vi.spyOn(node, 'fetchBlockNumber').mockResolvedValue()

      await node.onAction('trigger')

      expect(fetchSpy).toHaveBeenCalled()
    })

    it('其他 action 不应该触发 fetchBlockNumber', async () => {
      const fetchSpy = vi.spyOn(node, 'fetchBlockNumber').mockResolvedValue()

      await node.onAction('other')

      expect(fetchSpy).not.toHaveBeenCalled()
    })
  })

  describe('onExecute', () => {
    it('应该设置输出数据', async () => {
      const blockNumber = 99999n
      mockClient.getBlockNumber = vi.fn().mockResolvedValue(blockNumber)
      node.getInputData = vi.fn((idx) => (idx === 1 ? mockClient : undefined))

      await node.fetchBlockNumber()
      node.onExecute()

      expect(node.getOutputData(0)).toBe(blockNumber)
    })

    it('初始状态输出应为 null', () => {
      node.onExecute()
      expect(node.getOutputData(0)).toBeNull()
    })
  })

  describe('onDrawForeground', () => {
    it('应该在画布上显示区块号', async () => {
      const ctx = {
        font: '',
        fillStyle: '',
        fillText: vi.fn(),
      } as unknown as CanvasRenderingContext2D

      mockClient.getBlockNumber = vi.fn().mockResolvedValue(12345678n)
      node.getInputData = vi.fn((idx) => (idx === 1 ? mockClient : undefined))
      await node.fetchBlockNumber()

      node.onDrawForeground(ctx)

      expect(ctx.fillText).toHaveBeenCalledWith('#12345678', 10, 60)
    })

    it('没有数据时应该显示 "No data"', () => {
      const ctx = {
        font: '',
        fillStyle: '',
        fillText: vi.fn(),
      } as unknown as CanvasRenderingContext2D

      node.onDrawForeground(ctx)

      expect(ctx.fillText).toHaveBeenCalledWith('No data', 10, 60)
    })

    it('节点折叠时不应该绘制', () => {
      const ctx = {
        fillText: vi.fn(),
      } as unknown as CanvasRenderingContext2D

      node.flags = { collapsed: true }
      node.onDrawForeground(ctx)

      expect(ctx.fillText).not.toHaveBeenCalled()
    })
  })
})
