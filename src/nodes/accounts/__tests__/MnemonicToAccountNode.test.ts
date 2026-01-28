import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MnemonicToAccountNode } from '../MnemonicToAccountNode'

describe('MnemonicToAccountNode', () => {
  let node: MnemonicToAccountNode

  beforeEach(() => {
    node = new MnemonicToAccountNode()
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和输入输出', () => {
      expect(node.title).toBe('mnemonicToAccount')
      expect(node.inputs).toHaveLength(2)
      expect(node.outputs).toHaveLength(2)
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs?.[0].name).toBe('mnemonic')
      expect(node.inputs?.[1].name).toBe('index')
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs?.[0].name).toBe('account')
      expect(node.outputs?.[1].name).toBe('address')
      expect(node.outputs?.[1].type).toBe('address')
    })
  })

  describe('onExecute', () => {
    const testMnemonic =
      'test test test test test test test test test test test junk'

    it('应该从助记词创建账户', () => {
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return testMnemonic
        if (idx === 1) return 0
        return undefined
      })

      node.onExecute()

      const account = node.getOutputData(0)
      const address = node.getOutputData(1)

      expect(account).toBeTruthy()
      expect(address).toBeTruthy()
      expect(address).toMatch(/^0x[a-f0-9]{40}$/)
    })

    it('当没有助记词时应该输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValue(undefined)

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
      expect(node.getOutputData(1)).toBeNull()
    })

    it('应该使用默认 index 为 0', () => {
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return testMnemonic
        if (idx === 1) return undefined
        return undefined
      })

      node.onExecute()

      const account = node.getOutputData(0)
      expect(account).toBeTruthy()
    })

    it('应该支持不同的索引', () => {
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return testMnemonic
        if (idx === 1) return 1
        return undefined
      })

      node.onExecute()

      const account1 = node.getOutputData(0)
      expect(account1).toBeTruthy()

      // 索引 0 应该生成不同的地址
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return testMnemonic
        if (idx === 1) return 0
        return undefined
      })

      node.onExecute()
      const account2 = node.getOutputData(0)

      expect(account1.address).not.toBe(account2.address)
    })

    it('应该同时输出账户和地址', () => {
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return testMnemonic
        if (idx === 1) return 0
        return undefined
      })

      node.onExecute()

      const account = node.getOutputData(0)
      const address = node.getOutputData(1)

      expect(account).toHaveProperty('address')
      expect(account.address).toBe(address)
    })
  })
})
