import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DisplayNode } from '../DisplayNode'

describe('DisplayNode', () => {
  let node: DisplayNode

  beforeEach(() => {
    node = new DisplayNode()
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和输入', () => {
      expect(node.title).toBe('Display')
      expect(node.inputs).toHaveLength(1)
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs?.[0].name).toBe('value')
      expect(node.inputs?.[0].type).toBe(0)
    })

    it('应该有正确的节点尺寸', () => {
      expect(node.size).toEqual([200, 80])
    })

    it('应该有正确的颜色配置', () => {
      expect(node.color).toBe('#4a5568')
      expect(node.bgcolor).toBe('#2d3748')
    })

    it('应该初始化 displayValue 为空字符串', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((node as any).displayValue).toBe('')
    })
  })

  describe('onExecute', () => {
    it('应该正确处理 bigint 类型的输入', () => {
      const testValue = 12345678901234567890n
      vi.spyOn(node, 'getInputData').mockReturnValue(testValue)

      node.onExecute()

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((node as any).displayValue).toBe('12345678901234567890')
    })

    it('应该正确处理字符串类型的输入', () => {
      const testValue = 'hello world'
      vi.spyOn(node, 'getInputData').mockReturnValue(testValue)

      node.onExecute()

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((node as any).displayValue).toBe('hello world')
    })

    it('应该正确处理数字类型的输入', () => {
      const testValue = 42.5
      vi.spyOn(node, 'getInputData').mockReturnValue(testValue)

      node.onExecute()

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((node as any).displayValue).toBe('42.5')
    })

    it('应该正确处理对象类型的输入', () => {
      const testValue = { name: 'test', value: 123 }
      vi.spyOn(node, 'getInputData').mockReturnValue(testValue)

      node.onExecute()

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((node as any).displayValue).toBe('{\n  "name": "test",\n  "value": 123\n}')
    })

    it('应该正确处理数组类型的输入', () => {
      const testValue = [1, 2, 3]
      vi.spyOn(node, 'getInputData').mockReturnValue(testValue)

      node.onExecute()

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((node as any).displayValue).toBe('[\n  1,\n  2,\n  3\n]')
    })

    it('应该处理无法 JSON 序列化的对象', () => {
      const testValue = { circular: null }
      testValue.circular = testValue
      vi.spyOn(node, 'getInputData').mockReturnValue(testValue)

      node.onExecute()

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((node as any).displayValue).toBe('[object Object]')
    })

    it('应该将 undefined 转换为 "null"', () => {
      vi.spyOn(node, 'getInputData').mockReturnValue(undefined)

      node.onExecute()

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((node as any).displayValue).toBe('null')
    })

    it('应该将 null 转换为 "null"', () => {
      vi.spyOn(node, 'getInputData').mockReturnValue(null)

      node.onExecute()

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((node as any).displayValue).toBe('null')
    })

    it('应该正确处理布尔值', () => {
      vi.spyOn(node, 'getInputData').mockReturnValue(true)

      node.onExecute()

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((node as any).displayValue).toBe('true')
    })
  })

  describe('onDrawForeground', () => {
    it('应该在画布上显示显示值', () => {
      const ctx = {
        font: '',
        fillStyle: '',
        fillText: vi.fn(),
      } as unknown as CanvasRenderingContext2D

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (node as any).displayValue = 'test value'
      node.onDrawForeground(ctx)

      expect(ctx.fillStyle).toBe('#e2e8f0')
      expect(ctx.font).toBe('12px monospace')
      expect(ctx.fillText).toHaveBeenCalledWith('test value', 10, 35)
    })

    it('应该截断过长的行', () => {
      const ctx = {
        font: '',
        fillStyle: '',
        fillText: vi.fn(),
      } as unknown as CanvasRenderingContext2D

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (node as any).displayValue = 'a'.repeat(30)
      node.onDrawForeground(ctx)

      expect(ctx.fillText).toHaveBeenCalledWith('a'.repeat(22) + '...', 10, 35)
    })

    it('应该只显示前 3 行', () => {
      const ctx = {
        font: '',
        fillStyle: '',
        fillText: vi.fn(),
      } as unknown as CanvasRenderingContext2D

      const multiLineText = 'line1\nline2\nline3\nline4\nline5' as unknown as string
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (node as any).displayValue = multiLineText
      node.onDrawForeground(ctx)

      expect(ctx.fillText).toHaveBeenCalledTimes(3)
      expect(ctx.fillText).toHaveBeenNthCalledWith(1, 'line1', 10, 35)
      expect(ctx.fillText).toHaveBeenNthCalledWith(2, 'line2', 10, 49)
      expect(ctx.fillText).toHaveBeenNthCalledWith(3, 'line3', 10, 63)
    })

    it('节点折叠时不应该绘制', () => {
      const ctx = {
        fillText: vi.fn(),
      } as unknown as CanvasRenderingContext2D

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (node as any).displayValue = 'test value'
      node.flags = { collapsed: true }
      node.onDrawForeground(ctx)

      expect(ctx.fillText).not.toHaveBeenCalled()
    })

    it('空显示值时不应该报错', () => {
      const ctx = {
        font: '',
        fillStyle: '',
        fillText: vi.fn(),
      } as unknown as CanvasRenderingContext2D

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (node as any).displayValue = ''
      node.onDrawForeground(ctx)

      expect(ctx.fillText).toHaveBeenCalledWith('', 10, 35)
    })
  })
})
