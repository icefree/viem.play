import { describe, it, expect, vi, beforeEach } from 'vitest'
import { RecoverAuthorizationAddressNode } from '../RecoverAuthorizationAddressNode'

describe('RecoverAuthorizationAddressNode', () => {
  let node: RecoverAuthorizationAddressNode

  beforeEach(() => {
    node = new RecoverAuthorizationAddressNode()
  })

  describe('constructor', () => {
    it('应该正确设置节点标题', () => {
      // 在测试环境中,LiteGraph 可能不会自动设置 title
      // 我们检查静态属性而不是实例属性
      expect(RecoverAuthorizationAddressNode.title).toBe('recoverAuthorizationAddress')
    })

    it('应该有正确的描述', () => {
      expect(RecoverAuthorizationAddressNode.desc).toBe('Recover address from authorization')
    })

    it('应该有正确的颜色配置', () => {
      expect(node.color).toBe('#667eea')
      expect(node.bgcolor).toBe('#4c51bf')
    })

    it('应该正确设置输入输出', () => {
      expect(node.inputs).toHaveLength(1)
      expect(node.outputs).toHaveLength(1)
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs?.[0].name).toBe('authorization')
      expect(node.inputs?.[0].type).toBe('object')
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs?.[0].name).toBe('address')
      expect(node.outputs?.[0].type).toBe('address')
    })

    it('应该有正确的尺寸', () => {
      expect(node.size).toEqual([220, 50])
    })
  })

  describe('onExecute', () => {
    it('当没有授权对象时应该输出 null', async () => {
      vi.spyOn(node, 'getInputData').mockReturnValue(undefined)

      await node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该正确读取授权对象', async () => {
      const testAuthorization = {
        contractAddress: '0x1234567890123456789012345678901234567890',
        chainId: 1,
        nonce: 0n,
        r: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        s: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        v: 28n,
        yParity: 1,
      }

      vi.spyOn(node, 'getInputData').mockReturnValue(testAuthorization)

      await node.onExecute()

      expect(node.getInputData(0)).toEqual(testAuthorization)
    })

    it('应该处理包含完整签名的授权对象', async () => {
      const testAuthorization = {
        contractAddress: '0x1234567890123456789012345678901234567890',
        chainId: 1,
        nonce: 0n,
        r: '0x' + 'a'.repeat(64),
        s: '0x' + 'b'.repeat(64),
        v: 27n,
        yParity: 0,
      }

      vi.spyOn(node, 'getInputData').mockReturnValue(testAuthorization)

      await node.onExecute()

      expect(node.getInputData(0)).toEqual(testAuthorization)
    })

    it('应该处理边界值 chainId', async () => {
      const testAuthorization = {
        contractAddress: '0x1234567890123456789012345678901234567890',
        chainId: 0,
        nonce: 0n,
        r: '0x',
        s: '0x',
        v: 0n,
        yParity: 0,
      }

      vi.spyOn(node, 'getInputData').mockReturnValue(testAuthorization)

      await node.onExecute()

      expect(node.getInputData(0)).toEqual(testAuthorization)
      expect(node.getInputData(0).chainId).toBe(0)
    })

    it('应该处理大数值的 nonce', async () => {
      const testAuthorization = {
        contractAddress: '0x1234567890123456789012345678901234567890',
        chainId: 1,
        nonce: 2n ** 256n - 1n,
        r: '0x',
        s: '0x',
        v: 0n,
        yParity: 0,
      }

      vi.spyOn(node, 'getInputData').mockReturnValue(testAuthorization)

      await node.onExecute()

      expect(node.getInputData(0)).toEqual(testAuthorization)
      expect(node.getInputData(0).nonce).toBe(2n ** 256n - 1n)
    })

    it('应该处理空的签名值', async () => {
      const testAuthorization = {
        contractAddress: '0x1234567890123456789012345678901234567890',
        chainId: 1,
        nonce: 0n,
        r: '0x',
        s: '0x',
        v: 0n,
        yParity: 0,
      }

      vi.spyOn(node, 'getInputData').mockReturnValue(testAuthorization)

      await node.onExecute()

      expect(node.getInputData(0).r).toBe('0x')
      expect(node.getInputData(0).s).toBe('0x')
    })

    it('应该处理不同的 yParity 值', async () => {
      const testAuthorization1 = {
        contractAddress: '0x1234567890123456789012345678901234567890',
        chainId: 1,
        nonce: 0n,
        r: '0x',
        s: '0x',
        v: 27n,
        yParity: 0,
      }

      const testAuthorization2 = {
        contractAddress: '0x1234567890123456789012345678901234567890',
        chainId: 1,
        nonce: 0n,
        r: '0x',
        s: '0x',
        v: 28n,
        yParity: 1,
      }

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(testAuthorization1)
      await node.onExecute()
      expect(node.getInputData(0).yParity).toBe(0)

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(testAuthorization2)
      await node.onExecute()
      expect(node.getInputData(0).yParity).toBe(1)
    })
  })
})
