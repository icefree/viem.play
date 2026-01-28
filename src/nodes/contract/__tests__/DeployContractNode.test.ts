import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DeployContractNode } from '../DeployContractNode'
import type { WalletClient, Abi } from 'viem'

describe('DeployContractNode', () => {
  let node: DeployContractNode
  let mockClient: WalletClient
  const testAbi = [
    {
      type: 'constructor',
      stateMutability: 'nonpayable',
      inputs: [{ name: 'initialValue', type: 'uint256' }],
    },
    {
      type: 'function',
      name: 'getValue',
      stateMutability: 'view',
      inputs: [],
      outputs: [{ name: '', type: 'uint256' }],
    },
  ] as const
  const testBytecode = '0x6080604052348015600f57600080fd5b50603f80601d6000396000f3fe6080604052600080fdfea264697066735822122000000000000000000000000000000000000000000000000000000064736f6c63430008070033' as const
  const testHash = '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890' as const

  beforeEach(() => {
    node = new DeployContractNode()
    mockClient = {
      deployContract: vi.fn(),
    } as unknown as WalletClient
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和描述', () => {
      expect(node.title).toBe('deployContract')
      expect(DeployContractNode.title).toBe('deployContract')
      expect(DeployContractNode.desc).toBe('Deploy a contract')
    })

    it('应该正确设置节点颜色', () => {
      expect(node.color).toBe('#3182ce')
      expect(node.bgcolor).toBe('#2a4365')
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs).toHaveLength(5)
      expect(node.inputs?.[0].name).toBe('client')
      expect(node.inputs?.[0].type).toBe('walletClient')
      expect(node.inputs?.[1].name).toBe('abi')
      expect(node.inputs?.[1].type).toBe('abi')
      expect(node.inputs?.[2].name).toBe('bytecode')
      expect(node.inputs?.[2].type).toBe('bytes')
      expect(node.inputs?.[3].name).toBe('args')
      expect(node.inputs?.[3].type).toBe('array')
      expect(node.inputs?.[4].name).toBe('trigger')
      expect(node.inputs?.[4].type).toBe(-1)
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
    it('当没有 client 时不应该执行部署', async () => {
      vi.spyOn(node, 'getInputData').mockReturnValue(undefined)

      await node.onAction('trigger')

      expect(mockClient.deployContract).not.toHaveBeenCalled()
    })

    it('当没有 abi 时不应该执行部署', async () => {
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        return undefined
      })

      await node.onAction('trigger')

      expect(mockClient.deployContract).not.toHaveBeenCalled()
    })

    it('当没有 bytecode 时不应该执行部署', async () => {
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testAbi
        return undefined
      })

      await node.onAction('trigger')

      expect(mockClient.deployContract).not.toHaveBeenCalled()
    })

    it('应该成功部署合约', async () => {
      const initialValue = 1000000000000000000n

      mockClient.deployContract = vi.fn().mockResolvedValue(testHash)
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testAbi
        if (idx === 2) return testBytecode
        if (idx === 3) return [initialValue]
        return undefined
      })

      await node.onAction('trigger')
      node.onExecute()

      expect(mockClient.deployContract).toHaveBeenCalledWith({
        abi: testAbi,
        bytecode: testBytecode,
        args: [initialValue],
      })
      expect(node.getOutputData(0)).toBe(testHash)
    })

    it('应该正确处理没有 args 的情况', async () => {
      const simpleAbi = [
        {
          type: 'constructor',
          stateMutability: 'nonpayable',
          inputs: [],
        },
      ] as const

      mockClient.deployContract = vi.fn().mockResolvedValue(testHash)
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return simpleAbi
        if (idx === 2) return testBytecode
        return undefined
      })

      await node.onAction('trigger')
      node.onExecute()

      expect(mockClient.deployContract).toHaveBeenCalledWith({
        abi: simpleAbi,
        bytecode: testBytecode,
        args: undefined,
      })
      expect(node.getOutputData(0)).toBe(testHash)
    })

    it('应该处理多个构造函数参数', async () => {
      const multiArgsAbi = [
        {
          type: 'constructor',
          stateMutability: 'nonpayable',
          inputs: [
            { name: 'value1', type: 'uint256' },
            { name: 'value2', type: 'address' },
            { name: 'value3', type: 'bool' },
          ],
        },
      ] as const
      const args = [1000000000000000000n, '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb' as const, true]

      mockClient.deployContract = vi.fn().mockResolvedValue(testHash)
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return multiArgsAbi
        if (idx === 2) return testBytecode
        if (idx === 3) return args
        return undefined
      })

      await node.onAction('trigger')
      node.onExecute()

      expect(mockClient.deployContract).toHaveBeenCalledWith({
        abi: multiArgsAbi,
        bytecode: testBytecode,
        args: args,
      })
    })

    it('应该处理部署错误', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      mockClient.deployContract = vi.fn().mockRejectedValue(new Error('Deployment failed'))
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testAbi
        if (idx === 2) return testBytecode
        return undefined
      })

      await node.onAction('trigger')

      expect(consoleErrorSpy).toHaveBeenCalled()
      consoleErrorSpy.mockRestore()
    })

    it('非 trigger action 不应该执行部署', async () => {
      const deploySpy = vi.spyOn(mockClient, 'deployContract')

      await node.onAction('other')

      expect(deploySpy).not.toHaveBeenCalled()
    })
  })

  describe('onExecute', () => {
    it('应该设置输出数据', async () => {
      mockClient.deployContract = vi.fn().mockResolvedValue(testHash)
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testAbi
        if (idx === 2) return testBytecode
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
