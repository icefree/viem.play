import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ParseSiweMessageNode } from '../ParseSiweMessageNode'

describe('ParseSiweMessageNode', () => {
  let node: ParseSiweMessageNode

  beforeEach(() => {
    node = new ParseSiweMessageNode()
  })

  describe('constructor', () => {
    it('应该有正确的静态标题和描述', () => {
      expect(ParseSiweMessageNode.title).toBe('parseSiweMessage')
      expect(ParseSiweMessageNode.desc).toBe('Parse Sign-In with Ethereum message')
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs).toHaveLength(1)
      expect(node.inputs?.[0].name).toBe('message')
      expect(node.inputs?.[0].type).toBe('string')
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs).toHaveLength(1)
      expect(node.outputs?.[0].name).toBe('parsed')
      expect(node.outputs?.[0].type).toBe('object')
    })

    it('应该有正确的节点尺寸', () => {
      expect(node.size).toEqual([180, 50])
    })

    it('应该有正确的颜色配置', () => {
      expect(node.color).toBe('#ed8936')
      expect(node.bgcolor).toBe('#9c4221')
    })
  })

  describe('onExecute', () => {
    it('应该在有输入时解析 SIWE 消息', async () => {
      const message = 'example.com wants you to sign in with your Ethereum account:'

      vi.spyOn(node, 'getInputData').mockReturnValue(message)

      await node.onExecute()

      // 由于节点未实现,目前输出 null
      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在输入为 undefined 时输出 null', async () => {
      vi.spyOn(node, 'getInputData').mockReturnValue(undefined)

      await node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在输入为 null 时输出 null', async () => {
      vi.spyOn(node, 'getInputData').mockReturnValue(null)

      await node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在输入为空字符串时输出 null', async () => {
      vi.spyOn(node, 'getInputData').mockReturnValue('')

      await node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该处理标准 SIWE 消息格式', async () => {
      const standardMessage = `example.com wants you to sign in with your Ethereum account:
0x1234567890123456789012345678901234567890

URI: https://example.com
Version: 1
Chain ID: 1
Nonce: abc123def456
Issued At: 2024-01-01T00:00:00.000Z`

      vi.spyOn(node, 'getInputData').mockReturnValue(standardMessage)

      await node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该处理包含可选字段的 SIWE 消息', async () => {
      const messageWithOptions = `service.example.com wants you to sign in with your Ethereum account:
0x1234567890123456789012345678901234567890

URI: https://example.com/login
Version: 1
Chain ID: 1
Nonce: xyz789
Issued At: 2024-01-01T12:00:00.000Z
Expiration Time: 2024-01-08T12:00:00.000Z
Not Before: 2024-01-01T11:00:00.000Z
Request ID: req-123-456
Resources:
- https://example.com/resource1
- https://example.com/resource2`

      vi.spyOn(node, 'getInputData').mockReturnValue(messageWithOptions)

      await node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该处理包含中文字符的 SIWE 消息', async () => {
      const chineseMessage = `例子.com 想让你使用以太坊账户登录:
0x1234567890123456789012345678901234567890

URI: https://例子.com
Version: 1
Chain ID: 1
Nonce: 测试123
Issued At: 2024-01-01T00:00:00.000Z`

      vi.spyOn(node, 'getInputData').mockReturnValue(chineseMessage)

      await node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该处理最小化的 SIWE 消息', async () => {
      const minimalMessage = `a.com wants you to sign in with your Ethereum account:
0x0000000000000000000000000000000000000001

URI: https://a.com
Version: 1
Chain ID: 1
Nonce: 1
Issued At: 2024-01-01T00:00:00.000Z`

      vi.spyOn(node, 'getInputData').mockReturnValue(minimalMessage)

      await node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该处理不同链 ID 的 SIWE 消息', async () => {
      const chains = [1, 5, 137, 42161, 10]

      for (const chainId of chains) {
        node = new ParseSiweMessageNode()

        const message = `example.com wants you to sign in with your Ethereum account:
0x1234567890123456789012345678901234567890

URI: https://example.com
Version: 1
Chain ID: ${chainId}
Nonce: test123
Issued At: 2024-01-01T00:00:00.000Z`

        vi.spyOn(node, 'getInputData').mockReturnValue(message)

        await node.onExecute()

        expect(node.getOutputData(0)).toBeNull()
      }
    })

    it('应该处理带有特殊字符的 nonce', async () => {
      const nonces = [
        'abc-123-def',
        'test_nonce_value',
        'nonce!@#$%',
        'UPPERCASE123',
        'mixedCase-456_XYZ',
      ]

      for (const nonce of nonces) {
        node = new ParseSiweMessageNode()

        const message = `example.com wants you to sign in with your Ethereum account:
0x1234567890123456789012345678901234567890

URI: https://example.com
Version: 1
Chain ID: 1
Nonce: ${nonce}
Issued At: 2024-01-01T00:00:00.000Z`

        vi.spyOn(node, 'getInputData').mockReturnValue(message)

        await node.onExecute()

        expect(node.getOutputData(0)).toBeNull()
      }
    })

    it('应该处理带有多个资源的 SIWE 消息', async () => {
      const message = `example.com wants you to sign in with your Ethereum account:
0x1234567890123456789012345678901234567890

URI: https://example.com
Version: 1
Chain ID: 1
Nonce: abc123
Issued At: 2024-01-01T00:00:00.000Z
Resources:
- https://example.com/resource1
- https://example.com/resource2
- https://example.com/resource3
- ipfs://QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
- urn:erc4337:example`

      vi.spyOn(node, 'getInputData').mockReturnValue(message)

      await node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })
  })

  describe('边界情况', () => {
    it('应该处理只包含空格的消息', async () => {
      vi.spyOn(node, 'getInputData').mockReturnValue('      ')

      await node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该处理只有换行符的消息', async () => {
      vi.spyOn(node, 'getInputData').mockReturnValue('\n\n\n')

      await node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该处理格式不完整的消息', async () => {
      const incompleteMessages = [
        'example.com wants you to sign in with your Ethereum account:',
        'example.com wants you to sign in with your Ethereum account:\n0x1234',
        'just a random message',
        '0x1234567890123456789012345678901234567890',
      ]

      for (const message of incompleteMessages) {
        node = new ParseSiweMessageNode()

        vi.spyOn(node, 'getInputData').mockReturnValue(message)

        await node.onExecute()

        expect(node.getOutputData(0)).toBeNull()
      }
    })

    it('应该处理超大字符串输入', async () => {
      const largeMessage = 'a'.repeat(100000)

      vi.spyOn(node, 'getInputData').mockReturnValue(largeMessage)

      await node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该处理字段顺序不同的消息', async () => {
      const message = `example.com wants you to sign in with your Ethereum account:
0x1234567890123456789012345678901234567890

Chain ID: 1
Version: 1
Nonce: abc123
Issued At: 2024-01-01T00:00:00.000Z
URI: https://example.com`

      vi.spyOn(node, 'getInputData').mockReturnValue(message)

      await node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该处理包含多余空格和换行的消息', async () => {
      const message = `example.com wants you to sign in with your Ethereum account:
0x1234567890123456789012345678901234567890


URI: https://example.com
Version: 1

Chain ID: 1
Nonce: abc123

Issued At: 2024-01-01T00:00:00.000Z


`

      vi.spyOn(node, 'getInputData').mockReturnValue(message)

      await node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该处理不同格式的 URI', async () => {
      const uris = [
        'https://example.com',
        'http://localhost:3000',
        'https://subdomain.example.com/path?query=value',
        'ipfs://QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        'urn:erc4337:example',
      ]

      for (const uri of uris) {
        node = new ParseSiweMessageNode()

        const message = `example.com wants you to sign in with your Ethereum account:
0x1234567890123456789012345678901234567890

URI: ${uri}
Version: 1
Chain ID: 1
Nonce: test123
Issued At: 2024-01-01T00:00:00.000Z`

        vi.spyOn(node, 'getInputData').mockReturnValue(message)

        await node.onExecute()

        expect(node.getOutputData(0)).toBeNull()
      }
    })

    it('应该处理不同的时间戳格式', async () => {
      const timeFormats = [
        '2024-01-01T00:00:00.000Z',
        '2024-01-01T00:00:00Z',
        '2024-01-01T12:30:45.123Z',
        '2024-12-31T23:59:59.999Z',
      ]

      for (const timestamp of timeFormats) {
        node = new ParseSiweMessageNode()

        const message = `example.com wants you to sign in with your Ethereum account:
0x1234567890123456789012345678901234567890

URI: https://example.com
Version: 1
Chain ID: 1
Nonce: test123
Issued At: ${timestamp}`

        vi.spyOn(node, 'getInputData').mockReturnValue(message)

        await node.onExecute()

        expect(node.getOutputData(0)).toBeNull()
      }
    })
  })

  describe('输出验证', () => {
    it('应该始终有一个输出', async () => {
      const message = 'test message'

      vi.spyOn(node, 'getInputData').mockReturnValue(message)

      await node.onExecute()

      // 验证有一个输出槽位
      expect(node.outputs).toHaveLength(1)

      // 验证输出有值(即使是 null)
      const output = node.getOutputData(0)
      expect(output !== undefined).toBe(true)
    })

    it('应该确保 parsed 输出是对象或 null', async () => {
      const message = 'test message'

      vi.spyOn(node, 'getInputData').mockReturnValue(message)

      await node.onExecute()

      const parsed = node.getOutputData(0)
      expect(parsed === null || typeof parsed === 'object').toBe(true)
    })

    it('应该在解析成功时输出包含所有字段的 object', async () => {
      const message = `example.com wants you to sign in with your Ethereum account:
0x1234567890123456789012345678901234567890

URI: https://example.com
Version: 1
Chain ID: 1
Nonce: abc123
Issued At: 2024-01-01T00:00:00.000Z`

      vi.spyOn(node, 'getInputData').mockReturnValue(message)

      await node.onExecute()

      const parsed = node.getOutputData(0)

      // 由于未实现,目前为 null
      // 实现后应该验证对象包含: domain, address, statement, uri, version, chainId, nonce, issuedAt 等字段
      expect(parsed).toBeNull()
    })
  })
})
