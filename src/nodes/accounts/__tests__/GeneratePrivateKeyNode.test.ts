import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GeneratePrivateKeyNode } from '../GeneratePrivateKeyNode'

describe('GeneratePrivateKeyNode', () => {
  let node: GeneratePrivateKeyNode

  beforeEach(() => {
    node = new GeneratePrivateKeyNode()
  })

  describe('constructor', () => {
    it('应该正确设置节点标题 and 输出', () => {
      expect(node.title).toBe('generatePrivateKey')
      expect(node.outputs).toHaveLength(1)
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs?.[0].name).toBe('privateKey')
      expect(node.outputs?.[0].type).toBe('string')
    })

    it('应该有一个 Generate 按钮', () => {
      expect((node as any).widgets).toHaveLength(1)
      expect((node as any).widgets?.[0].name).toBe('Generate')
    })

    it('应该有 value 属性', () => {
      expect(node.properties.value).toBeDefined()
    })
  })

  describe('onExecute', () => {
    it('应该输出私钥', () => {
      const testKey = '0x1234567890abcdef'
      node.properties.value = testKey

      node.onExecute()

      expect(node.getOutputData(0)).toBe(testKey)
    })

    it('当没有值时应该输出 null', () => {
      node.properties.value = ''

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })
  })

  describe('Generate 按钮', () => {
    it('点击应该生成新的私钥', () => {
      // 触发按钮点击
      const widget = (node as any).widgets?.[0]
      if (widget?.callback) {
        widget.callback('')
      }

      expect(node.properties.value).toBeTruthy()
      expect(node.properties.value).toMatch(/^0x[a-f0-9]{64}$/)
    })
  })

  describe('onDrawForeground', () => {
    it('应该显示 PK Ready 当有私钥时', () => {
      const ctx = {
        font: '',
        fillStyle: '',
        fillText: vi.fn(),
      } as unknown as CanvasRenderingContext2D

      node.properties.value = '0x1234567890abcdef'
      node.onDrawForeground(ctx)

      expect(ctx.fillText).toHaveBeenCalledWith('PK Ready', 10, 45)
    })

    it('节点折叠时不应该绘制', () => {
      const ctx = {
        fillText: vi.fn(),
      } as unknown as CanvasRenderingContext2D

      node.flags = { collapsed: true }
      node.properties.value = '0x1234567890abcdef'
      node.onDrawForeground(ctx)

      expect(ctx.fillText).not.toHaveBeenCalled()
    })

    it('没有私钥时不应该绘制文本', () => {
      const ctx = {
        fillText: vi.fn(),
      } as unknown as CanvasRenderingContext2D

      node.properties.value = ''
      node.onDrawForeground(ctx)

      expect(ctx.fillText).not.toHaveBeenCalled()
    })
  })
})
