import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SignMessageNode } from '../SignMessageNode'
import type { WalletClient } from 'viem'

describe('SignMessageNode', () => {
  let node: SignMessageNode
  let mockClient: WalletClient

  beforeEach(() => {
    node = new SignMessageNode()
    mockClient = {
      signMessage: vi.fn(),
    } as unknown as WalletClient
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和输入输出', () => {
      expect(node.title).toBe('signMessage')
      expect(node.inputs).toHaveLength(3)
      expect(node.outputs).toHaveLength(1)
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs?.[0].name).toBe('client')
      expect(node.inputs?.[1].name).toBe('message')
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

      expect(mockClient.signMessage).not.toHaveBeenCalled()
    })

    it('当没有 message 时不应该签名', async () => {
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        return undefined
      })

      await node.onAction('trigger')

      expect(mockClient.signMessage).not.toHaveBeenCalled()
    })

    it('应该成功签名消息', async () => {
      const testSignature = '0xabcdef1234567890'
      const testMessage = 'Hello, world!'

      mockClient.signMessage = vi.fn().mockResolvedValue(testSignature)
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testMessage
        return undefined
      })

      await node.onAction('trigger')
      node.onExecute()

      expect(mockClient.signMessage).toHaveBeenCalledWith({ message: testMessage })
      expect(node.getOutputData(0)).toBe(testSignature)
    })

    it('应该处理签名错误', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      const testMessage = 'Hello, world!'

      mockClient.signMessage = vi.fn().mockRejectedValue(new Error('User rejected'))
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testMessage
        return undefined
      })

      await node.onAction('trigger')

      expect(consoleError).toHaveBeenCalled()
      consoleError.mockRestore()
    })

    it('其他 action 不应该触发签名', async () => {
      const testMessage = 'Hello, world!'
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testMessage
        return undefined
      })

      await node.onAction('other')

      expect(mockClient.signMessage).not.toHaveBeenCalled()
    })
  })

  describe('onExecute', () => {
    it('应该设置输出数据', () => {
      const testSignature = '0xabcdef1234567890'
      Object.defineProperty(node, 'signature', { value: testSignature, writable: true })

      node.onExecute()

      expect(node.getOutputData(0)).toBe(testSignature)
    })

    it('没有签名时应该输出 null', () => {
      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })
  })

  describe('onDrawForeground', () => {
    it('应该显示签名中状态', () => {
      const ctx = {
        font: '',
        fillStyle: '',
        fillText: vi.fn(),
      } as unknown as CanvasRenderingContext2D

      Object.defineProperty(node, 'isLoading', { value: true, writable: true })
      node.onDrawForeground(ctx)

      expect(ctx.fillText).toHaveBeenCalledWith('Signing...', 10, 70)
    })

    it('节点折叠时不应该绘制', () => {
      const ctx = {
        fillText: vi.fn(),
      } as unknown as CanvasRenderingContext2D

      node.flags = Object.assign({}, node.flags, { collapsed: true })
      Object.defineProperty(node, 'isLoading', { value: true, writable: true })
      node.onDrawForeground(ctx)

      expect(ctx.fillText).not.toHaveBeenCalled()
    })
  })
})
