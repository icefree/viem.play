import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GenerateMnemonicNode } from '../GenerateMnemonicNode'

describe('GenerateMnemonicNode', () => {
  let node: GenerateMnemonicNode

  beforeEach(() => {
    node = new GenerateMnemonicNode()
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和输出', () => {
      expect(node.title).toBe('generateMnemonic')
      expect(node.outputs).toHaveLength(1)
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs?.[0].name).toBe('mnemonic')
      expect(node.outputs?.[0].type).toBe('string')
    })

    it('应该有一个 Generate 按钮', () => {
      expect(node.widgets).toHaveLength(1)
      expect(node.widgets?.[0].name).toBe('Generate')
    })

    it('应该有 value 属性', () => {
      expect(node.properties.value).toBeDefined()
    })
  })

  describe('onExecute', () => {
    it('应该输出助记词', () => {
      const testMnemonic = 'word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12'
      node.properties.value = testMnemonic

      node.onExecute()

      expect(node.getOutputData(0)).toBe(testMnemonic)
    })

    it('当没有值时应该输出 null', () => {
      node.properties.value = ''

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })
  })

  describe('Generate 按钮', () => {
    it('点击应该生成新的助记词', () => {
      // 触发按钮点击
      const widget = node.widgets?.[0]
      if (widget?.value) {
        widget.value = ''
      }
      if (widget?.callback) {
        widget.callback('')
      }

      expect(node.properties.value).toBeTruthy()
      // BIP39 助记词通常是 12 或 24 个单词
      const words = node.properties.value.split(' ')
      expect([12, 15, 18, 21, 24]).toContain(words.length)
    })
  })
})
