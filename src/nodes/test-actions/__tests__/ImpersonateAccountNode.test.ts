import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ImpersonateAccountNode } from '../ImpersonateAccountNode'
import { createMockTestClient } from '@test-utils/helpers'
import type { TestClient } from 'viem'

describe('ImpersonateAccountNode', () => {
  let node: ImpersonateAccountNode
  let mockClient: TestClient

  beforeEach(() => {
    node = new ImpersonateAccountNode()
    mockClient = createMockTestClient()
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和描述', () => {
      expect(node.title).toBe('impersonateAccount')
      expect(ImpersonateAccountNode.title).toBe('impersonateAccount')
      expect(ImpersonateAccountNode.desc).toBe('Impersonate an account')
    })

    it('应该有正确的颜色配置', () => {
      expect(node.color).toBe('#805ad5')
      expect(node.bgcolor).toBe('#553c9a')
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs).toHaveLength(3)
      expect(node.inputs?.[0].name).toBe('client')
      expect(node.inputs?.[0].type).toBe('testClient')
      expect(node.inputs?.[1].name).toBe('address')
      expect(node.inputs?.[1].type).toBe('address')
      expect(node.inputs?.[2].name).toBe('trigger')
      expect(node.inputs?.[2].type).toBe(-1)
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs).toHaveLength(1)
      expect(node.outputs?.[0].name).toBe('success')
      expect(node.outputs?.[0].type).toBe('boolean')
    })

    it('应该有正确的尺寸', () => {
      expect(node.size).toEqual([180, 80])
    })
  })

  describe('onAction', () => {
    it('应该正确执行 impersonateAccount 操作', async () => {
      const testAddress = '0x1234567890123456789012345678901234567890'
      const impersonateSpy = vi.spyOn(mockClient, 'impersonateAccount').mockResolvedValue(undefined)

      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testAddress
        return undefined
      })

      await node.onAction('trigger')

      expect(impersonateSpy).toHaveBeenCalledWith({ address: testAddress })
      expect(node.getOutputData(0)).toBe(true)
    })

    it('当没有 client 时应该返回', async () => {
      const impersonateSpy = vi.spyOn(mockClient, 'impersonateAccount')
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 1) return '0x1234567890123456789012345678901234567890'
        return undefined
      })

      await node.onAction('trigger')

      expect(impersonateSpy).not.toHaveBeenCalled()
    })

    it('当没有 address 时应该返回', async () => {
      const impersonateSpy = vi.spyOn(mockClient, 'impersonateAccount')
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        return undefined
      })

      await node.onAction('trigger')

      expect(impersonateSpy).not.toHaveBeenCalled()
    })

    it('应该处理 impersonateAccount 错误并返回 false', async () => {
      vi.spyOn(mockClient, 'impersonateAccount').mockRejectedValue(new Error('Impersonation failed'))
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return '0x1234567890123456789012345678901234567890'
        return undefined
      })

      await node.onAction('trigger')

      expect(node.getOutputData(0)).toBe(false)
    })

    it('非 trigger action 应该不执行操作', async () => {
      const impersonateSpy = vi.spyOn(mockClient, 'impersonateAccount')
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return '0x1234567890123456789012345678901234567890'
        return undefined
      })

      await node.onAction('other')

      expect(impersonateSpy).not.toHaveBeenCalled()
    })
  })

  describe('输出数据验证', () => {
    it('成功时应该输出 true', async () => {
      vi.spyOn(mockClient, 'impersonateAccount').mockResolvedValue(undefined)
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd'
        return undefined
      })

      await node.onAction('trigger')

      expect(node.getOutputData(0)).toBe(true)
    })

    it('失败时应该输出 false', async () => {
      vi.spyOn(mockClient, 'impersonateAccount').mockRejectedValue(new Error('Error'))
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return '0x1234567890123456789012345678901234567890'
        return undefined
      })

      await node.onAction('trigger')

      expect(node.getOutputData(0)).toBe(false)
    })
  })

  describe('参数验证', () => {
    it('应该正确传递 address 参数', async () => {
      const impersonateSpy = vi.spyOn(mockClient, 'impersonateAccount').mockResolvedValue(undefined)
      const testAddress = '0x9876543210987654321098765432109876543210'

      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testAddress
        return undefined
      })

      await node.onAction('trigger')

      expect(impersonateSpy).toHaveBeenCalledWith({ address: testAddress })
    })

    it('应该处理有效的以太坊地址格式', async () => {
      const impersonateSpy = vi.spyOn(mockClient, 'impersonateAccount').mockResolvedValue(undefined)
      const validAddresses = [
        '0x0000000000000000000000000000000000000001',
        '0xffffffffffffffffffffffffffffffffffffffff',
        '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      ]

      for (const address of validAddresses) {
        impersonateSpy.mockClear()
        vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
          if (idx === 0) return mockClient
          if (idx === 1) return address
          return undefined
        })

        await node.onAction('trigger')

        expect(impersonateSpy).toHaveBeenCalledWith({ address })
        expect(node.getOutputData(0)).toBe(true)
      }
    })
  })
})
