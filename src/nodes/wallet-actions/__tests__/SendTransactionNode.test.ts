import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SendTransactionNode } from '../SendTransactionNode'
import type { WalletClient } from 'viem'

describe('SendTransactionNode', () => {
  let node: SendTransactionNode
  let mockClient: WalletClient

  beforeEach(() => {
    node = new SendTransactionNode()
    mockClient = {
      sendTransaction: vi.fn(),
    } as unknown as WalletClient
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和输入输出', () => {
      expect(node.title).toBe('sendTransaction')
      expect(node.inputs).toHaveLength(5)
      expect(node.outputs).toHaveLength(1)
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs?.[0].name).toBe('client')
      expect(node.inputs?.[1].name).toBe('to')
      expect(node.inputs?.[2].name).toBe('value')
      expect(node.inputs?.[3].name).toBe('data')
      expect(node.inputs?.[4].name).toBe('trigger')
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs?.[0].name).toBe('hash')
      expect(node.outputs?.[0].type).toBe('string')
    })
  })

  describe('sendTransaction', () => {
    it('当没有 client 时不应该发送交易', async () => {
      vi.spyOn(node, 'getInputData').mockReturnValue(undefined)

      await node.sendTransaction()

      expect(mockClient.sendTransaction).not.toHaveBeenCalled()
    })

    it('当没有 to 地址时不应该发送交易', async () => {
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        return undefined
      })

      await node.sendTransaction()

      expect(mockClient.sendTransaction).not.toHaveBeenCalled()
    })

    it('应该成功发送交易', async () => {
      const testHash = '0xabcdef1234567890'
      const testAddress = '0x1234567890123456789012345678901234567890'
      const testValue = 1000000000000000000n

      mockClient.sendTransaction = vi.fn().mockResolvedValue(testHash)
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testAddress
        if (idx === 2) return testValue
        return undefined
      })

      await node.sendTransaction()
      node.onExecute()

      expect(mockClient.sendTransaction).toHaveBeenCalledWith({
        to: testAddress,
        value: testValue,
        data: undefined,
      })
      expect(node.getOutputData(0)).toBe(testHash)
    })

    it('应该处理没有 value 的情况', async () => {
      const testHash = '0xabcdef1234567890'
      const testAddress = '0x1234567890123456789012345678901234567890'

      mockClient.sendTransaction = vi.fn().mockResolvedValue(testHash)
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testAddress
        return undefined
      })

      await node.sendTransaction()

      expect(mockClient.sendTransaction).toHaveBeenCalledWith({
        to: testAddress,
        value: 0n,
        data: undefined,
      })
    })

    it('应该处理包含 data 的交易', async () => {
      const testHash = '0xabcdef1234567890'
      const testAddress = '0x1234567890123456789012345678901234567890'
      const testData = '0x12345678' as `0x${string}`

      mockClient.sendTransaction = vi.fn().mockResolvedValue(testHash)
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testAddress
        if (idx === 3) return testData
        return undefined
      })

      await node.sendTransaction()

      expect(mockClient.sendTransaction).toHaveBeenCalledWith({
        to: testAddress,
        value: 0n,
        data: testData,
      })
    })

    it('应该处理发送错误', async () => {
      const errorMessage = 'Insufficient funds'
      const testAddress = '0x1234567890123456789012345678901234567890'

      mockClient.sendTransaction = vi.fn().mockRejectedValue(new Error(errorMessage))
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testAddress
        return undefined
      })

      await node.sendTransaction()

      // 应该设置错误信息
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((node as any).error).toBe(errorMessage)
    })
  })

  describe('onAction', () => {
    it('触发 trigger action 时应该调用 sendTransaction', async () => {
      const sendSpy = vi.spyOn(node, 'sendTransaction').mockResolvedValue()

      await node.onAction('trigger')

      expect(sendSpy).toHaveBeenCalled()
    })

    it('其他 action 不应该触发 sendTransaction', async () => {
      const sendSpy = vi.spyOn(node, 'sendTransaction').mockResolvedValue()

      await node.onAction('other')

      expect(sendSpy).not.toHaveBeenCalled()
    })
  })

  describe('onExecute', () => {
    it('应该设置输出数据', () => {
      const testHash = '0xabcdef1234567890'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (node as any).hash = testHash

      node.onExecute()

      expect(node.getOutputData(0)).toBe(testHash)
    })

    it('没有 hash 时应该输出 null', () => {
      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })
  })

  describe('onDrawForeground', () => {
    it('应该显示发送中状态', () => {
      const ctx = {
        font: '',
        fillStyle: '',
        fillText: vi.fn(),
      } as unknown as CanvasRenderingContext2D

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (node as any).isLoading = true
      node.onDrawForeground(ctx)

      expect(ctx.fillText).toHaveBeenCalledWith('Sending...', 10, 100)
    })

    it('应该显示错误状态', () => {
      const ctx = {
        font: '',
        fillStyle: '',
        fillText: vi.fn(),
      } as unknown as CanvasRenderingContext2D

      const errorMessage = 'Insufficient funds for transfer'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (node as any).error = errorMessage
      node.onDrawForeground(ctx)

      expect(ctx.fillText).toHaveBeenCalledWith('Error: Insufficient f', 10, 100)
    })

    it('应该显示成功状态', () => {
      const ctx = {
        font: '',
        fillStyle: '',
        fillText: vi.fn(),
      } as unknown as CanvasRenderingContext2D

      const testHash = '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (node as any).hash = testHash
      node.onDrawForeground(ctx)

      expect(ctx.fillText).toHaveBeenCalledWith('Hash: 0xabcdef12...', 10, 100)
    })

    it('节点折叠时不应该绘制', () => {
      const ctx = {
        fillText: vi.fn(),
      } as unknown as CanvasRenderingContext2D

      node.flags = { collapsed: true }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (node as any).hash = '0x1234'
      node.onDrawForeground(ctx)

      expect(ctx.fillText).not.toHaveBeenCalled()
    })
  })
})
