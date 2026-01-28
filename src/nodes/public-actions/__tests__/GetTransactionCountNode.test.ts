import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GetTransactionCountNode } from '../GetTransactionCountNode'
import { createMockPublicClient } from '@test-utils/helpers'
import type { PublicClient } from 'viem'

describe('GetTransactionCountNode', () => {
  let node: GetTransactionCountNode
  let mockClient: PublicClient

  beforeEach(() => {
    node = new GetTransactionCountNode()
    mockClient = createMockPublicClient()
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和输入输出', () => {
      expect(node.title).toBe('getTransactionCount')
      expect(node.inputs).toHaveLength(3)
      expect(node.outputs).toHaveLength(1)
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs?.[0].name).toBe('client')
      expect(node.inputs?.[1].name).toBe('address')
      expect(node.inputs?.[2].name).toBe('trigger')
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs?.[0].name).toBe('count')
      expect(node.outputs?.[0].type).toBe('number')
    })
  })

  describe('fetchTransactionCount', () => {
    it('当没有 client 时应该输出 null', async () => {
      vi.spyOn(node, 'getInputData').mockReturnValue(undefined)

      await node.fetchTransactionCount()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('当没有 address 时应该输出 null', async () => {
      vi.spyOn(node, 'getInputData').mockImplementation((idx) =>
        idx === 0 ? mockClient : undefined
      )

      await node.fetchTransactionCount()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该成功获取交易数量', async () => {
      const expectedCount = 42
      const testAddress = '0x1234567890123456789012345678901234567890'
      mockClient.getTransactionCount = vi.fn().mockResolvedValue(expectedCount)
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testAddress
        return undefined
      })

      await node.fetchTransactionCount()
      node.onExecute()

      expect(mockClient.getTransactionCount).toHaveBeenCalledWith({
        address: testAddress,
      })
      expect(node.getOutputData(0)).toBe(expectedCount)
    })

    it('应该处理 API 错误', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      const testAddress = '0x1234567890123456789012345678901234567890'
      mockClient.getTransactionCount = vi.fn().mockRejectedValue(new Error('Network Error'))
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testAddress
        return undefined
      })

      await node.fetchTransactionCount()

      expect(consoleError).toHaveBeenCalledWith(
        'GetTransactionCount error:',
        expect.any(Error)
      )
      consoleError.mockRestore()
    })

    it('应该缓存相同地址的结果', async () => {
      const expectedCount = 42
      const testAddress = '0x1234567890123456789012345678901234567890'
      mockClient.getTransactionCount = vi.fn().mockResolvedValue(expectedCount)
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testAddress
        return undefined
      })

      await node.fetchTransactionCount()
      await node.fetchTransactionCount()

      expect(mockClient.getTransactionCount).toHaveBeenCalledTimes(1)
    })

    it('当地址改变时应该重新获取', async () => {
      const address1 = '0x1234567890123456789012345678901234567890'
      const address2 = '0x0987654321098765432109876543210987654321'
      mockClient.getTransactionCount = vi.fn()
        .mockResolvedValueOnce(42)
        .mockResolvedValueOnce(100)

      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return address1
        return undefined
      })

      await node.fetchTransactionCount()
      expect(mockClient.getTransactionCount).toHaveBeenCalledTimes(1)

      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return address2
        return undefined
      })

      await node.fetchTransactionCount()
      expect(mockClient.getTransactionCount).toHaveBeenCalledTimes(2)
    })

    it('应该防止并发请求', async () => {
      const testAddress = '0x1234567890123456789012345678901234567890'
      mockClient.getTransactionCount = vi.fn().mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(42), 100))
      )
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testAddress
        return undefined
      })

      const promise1 = node.fetchTransactionCount()
      const promise2 = node.fetchTransactionCount()

      await Promise.all([promise1, promise2])

      expect(mockClient.getTransactionCount).toHaveBeenCalledTimes(1)
    })
  })

  describe('onAction', () => {
    it('触发 trigger action 时应该调用 fetchTransactionCount', async () => {
      const fetchSpy = vi.spyOn(node, 'fetchTransactionCount').mockResolvedValue()

      await node.onAction('trigger')

      expect(fetchSpy).toHaveBeenCalled()
    })

    it('其他 action 不应该触发 fetchTransactionCount', async () => {
      const fetchSpy = vi.spyOn(node, 'fetchTransactionCount').mockResolvedValue()

      await node.onAction('other')

      expect(fetchSpy).not.toHaveBeenCalled()
    })
  })

  describe('onExecute', () => {
    it('应该设置输出数据', async () => {
      const expectedCount = 42
      const testAddress = '0x1234567890123456789012345678901234567890'
      mockClient.getTransactionCount = vi.fn().mockResolvedValue(expectedCount)
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testAddress
        return undefined
      })

      await node.fetchTransactionCount()
      node.onExecute()

      expect(node.getOutputData(0)).toBe(expectedCount)
    })

    it('初始状态输出应为 null', () => {
      node.onExecute()
      const result = node.getOutputData(0)
      expect(result === null || result === undefined).toBe(true)
    })
  })

  describe('onDrawForeground', () => {
    it('应该在画布上显示交易数量', async () => {
      const ctx = {
        font: '',
        fillStyle: '',
        fillText: vi.fn(),
      } as unknown as CanvasRenderingContext2D

      const testAddress = '0x1234567890123456789012345678901234567890'
      mockClient.getTransactionCount = vi.fn().mockResolvedValue(42)
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testAddress
        return undefined
      })

      await node.fetchTransactionCount()
      node.onDrawForeground(ctx)

      expect(ctx.fillText).toHaveBeenCalledWith('Nonce: 42', 10, 40)
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
