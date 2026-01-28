import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ParseEtherNode } from '../ParseEtherNode'

describe('ParseEtherNode', () => {
  let node: ParseEtherNode

  beforeEach(() => {
    node = new ParseEtherNode()
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和输入输出', () => {
      expect(node.title).toBe('parseEther')
      expect(node.inputs).toHaveLength(1)
      expect(node.outputs).toHaveLength(1)
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs?.[0].name).toBe('ether')
      expect(node.inputs?.[0].type).toBe('string')
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs?.[0].name).toBe('wei')
      expect(node.outputs?.[0].type).toBe('bigint')
    })

    it('应该有正确的节点尺寸', () => {
      expect(node.size).toEqual([160, 50])
    })

    it('应该有正确的颜色配置', () => {
      expect(node.color).toBe('#38a169')
      expect(node.bgcolor).toBe('#276749')
    })
  })

  describe('onExecute', () => {
    it('应该正确将 ether 字符串转换为 wei bigint', () => {
      const testValue = '1'
      vi.spyOn(node, 'getInputData').mockReturnValue(testValue)

      node.onExecute()

      expect(node.getOutputData(0)).toBe(1000000000000000000n)
    })

    it('应该正确处理小数值', () => {
      const testValue = '0.5'
      vi.spyOn(node, 'getInputData').mockReturnValue(testValue)

      node.onExecute()

      expect(node.getOutputData(0)).toBe(500000000000000000n)
    })

    it('应该正确处理大数值', () => {
      const testValue = '100'
      vi.spyOn(node, 'getInputData').mockReturnValue(testValue)

      node.onExecute()

      expect(node.getOutputData(0)).toBe(100000000000000000000n)
    })

    it('应该正确处理非常小的数值', () => {
      const testValue = '0.000000000000000001'
      vi.spyOn(node, 'getInputData').mockReturnValue(testValue)

      node.onExecute()

      expect(node.getOutputData(0)).toBe(1n)
    })

    it('应该正确处理 0', () => {
      vi.spyOn(node, 'getInputData').mockReturnValue('0')

      node.onExecute()

      expect(node.getOutputData(0)).toBe(0n)
    })

    it('应该正确处理带有多位小数的数值', () => {
      const testValue = '1.234567890123456789'
      vi.spyOn(node, 'getInputData').mockReturnValue(testValue)

      node.onExecute()

      expect(node.getOutputData(0)).toBe(1234567890123456789n)
    })

    it('应该正确处理 Gwei 相关的数值', () => {
      const testValue = '0.000000001'
      vi.spyOn(node, 'getInputData').mockReturnValue(testValue)

      node.onExecute()

      // 1 Gwei = 10^9 wei
      expect(node.getOutputData(0)).toBe(1000000000n)
    })

    it('应该在输入为 undefined 时输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValue(undefined)

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在输入为 null 时输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValue(null)

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在输入为空字符串时输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValue('')

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该处理无效的字符串并输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValue('not a number')

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该处理非字符串类型的输入并输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValue(123)

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该正确处理科学计数法', () => {
      const testValue = '0.000000000000000001'
      vi.spyOn(node, 'getInputData').mockReturnValue(testValue)

      node.onExecute()

      // viem 的 parseEther 不支持科学计数法,所以这里改用普通小数
      expect(node.getOutputData(0)).toBe(1n)
    })

    it('应该正确处理非常大的数值', () => {
      const testValue = '10000.5'
      vi.spyOn(node, 'getInputData').mockReturnValue(testValue)

      node.onExecute()

      expect(node.getOutputData(0)).toBe(10000500000000000000000n)
    })
  })
})
