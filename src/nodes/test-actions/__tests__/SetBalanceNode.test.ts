import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SetBalanceNode } from '../SetBalanceNode'
import { createMockTestClient } from '@test-utils/helpers'
import type { TestClient } from 'viem'

describe('SetBalanceNode', () => {
  let node: SetBalanceNode
  let mockClient: TestClient

  beforeEach(() => {
    node = new SetBalanceNode()
    mockClient = createMockTestClient()
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和描述', () => {
      expect(node.title).toBe('setBalance')
      expect(SetBalanceNode.title).toBe('setBalance')
      expect(SetBalanceNode.desc).toBe('Set the balance of an address (test client only)')
    })

    it('应该有正确的颜色配置', () => {
      expect(node.color).toBe('#805ad5')
      expect(node.bgcolor).toBe('#553c9a')
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs).toHaveLength(4)
      expect(node.inputs?.[0].name).toBe('client')
      expect(node.inputs?.[0].type).toBe('testClient')
      expect(node.inputs?.[1].name).toBe('address')
      expect(node.inputs?.[1].type).toBe('address')
      expect(node.inputs?.[2].name).toBe('value')
      expect(node.inputs?.[2].type).toBe('bigint')
      expect(node.inputs?.[3].name).toBe('trigger')
      expect(node.inputs?.[3].type).toBe(-1)
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs).toHaveLength(1)
      expect(node.outputs?.[0].name).toBe('success')
      expect(node.outputs?.[0].type).toBe('boolean')
    })

    it('应该有正确的尺寸', () => {
      expect(node.size).toEqual([180, 100])
    })
  })

  describe('onAction', () => {
    it('应该正确执行 setBalance 操作', async () => {
      const testAddress = '0x1234567890123456789012345678901234567890'
      const testValue = 1000000000000000000n
      const setBalanceSpy = vi.spyOn(mockClient, 'setBalance').mockResolvedValue(undefined)

      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testAddress
        if (idx === 2) return testValue
        return undefined
      })

      await node.onAction('trigger')

      expect(setBalanceSpy).toHaveBeenCalledWith({ address: testAddress, value: testValue })
      expect(node.getOutputData(0)).toBe(true)
    })

    it('当没有 client 时应该返回', async () => {
      const setBalanceSpy = vi.spyOn(mockClient, 'setBalance')
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 1) return '0x1234567890123456789012345678901234567890'
        if (idx === 2) return 1000n
        return undefined
      })

      await node.onAction('trigger')

      expect(setBalanceSpy).not.toHaveBeenCalled()
    })

    it('当没有 address 时应该返回', async () => {
      const setBalanceSpy = vi.spyOn(mockClient, 'setBalance')
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 2) return 1000n
        return undefined
      })

      await node.onAction('trigger')

      expect(setBalanceSpy).not.toHaveBeenCalled()
    })

    it('当没有 value 时应该返回', async () => {
      const setBalanceSpy = vi.spyOn(mockClient, 'setBalance')
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return '0x1234567890123456789012345678901234567890'
        return undefined
      })

      await node.onAction('trigger')

      expect(setBalanceSpy).not.toHaveBeenCalled()
    })

    it('应该处理 setBalance 错误并返回 false', async () => {
      vi.spyOn(mockClient, 'setBalance').mockRejectedValue(new Error('Set balance failed'))
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return '0x1234567890123456789012345678901234567890'
        if (idx === 2) return 1000n
        return undefined
      })

      await node.onAction('trigger')

      expect(node.getOutputData(0)).toBe(false)
    })

    it('非 trigger action 应该不执行操作', async () => {
      const setBalanceSpy = vi.spyOn(mockClient, 'setBalance')
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return '0x1234567890123456789012345678901234567890'
        if (idx === 2) return 1000n
        return undefined
      })

      await node.onAction('other')

      expect(setBalanceSpy).not.toHaveBeenCalled()
    })
  })

  describe('输出数据验证', () => {
    it('成功时应该输出 true', async () => {
      vi.spyOn(mockClient, 'setBalance').mockResolvedValue(undefined)
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return '0x1234567890123456789012345678901234567890'
        if (idx === 2) return 999999999999999999n
        return undefined
      })

      await node.onAction('trigger')

      expect(node.getOutputData(0)).toBe(true)
    })

    it('失败时应该输出 false', async () => {
      vi.spyOn(mockClient, 'setBalance').mockRejectedValue(new Error('Error'))
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return '0x1234567890123456789012345678901234567890'
        if (idx === 2) return 1000n
        return undefined
      })

      await node.onAction('trigger')

      expect(node.getOutputData(0)).toBe(false)
    })
  })

  describe('参数验证', () => {
    it('应该正确传递 address 和 value 参数', async () => {
      const setBalanceSpy = vi.spyOn(mockClient, 'setBalance').mockResolvedValue(undefined)
      const testAddress = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd'
      const testValue = 5000000000000000000n

      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testAddress
        if (idx === 2) return testValue
        return undefined
      })

      await node.onAction('trigger')

      expect(setBalanceSpy).toHaveBeenCalledWith({ address: testAddress, value: testValue })
    })

    it('应该处理零余额的情况', async () => {
      const setBalanceSpy = vi.spyOn(mockClient, 'setBalance').mockResolvedValue(undefined)
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return '0x1234567890123456789012345678901234567890'
        if (idx === 2) return 0n
        return undefined
      })

      await node.onAction('trigger')

      expect(setBalanceSpy).toHaveBeenCalledWith({
        address: '0x1234567890123456789012345678901234567890',
        value: 0n
      })
      expect(node.getOutputData(0)).toBe(true)
    })

    it('应该处理大额余额的情况', async () => {
      const setBalanceSpy = vi.spyOn(mockClient, 'setBalance').mockResolvedValue(undefined)
      const largeValue = 100000000000000000000000000n

      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return '0x1234567890123456789012345678901234567890'
        if (idx === 2) return largeValue
        return undefined
      })

      await node.onAction('trigger')

      expect(setBalanceSpy).toHaveBeenCalledWith({
        address: '0x1234567890123456789012345678901234567890',
        value: largeValue
      })
      expect(node.getOutputData(0)).toBe(true)
    })
  })
})
