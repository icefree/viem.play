import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PrivateKeyToAccountNode } from '../PrivateKeyToAccountNode'

describe('PrivateKeyToAccountNode', () => {
  let node: PrivateKeyToAccountNode

  beforeEach(() => {
    node = new PrivateKeyToAccountNode()
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和输入输出', () => {
      expect(node.title).toBe('privateKeyToAccount')
      expect(node.inputs).toHaveLength(1)
      expect(node.outputs).toHaveLength(2)
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs?.[0].name).toBe('privateKey')
      expect(node.inputs?.[0].type).toBe('string')
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs?.[0].name).toBe('account')
      expect(node.outputs?.[1].name).toBe('address')
      expect(node.outputs?.[1].type).toBe('address')
    })
  })

  describe('onExecute', () => {
    it('应该从私钥创建账户', () => {
      const testPrivateKey =
        '0x0000000000000000000000000000000000000000000000000000000000000001'
      vi.spyOn(node, 'getInputData').mockReturnValue(testPrivateKey)

      node.onExecute()

      const account = node.getOutputData(0)
      const address = node.getOutputData(1)

      expect(account).toBeTruthy()
      expect(address).toBeTruthy()
      expect(address).toMatch(/^0x[a-f0-9]{40}$/)
    })

    it('当没有私钥时应该输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValue(undefined)

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
      expect(node.getOutputData(1)).toBeNull()
    })

    it('当私钥不以 0x 开头时应该输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValue('invalid-key')

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
      expect(node.getOutputData(1)).toBeNull()
    })

    it('应该处理无效的私钥', () => {
      vi.spyOn(node, 'getInputData').mockReturnValue('0xinvalid')

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
      expect(node.getOutputData(1)).toBeNull()
    })

    it('应该同时输出账户和地址', () => {
      const testPrivateKey =
        '0x0000000000000000000000000000000000000000000000000000000000000001'
      vi.spyOn(node, 'getInputData').mockReturnValue(testPrivateKey)

      node.onExecute()

      const account = node.getOutputData(0)
      const address = node.getOutputData(1)

      expect(account).toHaveProperty('address')
      expect(account.address).toBe(address)
    })
  })

  describe('onDrawForeground', () => {
    it('有私钥时应该显示 Key connected', () => {
      const ctx = {
        font: '',
        fillStyle: '',
        fillText: vi.fn(),
      } as unknown as CanvasRenderingContext2D

      vi.spyOn(node, 'getInputData').mockReturnValue(
        '0x0000000000000000000000000000000000000000000000000000000000000001'
      )

      node.onDrawForeground(ctx)

      expect(ctx.fillText).toHaveBeenCalledWith('Key connected', 10, 45)
    })

    it('节点折叠时不应该绘制', () => {
      const ctx = {
        fillText: vi.fn(),
      } as unknown as CanvasRenderingContext2D

      node.flags = { collapsed: true }
      node.onDrawForeground(ctx)

      expect(ctx.fillText).not.toHaveBeenCalled()
    })

    it('没有私钥时不应该绘制文本', () => {
      const ctx = {
        fillText: vi.fn(),
      } as unknown as CanvasRenderingContext2D

      vi.spyOn(node, 'getInputData').mockReturnValue(undefined)
      node.onDrawForeground(ctx)

      expect(ctx.fillText).not.toHaveBeenCalled()
    })
  })
})
