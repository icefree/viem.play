import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SignTypedDataNode } from '../SignTypedDataNode'
import type { WalletClient } from 'viem'

describe('SignTypedDataNode', () => {
  let node: SignTypedDataNode
  let mockClient: WalletClient

  beforeEach(() => {
    node = new SignTypedDataNode()
    mockClient = {
      signTypedData: vi.fn(),
    } as unknown as WalletClient
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和输入输出', () => {
      expect(node.title).toBe('signTypedData')
      expect(node.inputs).toHaveLength(3)
      expect(node.outputs).toHaveLength(1)
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs?.[0].name).toBe('client')
      expect(node.inputs?.[1].name).toBe('typedData')
      expect(node.inputs?.[2].name).toBe('trigger')
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs?.[0].name).toBe('signature')
      expect(node.outputs?.[0].type).toBe('string')
    })
  })

  describe('onAction', () => {
    it('当没有 client 时不应该签名', async () => {
      vi.spyOn(node, 'getInputData').mockReturnValue(undefined)

      await node.onAction('trigger')

      expect(mockClient.signTypedData).not.toHaveBeenCalled()
    })

    it('当没有 typedData 时不应该签名', async () => {
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        return undefined
      })

      await node.onAction('trigger')

      expect(mockClient.signTypedData).not.toHaveBeenCalled()
    })

    it('应该成功签名类型化数据', async () => {
      const testSignature = '0xabcdef1234567890'
      const testTypedData = {
        types: {
          Message: [{ name: 'content', type: 'string' }],
        },
        primaryType: 'Message' as const,
        domain: {
          name: 'Test',
          version: '1',
          chainId: 1,
        },
        message: {
          content: 'Hello',
        },
      }

      mockClient.signTypedData = vi.fn().mockResolvedValue(testSignature)
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testTypedData
        return undefined
      })

      await node.onAction('trigger')

      expect(mockClient.signTypedData).toHaveBeenCalledWith(testTypedData)
      expect(node.getOutputData(0)).toBe(testSignature)
    })

    it('应该处理签名错误', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      const testTypedData = {
        types: {
          Message: [{ name: 'content', type: 'string' }],
        },
        primaryType: 'Message' as const,
        domain: {},
        message: {},
      }

      mockClient.signTypedData = vi.fn().mockRejectedValue(new Error('User rejected'))
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testTypedData
        return undefined
      })

      await node.onAction('trigger')

      expect(consoleError).toHaveBeenCalled()
      consoleError.mockRestore()
    })

    it('其他 action 不应该触发签名', async () => {
      const testTypedData = {}
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testTypedData
        return undefined
      })

      await node.onAction('other')

      expect(mockClient.signTypedData).not.toHaveBeenCalled()
    })
  })
})
