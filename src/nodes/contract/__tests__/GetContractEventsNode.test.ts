import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GetContractEventsNode } from '../GetContractEventsNode'
import type { PublicClient, Address, Abi } from 'viem'

describe('GetContractEventsNode', () => {
  let node: GetContractEventsNode
  let mockClient: PublicClient
  const testAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb' as const
  const testAbi = [
    {
      type: 'event',
      name: 'Transfer',
      inputs: [
        { name: 'from', type: 'address', indexed: true },
        { name: 'to', type: 'address', indexed: true },
        { name: 'value', type: 'uint256', indexed: false },
      ],
    },
  ] as const
  const testEventName = 'Transfer'

  beforeEach(() => {
    node = new GetContractEventsNode()
    mockClient = {
      getContractEvents: vi.fn(),
    } as unknown as PublicClient
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和描述', () => {
      expect(node.title).toBe('getContractEvents')
      expect(GetContractEventsNode.title).toBe('getContractEvents')
      expect(GetContractEventsNode.desc).toBe('Get contract events')
    })

    it('应该正确设置节点颜色', () => {
      expect(node.color).toBe('#3182ce')
      expect(node.bgcolor).toBe('#2a4365')
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs).toHaveLength(5)
      expect(node.inputs?.[0].name).toBe('client')
      expect(node.inputs?.[0].type).toBe('publicClient')
      expect(node.inputs?.[1].name).toBe('address')
      expect(node.inputs?.[1].type).toBe('address')
      expect(node.inputs?.[2].name).toBe('abi')
      expect(node.inputs?.[2].type).toBe('abi')
      expect(node.inputs?.[3].name).toBe('eventName')
      expect(node.inputs?.[3].type).toBe('string')
      expect(node.inputs?.[4].name).toBe('trigger')
      expect(node.inputs?.[4].type).toBe(-1)
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs).toHaveLength(1)
      expect(node.outputs?.[0].name).toBe('events')
      expect(node.outputs?.[0].type).toBe('array')
    })

    it('应该设置正确的节点大小', () => {
      expect(node.size).toEqual([180, 120])
    })
  })

  describe('onAction', () => {
    it('当没有 client 时不应该获取事件', async () => {
      vi.spyOn(node, 'getInputData').mockReturnValue(undefined)

      await node.onAction('trigger')

      expect(mockClient.getContractEvents).not.toHaveBeenCalled()
    })

    it('当没有 address 时不应该获取事件', async () => {
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        return undefined
      })

      await node.onAction('trigger')

      expect(mockClient.getContractEvents).not.toHaveBeenCalled()
    })

    it('当没有 abi 时不应该获取事件', async () => {
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testAddress
        return undefined
      })

      await node.onAction('trigger')

      expect(mockClient.getContractEvents).not.toHaveBeenCalled()
    })

    it('当没有 eventName 时不应该获取事件', async () => {
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testAddress
        if (idx === 2) return testAbi
        return undefined
      })

      await node.onAction('trigger')

      expect(mockClient.getContractEvents).not.toHaveBeenCalled()
    })

    it('应该成功获取合约事件', async () => {
      const mockEvents = [
        {
          eventName: 'Transfer',
          args: {
            from: '0x0000000000000000000000000000000000000000' as const,
            to: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb' as const,
            value: 1000000000000000000n,
          },
        },
        {
          eventName: 'Transfer',
          args: {
            from: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb' as const,
            to: '0x1234567890123456789012345678901234567890' as const,
            value: 500000000000000000n,
          },
        },
      ]

      mockClient.getContractEvents = vi.fn().mockResolvedValue(mockEvents)
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testAddress
        if (idx === 2) return testAbi
        if (idx === 3) return testEventName
        return undefined
      })

      await node.onAction('trigger')
      node.onExecute()

      expect(mockClient.getContractEvents).toHaveBeenCalledWith({
        address: testAddress,
        abi: testAbi,
        eventName: testEventName,
      })
      expect(node.getOutputData(0)).toEqual(mockEvents)
    })

    it('应该处理空事件列表', async () => {
      const mockEvents: any[] = []

      mockClient.getContractEvents = vi.fn().mockResolvedValue(mockEvents)
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testAddress
        if (idx === 2) return testAbi
        if (idx === 3) return testEventName
        return undefined
      })

      await node.onAction('trigger')
      node.onExecute()

      expect(node.getOutputData(0)).toEqual([])
      expect(node.getOutputData(0)).toHaveLength(0)
    })

    it('应该处理获取事件错误', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      mockClient.getContractEvents = vi.fn().mockRejectedValue(new Error('Failed to get events'))
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testAddress
        if (idx === 2) return testAbi
        if (idx === 3) return testEventName
        return undefined
      })

      await node.onAction('trigger')

      expect(consoleErrorSpy).toHaveBeenCalled()
      consoleErrorSpy.mockRestore()
    })

    it('非 trigger action 不应该获取事件', async () => {
      const getEventsSpy = vi.spyOn(mockClient, 'getContractEvents')

      await node.onAction('other')

      expect(getEventsSpy).not.toHaveBeenCalled()
    })
  })

  describe('onExecute', () => {
    it('应该设置输出数据', async () => {
      const mockEvents = [
        {
          eventName: 'Transfer',
          args: {
            from: '0x0000000000000000000000000000000000000000' as const,
            to: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb' as const,
            value: 2000000000000000000n,
          },
        },
      ]

      mockClient.getContractEvents = vi.fn().mockResolvedValue(mockEvents)
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testAddress
        if (idx === 2) return testAbi
        if (idx === 3) return testEventName
        return undefined
      })

      await node.onAction('trigger')
      node.onExecute()

      expect(node.getOutputData(0)).toEqual(mockEvents)
    })

    it('初始状态输出应为 null', () => {
      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })
  })
})
