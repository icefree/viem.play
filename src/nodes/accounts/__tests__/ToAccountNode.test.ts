import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ToAccountNode } from '../ToAccountNode'

describe('ToAccountNode', () => {
  let node: ToAccountNode

  beforeEach(() => {
    node = new ToAccountNode()
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和输入输出', () => {
      expect(node.title).toBe('toAccount')
      expect(node.inputs).toHaveLength(1)
      expect(node.outputs).toHaveLength(1)
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs?.[0].name).toBe('address')
      expect(node.inputs?.[0].type).toBe('address')
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs?.[0].name).toBe('account')
      expect(node.outputs?.[0].type).toBe('account')
    })
  })

  describe('onExecute', () => {
    it('应该从地址创建账户', () => {
      const testAddress = '0x1234567890123456789012345678901234567890'
      vi.spyOn(node, 'getInputData').mockReturnValue(testAddress)

      node.onExecute()

      const account = node.getOutputData(0)

      expect(account).toBeTruthy()
      expect(account).toHaveProperty('address')
      expect(account.address).toBe(testAddress)
    })

    it('当没有地址时应该输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValue(undefined)

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该处理无效的地址', () => {
      vi.spyOn(node, 'getInputData').mockReturnValue('invalid-address')

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该处理空字符串', () => {
      vi.spyOn(node, 'getInputData').mockReturnValue('')

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该创建 JSON-RPC 账户对象', () => {
      const testAddress = '0x1234567890123456789012345678901234567890'
      vi.spyOn(node, 'getInputData').mockReturnValue(testAddress)

      node.onExecute()

      const account = node.getOutputData(0)

      expect(account).toHaveProperty('address')
      expect(account).toHaveProperty('signMessage')
      expect(account).toHaveProperty('signTransaction')
      expect(account).toHaveProperty('signTypedData')
    })
  })
})
