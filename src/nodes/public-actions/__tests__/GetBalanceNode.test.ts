import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GetBalanceNode } from '../GetBalanceNode'
import { createMockPublicClient } from '@test-utils/helpers'
import { logger } from '@/stores/useLogStore'
import type { PublicClient } from 'viem'

describe('GetBalanceNode', () => {
  let node: GetBalanceNode
  let mockClient: PublicClient
  const testAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb' as const

  beforeEach(() => {
    node = new GetBalanceNode()
    mockClient = createMockPublicClient()
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和输入输出', () => {
      expect(node.title).toBe('getBalance')
      expect(node.inputs).toHaveLength(3)
      expect(node.outputs).toHaveLength(2)
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs?.[0].name).toBe('trigger')
      expect(node.inputs?.[1].name).toBe('client')
      expect(node.inputs?.[2].name).toBe('address')
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs?.[0].name).toBe('balance')
      expect(node.outputs?.[0].type).toBe('bigint')
      expect(node.outputs?.[1].name).toBe('formatted')
      expect(node.outputs?.[1].type).toBe('string')
    })
  })

  describe('fetchBalance', () => {
    it('当没有 client 时应该输出 null', async () => {
      node.getInputData = vi.fn().mockReturnValue(undefined)

      await node.fetchBalance()

      expect(node.getOutputData(0)).toBeNull()
      expect(node.getOutputData(1)).toBeNull()
    })

    it('当没有 address 时应该输出 null', async () => {
      node.getInputData = vi.fn((idx) => {
        if (idx === 1) return mockClient
        return undefined
      })

      await node.fetchBalance()

      expect(node.getOutputData(0)).toBeNull()
      expect(node.getOutputData(1)).toBeNull()
    })

    it('应该成功获取余额', async () => {
      const expectedBalance = 1000000000000000000n // 1 ETH
      mockClient.getBalance = vi.fn().mockResolvedValue(expectedBalance)
      node.getInputData = vi.fn((idx) => {
        if (idx === 1) return mockClient
        if (idx === 2) return testAddress
        return undefined
      })

      await node.fetchBalance()

      expect(mockClient.getBalance).toHaveBeenCalledWith({ address: testAddress })
      expect(node.getOutputData(0)).toBe(expectedBalance)
      expect(node.getOutputData(1)).toBe('1')
    })

    it('应该正确格式化余额', async () => {
      const balance = 2500000000000000000n // 2.5 ETH
      mockClient.getBalance = vi.fn().mockResolvedValue(balance)
      node.getInputData = vi.fn((idx) => {
        if (idx === 1) return mockClient
        if (idx === 2) return testAddress
        return undefined
      })

      await node.fetchBalance()

      expect(node.getOutputData(0)).toBe(balance)
      expect(node.getOutputData(1)).toBe('2.5')
    })

    it('应该处理 API 错误', async () => {
      const loggerErrorSpy = vi.spyOn(logger, 'error').mockImplementation(() => {})
      mockClient.getBalance = vi.fn().mockRejectedValue(new Error('Network Error'))
      node.getInputData = vi.fn((idx) => {
        if (idx === 1) return mockClient
        if (idx === 2) return testAddress
        return undefined
      })

      await node.fetchBalance()

      expect(loggerErrorSpy).toHaveBeenCalledWith(
        'Failed to fetch balance: Network Error',
        'getBalance',
        { address: testAddress }
      )
      loggerErrorSpy.mockRestore()
    })

    it('应该使用缓存机制，相同地址不重复请求', async () => {
      mockClient.getBalance = vi.fn().mockResolvedValue(1000000000000000000n)
      node.getInputData = vi.fn((idx) => {
        if (idx === 1) return mockClient
        if (idx === 2) return testAddress
        return undefined
      })

      // 第一次请求
      await node.fetchBalance()
      expect(mockClient.getBalance).toHaveBeenCalledTimes(1)

      // 第二次请求相同地址
      await node.fetchBalance()
      expect(mockClient.getBalance).toHaveBeenCalledTimes(1) // 没有增加
    })

    it('当地址改变时应该重新获取', async () => {
      const newAddress = '0x1234567890123456789012345678901234567890' as const
      mockClient.getBalance = vi.fn().mockResolvedValue(2000000000000000000n)
      node.getInputData = vi.fn((idx) => {
        if (idx === 1) return mockClient
        if (idx === 2) return newAddress
        return undefined
      })

      // 第一次请求新地址
      await node.fetchBalance()
      expect(mockClient.getBalance).toHaveBeenCalledWith({ address: newAddress })
    })

    it('应该防止并发请求', async () => {
      mockClient.getBalance = vi.fn().mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(1000000000000000000n), 100))
      )
      node.getInputData = vi.fn((idx) => {
        if (idx === 1) return mockClient
        if (idx === 2) return testAddress
        return undefined
      })

      const promise1 = node.fetchBalance()
      const promise2 = node.fetchBalance()

      await Promise.all([promise1, promise2])

      expect(mockClient.getBalance).toHaveBeenCalledTimes(1)
    })
  })

  describe('onAction', () => {
    it('触发 trigger action 时应该调用 fetchBalance', async () => {
      const fetchSpy = vi.spyOn(node, 'fetchBalance').mockResolvedValue()

      await node.onAction('trigger')

      expect(fetchSpy).toHaveBeenCalled()
    })

    it('其他 action 不应该触发 fetchBalance', async () => {
      const fetchSpy = vi.spyOn(node, 'fetchBalance').mockResolvedValue()

      await node.onAction('other')

      expect(fetchSpy).not.toHaveBeenCalled()
    })
  })

  describe('onExecute', () => {
    it('应该设置输出数据', async () => {
      const balance = 3000000000000000000n // 3 ETH
      mockClient.getBalance = vi.fn().mockResolvedValue(balance)
      node.getInputData = vi.fn((idx) => {
        if (idx === 1) return mockClient
        if (idx === 2) return testAddress
        return undefined
      })

      await node.fetchBalance()
      node.onExecute()

      expect(node.getOutputData(0)).toBe(balance)
      expect(node.getOutputData(1)).toBe('3')
    })

    it('初始状态输出应为 undefined', () => {
      node.onExecute()
      // getOutputData 在未设置时返回 undefined，这是 LiteGraph 的默认行为
      expect(node.getOutputData(0)).toBeUndefined()
      expect(node.getOutputData(1)).toBeUndefined()
    })
  })

  describe('onDrawForeground', () => {
    it('应该在画布上显示余额', async () => {
      const ctx = {
        font: '',
        fillStyle: '',
        fillText: vi.fn(),
      } as unknown as CanvasRenderingContext2D

      mockClient.getBalance = vi.fn().mockResolvedValue(1000000000000000000n)
      node.getInputData = vi.fn((idx) => {
        if (idx === 1) return mockClient
        if (idx === 2) return testAddress
        return undefined
      })
      await node.fetchBalance()

      node.onDrawForeground(ctx)

      expect(ctx.fillText).toHaveBeenCalledWith('1 ETH', 10, 50)
      expect(ctx.fillStyle).toBe('#48bb78')
    })

    it('加载中时应该显示 Loading...', async () => {
      const ctx = {
        font: '',
        fillStyle: '',
        fillText: vi.fn(),
      } as unknown as CanvasRenderingContext2D

      // 模拟加载状态
      mockClient.getBalance = vi.fn().mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(1000000000000000000n), 100))
      )
      node.getInputData = vi.fn((idx) => {
        if (idx === 1) return mockClient
        if (idx === 2) return testAddress
        return undefined
      })

      // 不等待完成，立即检查
      void node.fetchBalance()
      // 给一点时间让 isLoading 设置为 true
      await new Promise((resolve) => setTimeout(resolve, 10))

      node.onDrawForeground(ctx)

      expect(ctx.fillStyle).toBe('#ffd700')
      expect(ctx.fillText).toHaveBeenCalledWith('Loading...', 10, 50)
    })

    it('没有数据时应该不显示余额信息', () => {
      const ctx = {
        font: '',
        fillStyle: '',
        fillText: vi.fn(),
      } as unknown as CanvasRenderingContext2D

      node.onDrawForeground(ctx)

      // 没有余额时，fillText 不应该被调用（除了可能的错误信息）
      expect(ctx.fillText).not.toHaveBeenCalledWith(expect.stringContaining('ETH'), 10, 50)
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
