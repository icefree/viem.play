import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SimulateContractNode } from '../SimulateContractNode'
import type { PublicClient } from 'viem'

describe('SimulateContractNode', () => {
  let node: SimulateContractNode
  let mockClient: PublicClient
  const testAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb' as const
  const testAbi = [
    {
      type: 'function',
      name: 'transfer',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'to', type: 'address' },
        { name: 'amount', type: 'uint256' },
      ],
      outputs: [{ name: '', type: 'bool' }],
    },
  ] as const
  const testFunctionName = 'transfer'

  beforeEach(() => {
    node = new SimulateContractNode()
    mockClient = {
      simulateContract: vi.fn(),
    } as unknown as PublicClient
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和描述', () => {
      expect(node.title).toBe('simulateContract')
      expect(SimulateContractNode.title).toBe('simulateContract')
      expect(SimulateContractNode.desc).toBe('Simulate a contract call')
    })

    it('应该正确设置节点颜色', () => {
      expect(node.color).toBe('#3182ce')
      expect(node.bgcolor).toBe('#2a4365')
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs).toHaveLength(6)
      expect(node.inputs?.[0].name).toBe('client')
      expect(node.inputs?.[0].type).toBe('publicClient')
      expect(node.inputs?.[1].name).toBe('address')
      expect(node.inputs?.[1].type).toBe('address')
      expect(node.inputs?.[2].name).toBe('abi')
      expect(node.inputs?.[2].type).toBe('abi')
      expect(node.inputs?.[3].name).toBe('functionName')
      expect(node.inputs?.[3].type).toBe('string')
      expect(node.inputs?.[4].name).toBe('args')
      expect(node.inputs?.[4].type).toBe('array')
      expect(node.inputs?.[5].name).toBe('trigger')
      expect(node.inputs?.[5].type).toBe(-1)
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs).toHaveLength(2)
      expect(node.outputs?.[0].name).toBe('result')
      expect(node.outputs?.[0].type).toBe('')
      expect(node.outputs?.[1].name).toBe('request')
      expect(node.outputs?.[1].type).toBe('object')
    })

    it('应该设置正确的节点大小', () => {
      expect(node.size).toEqual([180, 160])
    })
  })

  describe('onAction', () => {
    it('当没有 client 时不应该执行模拟', async () => {
      vi.spyOn(node, 'getInputData').mockReturnValue(undefined)

      await node.onAction('trigger')

      expect(mockClient.simulateContract).not.toHaveBeenCalled()
    })

    it('当没有 address 时不应该执行模拟', async () => {
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        return undefined
      })

      await node.onAction('trigger')

      expect(mockClient.simulateContract).not.toHaveBeenCalled()
    })

    it('当没有 abi 时不应该执行模拟', async () => {
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testAddress
        return undefined
      })

      await node.onAction('trigger')

      expect(mockClient.simulateContract).not.toHaveBeenCalled()
    })

    it('当没有 functionName 时不应该执行模拟', async () => {
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testAddress
        if (idx === 2) return testAbi
        return undefined
      })

      await node.onAction('trigger')

      expect(mockClient.simulateContract).not.toHaveBeenCalled()
    })

    it('应该成功模拟合约调用', async () => {
      const recipientAddress = '0x1234567890123456789012345678901234567890' as const
      const amount = 1000000000000000000n
      const mockResult = true
      const mockRequest = {
        to: testAddress,
        data: '0xabcdef',
      }

      mockClient.simulateContract = vi.fn().mockResolvedValue({
        result: mockResult,
        request: mockRequest,
      })
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testAddress
        if (idx === 2) return testAbi
        if (idx === 3) return testFunctionName
        if (idx === 4) return [recipientAddress, amount]
        return undefined
      })

      await node.onAction('trigger')
      node.onExecute()

      expect(mockClient.simulateContract).toHaveBeenCalledWith({
        address: testAddress,
        abi: testAbi,
        functionName: testFunctionName,
        args: [recipientAddress, amount],
      })
      expect(node.getOutputData(0)).toBe(mockResult)
      expect(node.getOutputData(1)).toEqual(mockRequest)
    })

    it('应该正确处理没有 args 的情况', async () => {
      const mockResult = 123n
      const mockRequest = { to: testAddress }

      mockClient.simulateContract = vi.fn().mockResolvedValue({
        result: mockResult,
        request: mockRequest,
      })
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testAddress
        if (idx === 2) return testAbi
        if (idx === 3) return testFunctionName
        return undefined
      })

      await node.onAction('trigger')
      node.onExecute()

      expect(mockClient.simulateContract).toHaveBeenCalledWith({
        address: testAddress,
        abi: testAbi,
        functionName: testFunctionName,
        args: undefined,
      })
      expect(node.getOutputData(0)).toBe(mockResult)
      expect(node.getOutputData(1)).toEqual(mockRequest)
    })

    it('应该处理模拟错误', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      mockClient.simulateContract = vi.fn().mockRejectedValue(new Error('Simulation failed'))
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testAddress
        if (idx === 2) return testAbi
        if (idx === 3) return testFunctionName
        return undefined
      })

      await node.onAction('trigger')

      expect(consoleErrorSpy).toHaveBeenCalled()
      consoleErrorSpy.mockRestore()
    })

    it('非 trigger action 不应该执行模拟', async () => {
      const simulateSpy = vi.spyOn(mockClient, 'simulateContract')

      await node.onAction('other')

      expect(simulateSpy).not.toHaveBeenCalled()
    })
  })

  describe('onExecute', () => {
    it('应该正确设置两个输出数据', async () => {
      const mockResult = { value: 456n }
      const mockRequest = { to: testAddress, data: '0x1234' }

      mockClient.simulateContract = vi.fn().mockResolvedValue({
        result: mockResult,
        request: mockRequest,
      })
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testAddress
        if (idx === 2) return testAbi
        if (idx === 3) return testFunctionName
        return undefined
      })

      await node.onAction('trigger')
      node.onExecute()

      expect(node.getOutputData(0)).toEqual(mockResult)
      expect(node.getOutputData(1)).toEqual(mockRequest)
    })

    it('初始状态输出应为 null', () => {
      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
      expect(node.getOutputData(1)).toBeNull()
    })
  })
})
