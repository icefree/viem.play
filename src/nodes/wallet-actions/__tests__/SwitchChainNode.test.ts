import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SwitchChainNode } from '../SwitchChainNode'
import type { WalletClient } from 'viem'

describe('SwitchChainNode', () => {
  let node: SwitchChainNode
  let mockClient: WalletClient

  beforeEach(() => {
    node = new SwitchChainNode()
    mockClient = {
      switchChain: vi.fn(),
    } as unknown as WalletClient
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和输入输出', () => {
      expect(node.title).toBe('switchChain')
      expect(node.inputs).toHaveLength(3)
      expect(node.outputs).toHaveLength(1)
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs?.[0].name).toBe('client')
      expect(node.inputs?.[1].name).toBe('chainId')
      expect(node.inputs?.[2].name).toBe('trigger')
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs?.[0].name).toBe('success')
      expect(node.outputs?.[0].type).toBe('boolean')
    })
  })

  describe('onAction', () => {
    it('当没有 client 时不应该切换链', async () => {
      vi.spyOn(node, 'getInputData').mockReturnValue(undefined)

      await node.onAction('trigger')

      expect(mockClient.switchChain).not.toHaveBeenCalled()
      expect(node.getOutputData(0)).toBeUndefined()
    })

    it('当没有 chainId 时不应该切换链', async () => {
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        return undefined
      })

      await node.onAction('trigger')

      expect(mockClient.switchChain).not.toHaveBeenCalled()
    })

    it('应该成功切换链', async () => {
      const testChainId = 1

      mockClient.switchChain = vi.fn().mockResolvedValue(undefined)
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testChainId
        return undefined
      })

      await node.onAction('trigger')

      expect(mockClient.switchChain).toHaveBeenCalledWith({ id: testChainId })
      expect(node.getOutputData(0)).toBe(true)
    })

    it('应该处理切换链错误', async () => {
      const testChainId = 999

      mockClient.switchChain = vi.fn().mockRejectedValue(new Error('Chain not added'))
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testChainId
        return undefined
      })

      await node.onAction('trigger')

      expect(node.getOutputData(0)).toBe(false)
    })

    it('其他 action 不应该触发切换链', async () => {
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return 1
        return undefined
      })

      await node.onAction('other')

      expect(mockClient.switchChain).not.toHaveBeenCalled()
    })
  })
})
