import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GetGasPriceNode } from '../GetGasPriceNode'
import { createMockPublicClient } from '@test-utils/helpers'
import type { PublicClient } from 'viem'

describe('GetGasPriceNode', () => {
  let node: GetGasPriceNode
  let mockClient: PublicClient

  beforeEach(() => {
    node = new GetGasPriceNode()
    mockClient = createMockPublicClient({
      getGasPrice: vi.fn().mockResolvedValue(20000000000n),
    })
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和输入输出', () => {
      expect(node.title).toBe('getGasPrice')
      expect(node.inputs).toHaveLength(2)
      expect(node.outputs).toHaveLength(2)
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs?.[0].name).toBe('client')
      expect(node.inputs?.[1].name).toBe('trigger')
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs?.[0].name).toBe('gasPrice')
      expect(node.outputs?.[0].type).toBe('bigint')
      expect(node.outputs?.[1].name).toBe('gwei')
      expect(node.outputs?.[1].type).toBe('string')
    })
  })

  describe('fetchGasPrice', () => {
    it('当没有 client 时应该输出 null', async () => {
      vi.spyOn(node, 'getInputData').mockReturnValue(undefined)

      await node.fetchGasPrice()

      expect(node.getOutputData(0)).toBeNull()
      expect(node.getOutputData(1)).toBeNull()
    })

    it('应该成功获取 gas 价格', async () => {
      const expectedGasPrice = 20000000000n
      mockClient.getGasPrice = vi.fn().mockResolvedValue(expectedGasPrice)
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => (idx === 0 ? mockClient : undefined))

      await node.fetchGasPrice()
      node.onExecute()

      expect(mockClient.getGasPrice).toHaveBeenCalled()
      expect(node.getOutputData(0)).toBe(expectedGasPrice)
      expect(node.getOutputData(1)).toBe('20')
    })

    it('应该处理 API 错误', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      mockClient.getGasPrice = vi.fn().mockRejectedValue(new Error('Network Error'))
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => (idx === 0 ? mockClient : undefined))

      await node.fetchGasPrice()

      expect(consoleError).toHaveBeenCalledWith('GetGasPrice error:', expect.any(Error))
      consoleError.mockRestore()
    })

    it('应该防止并发请求', async () => {
      mockClient.getGasPrice = vi.fn().mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(20000000000n), 100))
      )
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => (idx === 0 ? mockClient : undefined))

      const promise1 = node.fetchGasPrice()
      const promise2 = node.fetchGasPrice()

      await Promise.all([promise1, promise2])

      expect(mockClient.getGasPrice).toHaveBeenCalledTimes(1)
    })
  })

  describe('onAction', () => {
    it('触发 trigger action 时应该调用 fetchGasPrice', async () => {
      const fetchSpy = vi.spyOn(node, 'fetchGasPrice').mockResolvedValue()

      await node.onAction('trigger')

      expect(fetchSpy).toHaveBeenCalled()
    })

    it('其他 action 不应该触发 fetchGasPrice', async () => {
      const fetchSpy = vi.spyOn(node, 'fetchGasPrice').mockResolvedValue()

      await node.onAction('other')

      expect(fetchSpy).not.toHaveBeenCalled()
    })
  })

  describe('onExecute', () => {
    it('应该设置输出数据', async () => {
      const gasPrice = 30000000000n
      mockClient.getGasPrice = vi.fn().mockResolvedValue(gasPrice)
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => (idx === 0 ? mockClient : undefined))

      await node.fetchGasPrice()
      node.onExecute()

      expect(node.getOutputData(0)).toBe(gasPrice)
      expect(node.getOutputData(1)).toBe('30')
    })

    it('初始状态输出应为 null', () => {
      node.onExecute()
      expect(node.getOutputData(0)).toBeUndefined()
      expect(node.getOutputData(1)).toBeUndefined()
    })
  })

  describe('onDrawForeground', () => {
    it('应该在画布上显示 gas 价格（Gwei）', async () => {
      const ctx = {
        font: '',
        fillStyle: '',
        fillText: vi.fn(),
      } as unknown as CanvasRenderingContext2D

      mockClient.getGasPrice = vi.fn().mockResolvedValue(20000000000n)
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => (idx === 0 ? mockClient : undefined))
      await node.fetchGasPrice()

      node.onDrawForeground(ctx)

      expect(ctx.fillText).toHaveBeenCalledWith('20 Gwei', 10, 40)
    })

    it('没有数据时不应该绘制', () => {
      const ctx = {
        font: '',
        fillStyle: '',
        fillText: vi.fn(),
      } as unknown as CanvasRenderingContext2D

      node.onDrawForeground(ctx)

      expect(ctx.fillText).not.toHaveBeenCalled()
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
