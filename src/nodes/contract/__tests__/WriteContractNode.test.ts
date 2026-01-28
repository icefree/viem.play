import { describe, it, expect, vi, beforeEach } from 'vitest'
import { WriteContractNode } from '../WriteContractNode'
import type { WalletClient, Address, Abi } from 'viem'

describe('WriteContractNode', () => {
  let node: WriteContractNode
  let mockClient: WalletClient
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
  const testHash = '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890' as const

  beforeEach(() => {
    node = new WriteContractNode()
    mockClient = {
      writeContract: vi.fn(),
    } as unknown as WalletClient
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和描述', () => {
      expect(node.title).toBe('writeContract')
      expect(WriteContractNode.title).toBe('writeContract')
      expect(WriteContractNode.desc).toBe('Write data to a contract')
    })

    it('应该正确设置节点颜色', () => {
      expect(node.color).toBe('#3182ce')
      expect(node.bgcolor).toBe('#2a4365')
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs).toHaveLength(6)
      expect(node.inputs?.[0].name).toBe('client')
      expect(node.inputs?.[0].type).toBe('walletClient')
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
      expect(node.outputs?.[0].name).toBe('hash')
      expect(node.outputs?.[0].type).toBe('string')
    })

    it('应该设置正确的节点大小', () => {
      expect(node.size).toEqual([180, 140])
    })
  })

  describe('onAction', () => {
    it('当没有 client 时不应该执行写入', async () => {
      vi.spyOn(node, 'getInputData').mockReturnValue(undefined)

      await node.onAction('trigger')

      expect(mockClient.writeContract).not.toHaveBeenCalled()
    })

    it('当没有 address 时不应该执行写入', async () => {
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        return undefined
      })

      await node.onAction('trigger')

      expect(mockClient.writeContract).not.toHaveBeenCalled()
    })

    it('当没有 abi 时不应该执行写入', async () => {
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testAddress
        return undefined
      })

      await node.onAction('trigger')

      expect(mockClient.writeContract).not.toHaveBeenCalled()
    })

    it('当没有 functionName 时不应该执行写入', async () => {
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testAddress
        if (idx === 2) return testAbi
        return undefined
      })

      await node.onAction('trigger')

      expect(mockClient.writeContract).not.toHaveBeenCalled()
    })

    it('应该成功写入合约数据', async () => {
      const recipientAddress = '0x1234567890123456789012345678901234567890' as const
      const amount = 1000000000000000000n

      mockClient.writeContract = vi.fn().mockResolvedValue(testHash)
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

      expect(mockClient.writeContract).toHaveBeenCalledWith({
        address: testAddress,
        abi: testAbi,
        functionName: testFunctionName,
        args: [recipientAddress, amount],
      })
      expect(node.getOutputData(0)).toBe(testHash)
    })

    it('应该正确处理没有 args 的情况', async () => {
      mockClient.writeContract = vi.fn().mockResolvedValue(testHash)
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testAddress
        if (idx === 2) return testAbi
        if (idx === 3) return testFunctionName
        return undefined
      })

      await node.onAction('trigger')
      node.onExecute()

      expect(mockClient.writeContract).toHaveBeenCalledWith({
        address: testAddress,
        abi: testAbi,
        functionName: testFunctionName,
        args: undefined,
      })
      expect(node.getOutputData(0)).toBe(testHash)
    })

    it('应该处理写入错误', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      mockClient.writeContract = vi.fn().mockRejectedValue(new Error('Contract write failed'))
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

    it('非 trigger action 不应该执行写入', async () => {
      const writeSpy = vi.spyOn(mockClient, 'writeContract')

      await node.onAction('other')

      expect(writeSpy).not.toHaveBeenCalled()
    })
  })

  describe('onExecute', () => {
    it('应该设置输出数据', async () => {
      mockClient.writeContract = vi.fn().mockResolvedValue(testHash)
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testAddress
        if (idx === 2) return testAbi
        if (idx === 3) return testFunctionName
        return undefined
      })

      await node.onAction('trigger')
      node.onExecute()

      expect(node.getOutputData(0)).toBe(testHash)
    })

    it('没有 hash 时应该输出 null', () => {
      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })
  })
})
