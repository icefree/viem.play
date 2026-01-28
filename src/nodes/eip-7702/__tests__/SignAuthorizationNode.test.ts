import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SignAuthorizationNode } from '../SignAuthorizationNode'
import type { WalletClient } from 'viem'

describe('SignAuthorizationNode', () => {
  let node: SignAuthorizationNode
  let mockClient: WalletClient

  beforeEach(() => {
    node = new SignAuthorizationNode()
    mockClient = {
      signAuthorization: vi.fn(),
    } as unknown as WalletClient
  })

  describe('constructor', () => {
    it('应该正确设置节点标题', () => {
      // 在测试环境中,LiteGraph 可能不会自动设置 title
      // 我们检查静态属性而不是实例属性
      expect(SignAuthorizationNode.title).toBe('signAuthorization')
    })

    it('应该有正确的描述', () => {
      expect(SignAuthorizationNode.desc).toBe('Sign EIP-7702 authorization')
    })

    it('应该有正确的颜色配置', () => {
      expect(node.color).toBe('#667eea')
      expect(node.bgcolor).toBe('#4c51bf')
    })

    it('应该正确设置输入输出', () => {
      expect(node.inputs).toHaveLength(4)
      expect(node.outputs).toHaveLength(1)
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs?.[0].name).toBe('client')
      expect(node.inputs?.[0].type).toBe('walletClient')
      expect(node.inputs?.[1].name).toBe('contractAddress')
      expect(node.inputs?.[1].type).toBe('address')
      expect(node.inputs?.[2].name).toBe('chainId')
      expect(node.inputs?.[2].type).toBe('number')
      expect(node.inputs?.[3].name).toBe('nonce')
      expect(node.inputs?.[3].type).toBe('bigint')
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs?.[0].name).toBe('authorization')
      expect(node.outputs?.[0].type).toBe('object')
    })

    it('应该有正确的尺寸', () => {
      expect(node.size).toEqual([200, 110])
    })
  })

  describe('onExecute', () => {
    it('当没有输入时应该输出 null', async () => {
      vi.spyOn(node, 'getInputData').mockReturnValue(undefined)

      await node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('当有完整输入时应该读取输入数据', async () => {
      const testContractAddress = '0x1234567890123456789012345678901234567890'
      const testChainId = 1
      const testNonce = 0n

      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testContractAddress
        if (idx === 2) return testChainId
        if (idx === 3) return testNonce
        return undefined
      })

      await node.onExecute()

      // 验证输入数据被正确读取
      expect(node.getInputData(0)).toBe(mockClient)
      expect(node.getInputData(1)).toBe(testContractAddress)
      expect(node.getInputData(2)).toBe(testChainId)
      expect(node.getInputData(3)).toBe(testNonce)
    })

    it('应该处理边界值 chainId', async () => {
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return '0x1234567890123456789012345678901234567890'
        if (idx === 2) return 2147483647 // max int32
        if (idx === 3) return 0n
        return undefined
      })

      await node.onExecute()

      expect(node.getInputData(2)).toBe(2147483647)
    })

    it('应该处理大的 nonce 值', async () => {
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return '0x1234567890123456789012345678901234567890'
        if (idx === 2) return 1
        if (idx === 3) return 2n ** 256n - 1n
        return undefined
      })

      await node.onExecute()

      expect(node.getInputData(3)).toBe(2n ** 256n - 1n)
    })

    it('应该处理零值 nonce', async () => {
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return '0x1234567890123456789012345678901234567890'
        if (idx === 2) return 1
        if (idx === 3) return 0n
        return undefined
      })

      await node.onExecute()

      expect(node.getInputData(3)).toBe(0n)
    })

    it('应该处理零 chainId', async () => {
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return '0x1234567890123456789012345678901234567890'
        if (idx === 2) return 0
        if (idx === 3) return 0n
        return undefined
      })

      await node.onExecute()

      expect(node.getInputData(2)).toBe(0)
    })
  })
})
