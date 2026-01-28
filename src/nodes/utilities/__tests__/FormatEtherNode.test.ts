import { describe, it, expect, vi, beforeEach } from 'vitest'
import { FormatEtherNode } from '../FormatEtherNode'

describe('FormatEtherNode', () => {
  let node: FormatEtherNode

  beforeEach(() => {
    node = new FormatEtherNode()
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和输入输出', () => {
      expect(node.title).toBe('formatEther')
      expect(node.inputs).toHaveLength(1)
      expect(node.outputs).toHaveLength(1)
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs?.[0].name).toBe('wei')
      expect(node.inputs?.[0].type).toBe('bigint')
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs?.[0].name).toBe('ether')
      expect(node.outputs?.[0].type).toBe('string')
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
    it('应该正确将 wei 转换为 ether 字符串', () => {
      const testValue = 1000000000000000000n // 1 ETH in wei
      vi.spyOn(node, 'getInputData').mockReturnValue(testValue)

      node.onExecute()

      expect(node.getOutputData(0)).toBe('1')
    })

    it('应该正确处理小数值', () => {
      const testValue = 500000000000000000n // 0.5 ETH in wei
      vi.spyOn(node, 'getInputData').mockReturnValue(testValue)

      node.onExecute()

      expect(node.getOutputData(0)).toBe('0.5')
    })

    it('应该正确处理大数值', () => {
      const testValue = 2000000000000000000n // 2 ETH in wei
      vi.spyOn(node, 'getInputData').mockReturnValue(testValue)

      node.onExecute()

      expect(node.getOutputData(0)).toBe('2')
    })

    it('应该正确处理非常小的数值', () => {
      const testValue = 1n // 1 wei
      vi.spyOn(node, 'getInputData').mockReturnValue(testValue)

      node.onExecute()

      expect(node.getOutputData(0)).toBe('0.000000000000000001')
    })

    it('应该正确处理非常大的数值', () => {
      const testValue = 10000000000000000000000n // 10000 ETH
      vi.spyOn(node, 'getInputData').mockReturnValue(testValue)

      node.onExecute()

      expect(node.getOutputData(0)).toBe('10000')
    })

    it('应该正确处理 0', () => {
      vi.spyOn(node, 'getInputData').mockReturnValue(0n)

      node.onExecute()

      expect(node.getOutputData(0)).toBe('0')
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

    it('应该正确处理带有多位小数的数值', () => {
      const testValue = 1234567890123456789n
      vi.spyOn(node, 'getInputData').mockReturnValue(testValue)

      node.onExecute()

      expect(node.getOutputData(0)).toBe('1.234567890123456789')
    })

    it('应该正确处理 Gwei 相关的数值', () => {
      const testValue = 1000000000n // 1 Gwei
      vi.spyOn(node, 'getInputData').mockReturnValue(testValue)

      node.onExecute()

      expect(node.getOutputData(0)).toBe('0.000000001')
    })

    it('应该正确处理浮点数表示', () => {
      const testValue = 1500000000000000000n // 1.5 ETH
      vi.spyOn(node, 'getInputData').mockReturnValue(testValue)

      node.onExecute()

      expect(node.getOutputData(0)).toBe('1.5')
    })
  })
})
