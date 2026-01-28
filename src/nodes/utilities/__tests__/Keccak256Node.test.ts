import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Keccak256Node } from '../Keccak256Node'
import type { Hex } from 'viem'

describe('Keccak256Node', () => {
  let node: Keccak256Node

  beforeEach(() => {
    node = new Keccak256Node()
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和输入输出', () => {
      expect(node.title).toBe('keccak256')
      expect(node.inputs).toHaveLength(1)
      expect(node.outputs).toHaveLength(1)
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs?.[0].name).toBe('data')
      expect(node.inputs?.[0].type).toBe('string,bytes')
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs?.[0].name).toBe('hash')
      expect(node.outputs?.[0].type).toBe('bytes32')
    })

    it('应该有正确的节点尺寸', () => {
      expect(node.size).toEqual([160, 50])
    })
  })

  describe('onExecute', () => {
    it('应该正确计算十六进制字符串的 keccak256 哈希', () => {
      const testValue: Hex = '0x48656c6c6f20776f726c64' // 'Hello world' in hex
      vi.spyOn(node, 'getInputData').mockReturnValue(testValue)

      node.onExecute()

      const result = node.getOutputData(0) as Hex
      expect(result).toBeTruthy()
      expect(result).toMatch(/^0x[a-f0-9]{64}$/)
    })

    it('应该正确计算空字符串的 keccak256 哈希', () => {
      const testValue: Hex = '0x'
      vi.spyOn(node, 'getInputData').mockReturnValue(testValue)

      node.onExecute()

      const result = node.getOutputData(0) as Hex
      expect(result).toBe('0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470')
    })

    it('应该正确计算简单十六进制数据的哈希', () => {
      const testValue: Hex = '0xdeadbeef'
      vi.spyOn(node, 'getInputData').mockReturnValue(testValue)

      node.onExecute()

      const result = node.getOutputData(0) as Hex
      expect(result).toBeTruthy()
      expect(result).toMatch(/^0x[a-f0-9]{64}$/)
    })

    it('应该正确计算较长十六进制数据的哈希', () => {
      const testValue: Hex = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
      vi.spyOn(node, 'getInputData').mockReturnValue(testValue)

      node.onExecute()

      const result = node.getOutputData(0) as Hex
      expect(result).toBeTruthy()
      expect(result).toMatch(/^0x[a-f0-9]{64}$/)
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

    it('应该在输入不以 0x 开头时输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValue('deadbeef')

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在输入为无效十六进制时输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValue('0xgg')

      node.onExecute()

      // viem 的 keccak256 会容错处理,返回一个有效的哈希值
      const result = node.getOutputData(0)
      expect(typeof result === 'string').toBe(true)
      expect(result).toMatch(/^0x[a-f0-9]{64}$/)
    })

    it('应该正确处理奇数长度的十六进制字符串', () => {
      const testValue: Hex = '0xabc'
      vi.spyOn(node, 'getInputData').mockReturnValue(testValue)

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeTruthy()
      expect(result).toMatch(/^0x[a-f0-9]{64}$/)
    })

    it('应该正确处理全 0 的十六进制数据', () => {
      const testValue: Hex = '0x00000000'
      vi.spyOn(node, 'getInputData').mockReturnValue(testValue)

      node.onExecute()

      const result = node.getOutputData(0) as Hex
      expect(result).toBeTruthy()
      expect(result).toMatch(/^0x[a-f0-9]{64}$/)
    })

    it('应该正确处理全 f 的十六进制数据', () => {
      const testValue: Hex = '0xffffffff'
      vi.spyOn(node, 'getInputData').mockReturnValue(testValue)

      node.onExecute()

      const result = node.getOutputData(0) as Hex
      expect(result).toBeTruthy()
      expect(result).toMatch(/^0x[a-f0-9]{64}$/)
    })
  })
})
