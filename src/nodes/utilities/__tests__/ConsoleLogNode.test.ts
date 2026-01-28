import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ConsoleLogNode } from '../ConsoleLogNode'

describe('ConsoleLogNode', () => {
  let node: ConsoleLogNode

  beforeEach(() => {
    node = new ConsoleLogNode()
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和输入输出', () => {
      expect(node.title).toBe('Console')
      expect(node.inputs).toHaveLength(2)
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs?.[0].name).toBe('value')
      expect(node.inputs?.[0].type).toBe(0)
      expect(node.inputs?.[1].name).toBe('trigger')
      expect(node.inputs?.[1].type).toBe(-1)
    })

    it('应该有正确的节点尺寸', () => {
      expect(node.size).toEqual([140, 50])
    })

    it('应该有正确的颜色配置', () => {
      expect(node.color).toBe('#744210')
      expect(node.bgcolor).toBe('#553c00')
    })
  })

  describe('onAction', () => {
    it('应该调用 console.log 并打印输入值', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const testValue = { message: 'test data' }
      vi.spyOn(node, 'getInputData').mockReturnValue(testValue)

      node.onAction('trigger')

      expect(consoleSpy).toHaveBeenCalledWith('[ViemPlay Action]', testValue)
      consoleSpy.mockRestore()
    })

    it('应该正确打印字符串值', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      vi.spyOn(node, 'getInputData').mockReturnValue('hello world')

      node.onAction('trigger')

      expect(consoleSpy).toHaveBeenCalledWith('[ViemPlay Action]', 'hello world')
      consoleSpy.mockRestore()
    })

    it('应该正确打印数字值', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      vi.spyOn(node, 'getInputData').mockReturnValue(42)

      node.onAction('trigger')

      expect(consoleSpy).toHaveBeenCalledWith('[ViemPlay Action]', 42)
      consoleSpy.mockRestore()
    })

    it('应该正确打印 bigint 值', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      vi.spyOn(node, 'getInputData').mockReturnValue(12345678901234567890n)

      node.onAction('trigger')

      expect(consoleSpy).toHaveBeenCalledWith('[ViemPlay Action]', 12345678901234567890n)
      consoleSpy.mockRestore()
    })

    it('应该正确打印对象值', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const testObj = { name: 'test', value: 100 }
      vi.spyOn(node, 'getInputData').mockReturnValue(testObj)

      node.onAction('trigger')

      expect(consoleSpy).toHaveBeenCalledWith('[ViemPlay Action]', testObj)
      consoleSpy.mockRestore()
    })

    it('应该正确打印 null 值', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      vi.spyOn(node, 'getInputData').mockReturnValue(null)

      node.onAction('trigger')

      expect(consoleSpy).toHaveBeenCalledWith('[ViemPlay Action]', null)
      consoleSpy.mockRestore()
    })

    it('应该正确打印 undefined 值', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      vi.spyOn(node, 'getInputData').mockReturnValue(undefined)

      node.onAction('trigger')

      expect(consoleSpy).toHaveBeenCalledWith('[ViemPlay Action]', undefined)
      consoleSpy.mockRestore()
    })

    it('应该正确打印数组值', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const testArray = [1, 2, 3, 'test']
      vi.spyOn(node, 'getInputData').mockReturnValue(testArray)

      node.onAction('trigger')

      expect(consoleSpy).toHaveBeenCalledWith('[ViemPlay Action]', testArray)
      consoleSpy.mockRestore()
    })
  })
})
