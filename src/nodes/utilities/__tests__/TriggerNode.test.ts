import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TriggerNode } from '../TriggerNode'

describe('TriggerNode', () => {
  let node: TriggerNode

  beforeEach(() => {
    node = new TriggerNode()
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和输出', () => {
      expect(node.title).toBe('trigger')
      expect(node.outputs).toHaveLength(1)
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs?.[0].name).toBe('trigger')
      expect(node.outputs?.[0].type).toBe(-1)
    })

    it('应该有正确的节点尺寸', () => {
      expect(node.size[0]).toBeGreaterThan(0)
      expect(node.size[1]).toBeGreaterThan(0)
    })

    it('应该有正确的颜色配置', () => {
      expect(node.color).toBe('#4a5568')
      expect(node.bgcolor).toBe('#2d3748')
    })

    it('应该有一个 Fire 按钮', () => {
      expect((node as any).widgets).toHaveLength(1)
      expect((node as any).widgets?.[0].name).toBe('Fire')
    })

    it('按钮应该是 button 类型', () => {
      expect((node as any).widgets?.[0].type).toBe('button')
    })
  })

  describe('Fire 按钮', () => {
    it('点击按钮应该触发 triggerSlot', () => {
      const triggerSlotSpy = vi.spyOn(node, 'triggerSlot').mockImplementation(() => {})

      const widget = (node as any).widgets?.[0]
      if (widget?.callback) {
        widget.callback('')
      }

      expect(triggerSlotSpy).toHaveBeenCalledWith(0, null)
      triggerSlotSpy.mockRestore()
    })

    it('应该只触发一次 slot 0', () => {
      const triggerSlotSpy = vi.spyOn(node, 'triggerSlot').mockImplementation(() => {})

      const widget = (node as any).widgets?.[0]
      if (widget?.callback) {
        widget.callback('')
      }

      expect(triggerSlotSpy).toHaveBeenCalledTimes(1)
      expect(triggerSlotSpy).toHaveBeenCalledWith(0, null)
      triggerSlotSpy.mockRestore()
    })
  })

  describe('triggerSlot 行为', () => {
    it('应该能够正确调用父类的 triggerSlot', () => {
      expect(() => {
        node.triggerSlot(0, null)
      }).not.toThrow()
    })

    it('触发不存在的 slot 不应该抛出错误', () => {
      expect(() => {
        node.triggerSlot(999, null)
      }).not.toThrow()
    })
  })

  describe('节点配置', () => {
    it('应该没有输入端口', () => {
      expect(node.inputs).toBeDefined()
      expect(node.inputs?.length).toBe(0)
    })

    it('应该只有一个输出端口', () => {
      expect(node.outputs).toHaveLength(1)
    })

    it('输出应该是动作类型（-1）', () => {
      expect(node.outputs?.[0].type).toBe(-1)
    })
  })

  describe('静态属性', () => {
    it('应该有正确的 title 静态属性', () => {
      expect(TriggerNode.title).toBe('trigger')
    })

    it('应该有正确的 desc 静态属性', () => {
      expect(TriggerNode.desc).toBe('Manual trigger')
    })
  })
})
