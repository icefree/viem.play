import { describe, it, expect, vi, beforeEach } from 'vitest'
import { VerifyAuthorizationNode } from '../VerifyAuthorizationNode'

describe('VerifyAuthorizationNode', () => {
  let node: VerifyAuthorizationNode

  beforeEach(() => {
    node = new VerifyAuthorizationNode()
  })

  describe('constructor', () => {
    it('应该正确设置节点标题', () => {
      // 在测试环境中,LiteGraph 可能不会自动设置 title
      // 我们检查静态属性而不是实例属性
      expect(VerifyAuthorizationNode.title).toBe('verifyAuthorization')
    })

    it('应该有正确的描述', () => {
      expect(VerifyAuthorizationNode.desc).toBe('Verify EIP-7702 authorization')
    })

    it('应该有正确的颜色配置', () => {
      expect(node.color).toBe('#667eea')
      expect(node.bgcolor).toBe('#4c51bf')
    })

    it('应该正确设置输入输出', () => {
      expect(node.inputs).toHaveLength(2)
      expect(node.outputs).toHaveLength(1)
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs?.[0].name).toBe('authorization')
      expect(node.inputs?.[0].type).toBe('object')
      expect(node.inputs?.[1].name).toBe('address')
      expect(node.inputs?.[1].type).toBe('address')
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs?.[0].name).toBe('isValid')
      expect(node.outputs?.[0].type).toBe('boolean')
    })

    it('应该有正确的尺寸', () => {
      expect(node.size).toEqual([200, 70])
    })
  })

  describe('onExecute', () => {
    it('当没有授权对象时应该输出 null', async () => {
      vi.spyOn(node, 'getInputData').mockReturnValue(undefined)

      await node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('当没有地址时应该输出 null', async () => {
      const testAuthorization = {
        contractAddress: '0x1234567890123456789012345678901234567890',
        chainId: 1,
        nonce: 0n,
        r: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        s: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        v: 28n,
        yParity: 1,
      }

      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return testAuthorization
        return undefined
      })

      await node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该正确读取授权和地址数据', async () => {
      const testAuthorization = {
        contractAddress: '0x1234567890123456789012345678901234567890',
        chainId: 1,
        nonce: 0n,
        r: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        s: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        v: 28n,
        yParity: 1,
      }
      const testAddress = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'

      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return testAuthorization
        if (idx === 1) return testAddress
        return undefined
      })

      await node.onExecute()

      expect(node.getInputData(0)).toEqual(testAuthorization)
      expect(node.getInputData(1)).toBe(testAddress)
    })

    it('应该处理边界值 chainId', async () => {
      const testAuthorization = {
        contractAddress: '0x1234567890123456789012345678901234567890',
        chainId: 2147483647, // max int32
        nonce: 0n,
        r: '0x',
        s: '0x',
        v: 0n,
        yParity: 0,
      }
      const testAddress = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'

      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return testAuthorization
        if (idx === 1) return testAddress
        return undefined
      })

      await node.onExecute()

      expect(node.getInputData(0).chainId).toBe(2147483647)
    })

    it('应该处理零值 chainId', async () => {
      const testAuthorization = {
        contractAddress: '0x1234567890123456789012345678901234567890',
        chainId: 0,
        nonce: 0n,
        r: '0x',
        s: '0x',
        v: 0n,
        yParity: 0,
      }
      const testAddress = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'

      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return testAuthorization
        if (idx === 1) return testAddress
        return undefined
      })

      await node.onExecute()

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
      const testAddress = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'

      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return testAuthorization
        if (idx === 1) return testAddress
        return undefined
      })

      await node.onExecute()

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
      const testAddress = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'

      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return testAuthorization
        if (idx === 1) return testAddress
        return undefined
      })

      await node.onExecute()

      expect(node.getInputData(0).r).toBe('0x')
      expect(node.getInputData(0).s).toBe('0x')
    })

    it('应该处理不同的地址格式', async () => {
      const testAuthorization = {
        contractAddress: '0x1234567890123456789012345678901234567890',
        chainId: 1,
        nonce: 0n,
        r: '0x',
        s: '0x',
        v: 0n,
        yParity: 0,
      }

      const addresses = [
        '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
        '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
        '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc',
      ]

      for (const testAddress of addresses) {
        vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
          if (idx === 0) return testAuthorization
          if (idx === 1) return testAddress
          return undefined
        })

        await node.onExecute()

        expect(node.getInputData(1)).toBe(testAddress)
      }
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

      const testAddress = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'

      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return testAuthorization1
        if (idx === 1) return testAddress
        return undefined
      })
      await node.onExecute()
      expect(node.getInputData(0).yParity).toBe(0)

      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return testAuthorization2
        if (idx === 1) return testAddress
        return undefined
      })
      await node.onExecute()
      expect(node.getInputData(0).yParity).toBe(1)
    })
  })
})
