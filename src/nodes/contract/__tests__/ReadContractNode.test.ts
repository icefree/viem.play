import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ReadContractNode } from '../ReadContractNode'
import type { PublicClient, Address, Abi } from 'viem'

describe('ReadContractNode', () => {
  let node: ReadContractNode
  let mockClient: PublicClient
  const testAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb' as const
  const testAbi = [
    {
      type: 'function',
      name: 'balanceOf',
      stateMutability: 'view',
      inputs: [{ name: 'owner', type: 'address' }],
      outputs: [{ name: '', type: 'uint256' }],
    },
  ] as const
  const testFunctionName = 'balanceOf'

  beforeEach(() => {
    node = new ReadContractNode()
    mockClient = {
      readContract: vi.fn(),
    } as unknown as PublicClient
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和描述', () => {
      expect(node.title).toBe('readContract')
      expect(ReadContractNode.title).toBe('readContract')
      expect(ReadContractNode.desc).toBe('Read data from a contract')
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
      expect(node.outputs).toHaveLength(1)
      expect(node.outputs?.[0].name).toBe('result')
      expect(node.outputs?.[0].type).toBe('')
    })

    it('应该设置正确的节点大小', () => {
      expect(node.size).toEqual([180, 140])
    })
  })

  describe('onAction', () => {
    it('当没有 client 时不应该执行读取', async () => {
      vi.spyOn(node, 'getInputData').mockReturnValue(undefined)

      await node.onAction('trigger')

      expect(mockClient.readContract).not.toHaveBeenCalled()
    })

    it('当没有 address 时不应该执行读取', async () => {
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        return undefined
      })

      await node.onAction('trigger')

      expect(mockClient.readContract).not.toHaveBeenCalled()
    })

    it('当没有 abi 时不应该执行读取', async () => {
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testAddress
        return undefined
      })

      await node.onAction('trigger')

      expect(mockClient.readContract).not.toHaveBeenCalled()
    })

    it('当没有 functionName 时不应该执行读取', async () => {
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testAddress
        if (idx === 2) return testAbi
        return undefined
      })

      await node.onAction('trigger')

      expect(mockClient.readContract).not.toHaveBeenCalled()
    })

    it('应该成功读取合约数据', async () => {
      const expectedResult = 1000000000000000000n
      mockClient.readContract = vi.fn().mockResolvedValue(expectedResult)
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testAddress
        if (idx === 2) return testAbi
        if (idx === 3) return testFunctionName
        if (idx === 4) return [testAddress]
        return undefined
      })

      await node.onAction('trigger')
      node.onExecute()

      expect(mockClient.readContract).toHaveBeenCalledWith({
        address: testAddress,
        abi: testAbi,
        functionName: testFunctionName,
        args: [testAddress],
      })
      expect(node.getOutputData(0)).toBe(expectedResult)
    })

    it('应该正确处理带参数的合约读取', async () => {
      const expectedResult = 5000000000000000000n
      const testArgs = [testAddress, 123]

      mockClient.readContract = vi.fn().mockResolvedValue(expectedResult)
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testAddress
        if (idx === 2) return testAbi
        if (idx === 3) return testFunctionName
        if (idx === 4) return testArgs
        return undefined
      })

      await node.onAction('trigger')
      node.onExecute()

      expect(mockClient.readContract).toHaveBeenCalledWith({
        address: testAddress,
        abi: testAbi,
        functionName: testFunctionName,
        args: testArgs,
      })
      expect(node.getOutputData(0)).toBe(expectedResult)
    })

    it('应该处理读取错误', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      mockClient.readContract = vi.fn().mockRejectedValue(new Error('Contract read failed'))
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testAddress
        if (idx === 2) return testAbi
        if (idx === 3) return testFunctionName
        return undefined
      })

      await node.onAction('trigger')
      node.onExecute()

      expect(consoleErrorSpy).toHaveBeenCalled()
      expect(node.getOutputData(0)).toBeNull()
      consoleErrorSpy.mockRestore()
    })

    it('非 trigger action 不应该执行读取', async () => {
      const readSpy = vi.spyOn(mockClient, 'readContract')

      await node.onAction('other')

      expect(readSpy).not.toHaveBeenCalled()
    })
  })

  describe('onExecute', () => {
    it('应该设置输出数据', async () => {
      const expectedResult = 2000000000000000000n
      mockClient.readContract = vi.fn().mockResolvedValue(expectedResult)
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testAddress
        if (idx === 2) return testAbi
        if (idx === 3) return testFunctionName
        return undefined
      })

      await node.onAction('trigger')
      node.onExecute()

      expect(node.getOutputData(0)).toBe(expectedResult)
    })

    it('初始状态输出应为 null', () => {
      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })
  })
})
