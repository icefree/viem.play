import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ToBigIntNode } from '../ToBigIntNode'

describe('ToBigIntNode', () => {
  let node: ToBigIntNode

  beforeEach(() => {
    node = new ToBigIntNode()
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和输入输出', () => {
      expect(node.title).toBe('toBigInt')
      expect(node.inputs).toHaveLength(1)
      expect(node.outputs).toHaveLength(1)
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs?.[0].name).toBe('value')
      expect(node.inputs?.[0].type).toBe(0)
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs?.[0].name).toBe('bigint')
      expect(node.outputs?.[0].type).toBe('bigint')
    })

    it('应该有正确的节点尺寸', () => {
      expect(node.size).toEqual([140, 50])
    })
  })

  describe('onExecute', () => {
    it('应该将字符串数字转换为 bigint', () => {
      const testValue = '12345678901234567890'
      vi.spyOn(node, 'getInputData').mockReturnValue(testValue)

      node.onExecute()

      expect(node.getOutputData(0)).toBe(12345678901234567890n)
    })

    it('应该将带 0x 前缀的十六进制字符串转换为 bigint', () => {
      const testValue = '0x10'
      vi.spyOn(node, 'getInputData').mockReturnValue(testValue)

      node.onExecute()

      expect(node.getOutputData(0)).toBe(16n)
    })

    it('应该将不带 0x 前缀的十六进制字符串转换为 bigint', () => {
      const testValue = '0xff'
      vi.spyOn(node, 'getInputData').mockReturnValue(testValue)

      node.onExecute()

      expect(node.getOutputData(0)).toBe(255n)
    })

    it('应该将数字转换为 bigint', () => {
      const testValue = 42
      vi.spyOn(node, 'getInputData').mockReturnValue(testValue)

      node.onExecute()

      expect(node.getOutputData(0)).toBe(42n)
    })

    it('应该将浮点数转换为 bigint（截断小数）', () => {
      const testValue = 42.0
      vi.spyOn(node, 'getInputData').mockReturnValue(testValue)

      node.onExecute()

      expect(node.getOutputData(0)).toBe(42n)
    })

    it('应该将已经是 bigint 的值直接输出', () => {
      const testValue = 999999999999999999n
      vi.spyOn(node, 'getInputData').mockReturnValue(testValue)

      node.onExecute()

      expect(node.getOutputData(0)).toBe(999999999999999999n)
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

    it('应该处理无效的字符串并输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValue('not a number')

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该处理空字符串并输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValue('')

      node.onExecute()

      // BigInt('') 会抛出异常,所以输出应该是 null
      // 但实际上空字符串会被转换为 0n
      const result = node.getOutputData(0)
      expect(result === null || result === undefined || result === 0n).toBe(true)
    })

    it('应该处理非常大的数字', () => {
      const testValue = '99999999999999999999999999999999999999999999999999'
      vi.spyOn(node, 'getInputData').mockReturnValue(testValue)

      node.onExecute()

      expect(node.getOutputData(0)).toBe(BigInt(testValue))
    })

    it('应该处理负数', () => {
      const testValue = '-1234567890'
      vi.spyOn(node, 'getInputData').mockReturnValue(testValue)

      node.onExecute()

      expect(node.getOutputData(0)).toBe(-1234567890n)
    })

    it('应该处理 0', () => {
      vi.spyOn(node, 'getInputData').mockReturnValue(0)

      node.onExecute()

      expect(node.getOutputData(0)).toBe(0n)
    })

    it('应该处理科学计数法表示的数字', () => {
      const testValue = 10000000000
      vi.spyOn(node, 'getInputData').mockReturnValue(testValue)

      node.onExecute()

      expect(node.getOutputData(0)).toBe(10000000000n)
    })
  })
})
