import { describe, it, expect, vi, beforeEach } from 'vitest'
import { VerifySiweMessageNode } from '../VerifySiweMessageNode'

describe('VerifySiweMessageNode', () => {
  let node: VerifySiweMessageNode

  beforeEach(() => {
    node = new VerifySiweMessageNode()
  })

  describe('constructor', () => {
    it('应该有正确的静态标题和描述', () => {
      expect(VerifySiweMessageNode.title).toBe('verifySiweMessage')
      expect(VerifySiweMessageNode.desc).toBe('Verify Sign-In with Ethereum message')
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs).toHaveLength(2)
      expect(node.inputs?.[0].name).toBe('message')
      expect(node.inputs?.[0].type).toBe('string')
      expect(node.inputs?.[1].name).toBe('signature')
      expect(node.inputs?.[1].type).toBe('string')
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs).toHaveLength(2)
      expect(node.outputs?.[0].name).toBe('isValid')
      expect(node.outputs?.[0].type).toBe('boolean')
      expect(node.outputs?.[1].name).toBe('address')
      expect(node.outputs?.[1].type).toBe('address')
    })

    it('应该有正确的节点尺寸', () => {
      expect(node.size).toEqual([200, 90])
    })

    it('应该有正确的颜色配置', () => {
      expect(node.color).toBe('#ed8936')
      expect(node.bgcolor).toBe('#9c4221')
    })
  })

  describe('onExecute', () => {
    it('应该在所有输入都存在时验证消息', async () => {
      const message = 'example.com wants you to sign in with your Ethereum account:'
      const signature = '0xabcdef1234567890'

      vi.spyOn(node, 'getInputData').mockImplementation((index) => {
        const inputs = [message, signature]
        return inputs[index]
      })

      await node.onExecute()

      // 由于节点未实现,目前输出 null
      expect(node.getOutputData(0)).toBeNull()
      expect(node.getOutputData(1)).toBeNull()
    })

    it('应该在缺少 message 时输出 null', async () => {
      vi.spyOn(node, 'getInputData').mockReturnValue(undefined)

      await node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
      expect(node.getOutputData(1)).toBeNull()
    })

    it('应该在缺少 signature 时输出 null', async () => {
      const message = 'example.com wants you to sign in with your Ethereum account:'

      vi.spyOn(node, 'getInputData').mockImplementation((index) => {
        if (index === 0) return message
        return undefined
      })

      await node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
      expect(node.getOutputData(1)).toBeNull()
    })

    it('应该处理空字符串消息', async () => {
      const message = ''
      const signature = '0xabcdef1234567890'

      vi.spyOn(node, 'getInputData').mockImplementation((index) => {
        const inputs = [message, signature]
        return inputs[index]
      })

      await node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
      expect(node.getOutputData(1)).toBeNull()
    })

    it('应该处理空字符串签名', async () => {
      const message = 'example.com wants you to sign in with your Ethereum account:'
      const signature = ''

      vi.spyOn(node, 'getInputData').mockImplementation((index) => {
        const inputs = [message, signature]
        return inputs[index]
      })

      await node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
      expect(node.getOutputData(1)).toBeNull()
    })

    it('应该处理无效的签名格式', async () => {
      const message = 'example.com wants you to sign in with your Ethereum account:'
      const invalidSignatures = [
        'not-a-signature',
        '0x',
        '0xggg',
        '12345',
      ]

      for (const signature of invalidSignatures) {
        node = new VerifySiweMessageNode()

        vi.spyOn(node, 'getInputData').mockImplementation((index) => {
          const inputs = [message, signature]
          return inputs[index]
        })

        await node.onExecute()

        expect(node.getOutputData(0)).toBeNull()
        expect(node.getOutputData(1)).toBeNull()
      }
    })

    it('应该处理有效的签名格式', async () => {
      const message = 'example.com wants you to sign in with your Ethereum account:'
      // 标准的以太坊签名长度是 130 (0x + 64 字节十六进制)
      const validSignature = '0x' + 'a'.repeat(130)

      vi.spyOn(node, 'getInputData').mockImplementation((index) => {
        const inputs = [message, validSignature]
        return inputs[index]
      })

      await node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
      expect(node.getOutputData(1)).toBeNull()
    })

    it('应该处理包含特殊字符的 SIWE 消息', async () => {
      const messages = [
        'example.com wants you to sign in with your Ethereum account:\n0x1234...5678\n\nURI: https://example.com\nVersion: 1\nChain ID: 1\nNonce: abc123\nIssued At: 2024-01-01T00:00:00.000Z',
        '服务.example.com wants you to sign in with your Ethereum account:\n中文测试\n\nURI: https://例子.com\nVersion: 1',
      ]

      for (const message of messages) {
        node = new VerifySiweMessageNode()
        const signature = '0x' + 'a'.repeat(130)

        vi.spyOn(node, 'getInputData').mockImplementation((index) => {
          const inputs = [message, signature]
          return inputs[index]
        })

        await node.onExecute()

        expect(node.getOutputData(0)).toBeNull()
        expect(node.getOutputData(1)).toBeNull()
      }
    })
  })

  describe('边界情况', () => {
    it('应该处理 null 输入', async () => {
      vi.spyOn(node, 'getInputData').mockReturnValue(null)

      await node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
      expect(node.getOutputData(1)).toBeNull()
    })

    it('应该处理混合有效和无效输入', async () => {
      const message = 'example.com wants you to sign in with your Ethereum account:'
      const signature = null

      vi.spyOn(node, 'getInputData').mockImplementation((index) => {
        const inputs = [message, signature]
        return inputs[index]
      })

      await node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
      expect(node.getOutputData(1)).toBeNull()
    })

    it('应该处理超大字符串输入', async () => {
      const message = 'a'.repeat(10000)
      const signature = '0x' + 'a'.repeat(2000)

      vi.spyOn(node, 'getInputData').mockImplementation((index) => {
        const inputs = [message, signature]
        return inputs[index]
      })

      await node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
      expect(node.getOutputData(1)).toBeNull()
    })

    it('应该处理只包含空格和换行符的输入', async () => {
      const message = '   \n\n   \n   '
      const signature = '   \n   '

      vi.spyOn(node, 'getInputData').mockImplementation((index) => {
        const inputs = [message, signature]
        return inputs[index]
      })

      await node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
      expect(node.getOutputData(1)).toBeNull()
    })

    it('应该处理超短签名', async () => {
      const message = 'example.com wants you to sign in with your Ethereum account:'
      const shortSignatures = ['0x1', '0x12', '0x123', '0x1234']

      for (const signature of shortSignatures) {
        node = new VerifySiweMessageNode()

        vi.spyOn(node, 'getInputData').mockImplementation((index) => {
          const inputs = [message, signature]
          return inputs[index]
        })

        await node.onExecute()

        expect(node.getOutputData(0)).toBeNull()
        expect(node.getOutputData(1)).toBeNull()
      }
    })

    it('应该处理超长签名', async () => {
      const message = 'example.com wants you to sign in with your Ethereum account:'
      const longSignature = '0x' + 'a'.repeat(1000)

      vi.spyOn(node, 'getInputData').mockImplementation((index) => {
        const inputs = [message, longSignature]
        return inputs[index]
      })

      await node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
      expect(node.getOutputData(1)).toBeNull()
    })
  })

  describe('输出验证', () => {
    it('应该始终输出两个结果', async () => {
      const message = 'test message'
      const signature = '0x' + 'a'.repeat(130)

      vi.spyOn(node, 'getInputData').mockImplementation((index) => {
        const inputs = [message, signature]
        return inputs[index]
      })

      await node.onExecute()

      // 验证有两个输出槽位
      expect(node.outputs).toHaveLength(2)

      // 验证两个输出都有值(即使是 null)
      const output0 = node.getOutputData(0)
      const output1 = node.getOutputData(1)

      expect(output0 !== undefined).toBe(true)
      expect(output1 !== undefined).toBe(true)
    })

    it('应该确保 isValid 输出是布尔类型或 null', async () => {
      const message = 'test message'
      const signature = '0x' + 'a'.repeat(130)

      vi.spyOn(node, 'getInputData').mockImplementation((index) => {
        const inputs = [message, signature]
        return inputs[index]
      })

      await node.onExecute()

      const isValid = node.getOutputData(0)
      expect(isValid === null || typeof isValid === 'boolean').toBe(true)
    })

    it('应该确保 address 输出是字符串或 null', async () => {
      const message = 'test message'
      const signature = '0x' + 'a'.repeat(130)

      vi.spyOn(node, 'getInputData').mockImplementation((index) => {
        const inputs = [message, signature]
        return inputs[index]
      })

      await node.onExecute()

      const address = node.getOutputData(1)
      expect(address === null || typeof address === 'string').toBe(true)
    })
  })
})
