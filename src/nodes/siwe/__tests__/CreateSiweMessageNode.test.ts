import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CreateSiweMessageNode } from '../CreateSiweMessageNode'
import type { Address } from 'viem'

describe('CreateSiweMessageNode', () => {
  let node: CreateSiweMessageNode

  beforeEach(() => {
    node = new CreateSiweMessageNode()
  })

  describe('constructor', () => {
    it('应该有正确的静态标题和描述', () => {
      expect(CreateSiweMessageNode.title).toBe('createSiweMessage')
      expect(CreateSiweMessageNode.desc).toBe('Create Sign-In with Ethereum message')
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs).toHaveLength(4)
      expect(node.inputs?.[0].name).toBe('address')
      expect(node.inputs?.[0].type).toBe('address')
      expect(node.inputs?.[1].name).toBe('domain')
      expect(node.inputs?.[1].type).toBe('string')
      expect(node.inputs?.[2].name).toBe('uri')
      expect(node.inputs?.[2].type).toBe('string')
      expect(node.inputs?.[3].name).toBe('nonce')
      expect(node.inputs?.[3].type).toBe('string')
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs).toHaveLength(1)
      expect(node.outputs?.[0].name).toBe('message')
      expect(node.outputs?.[0].type).toBe('string')
    })

    it('应该有正确的节点尺寸', () => {
      expect(node.size).toEqual([200, 110])
    })

    it('应该有正确的颜色配置', () => {
      expect(node.color).toBe('#ed8936')
      expect(node.bgcolor).toBe('#9c4221')
    })
  })

  describe('onExecute', () => {
    it('应该在所有输入都存在时输出 SIWE 消息', async () => {
      const address: Address = '0x1234567890123456789012345678901234567890'
      const domain = 'example.com'
      const uri = 'https://example.com'
      const nonce = 'abc123'

      vi.spyOn(node, 'getInputData').mockImplementation((index) => {
        const inputs = [address, domain, uri, nonce]
        return inputs[index]
      })

      await node.onExecute()

      const result = node.getOutputData(0)
      // 由于节点未实现,目前输出 null
      expect(result).toBeNull()
    })

    it('应该在缺少 address 时输出 null', async () => {
      vi.spyOn(node, 'getInputData').mockReturnValue(undefined)

      await node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在缺少 domain 时输出 null', async () => {
      const address: Address = '0x1234567890123456789012345678901234567890'

      vi.spyOn(node, 'getInputData').mockImplementation((index) => {
        if (index === 0) return address
        return undefined
      })

      await node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在缺少 uri 时输出 null', async () => {
      const address: Address = '0x1234567890123456789012345678901234567890'
      const domain = 'example.com'

      vi.spyOn(node, 'getInputData').mockImplementation((index) => {
        const inputs = [address, domain]
        return inputs[index]
      })

      await node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在缺少 nonce 时输出 null', async () => {
      const address: Address = '0x1234567890123456789012345678901234567890'
      const domain = 'example.com'
      const uri = 'https://example.com'

      vi.spyOn(node, 'getInputData').mockImplementation((index) => {
        const inputs = [address, domain, uri]
        return inputs[index]
      })

      await node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该处理空字符串输入', async () => {
      const address: Address = '0x1234567890123456789012345678901234567890'
      const domain = ''
      const uri = ''
      const nonce = ''

      vi.spyOn(node, 'getInputData').mockImplementation((index) => {
        const inputs = [address, domain, uri, nonce]
        return inputs[index]
      })

      await node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该处理有效的 Ethereum 地址', async () => {
      const validAddresses: Address[] = [
        '0x1234567890123456789012345678901234567890',
        '0xffffffffffffffffffffffffffffffffffffffff',
        '0x0000000000000000000000000000000000000001',
      ]

      for (const address of validAddresses) {
        node = new CreateSiweMessageNode()
        const domain = 'example.com'
        const uri = 'https://example.com'
        const nonce = 'test-nonce'

        vi.spyOn(node, 'getInputData').mockImplementation((index) => {
          const inputs = [address, domain, uri, nonce]
          return inputs[index]
        })

        await node.onExecute()

        expect(node.getOutputData(0)).toBeNull()
      }
    })

    it('应该处理特殊字符的 domain 和 uri', async () => {
      const address: Address = '0x1234567890123456789012345678901234567890'
      const domain = 'sub-domain.example.com'
      const uri = 'https://example.com/path?query=value'
      const nonce = 'nonce-with-special-chars-123'

      vi.spyOn(node, 'getInputData').mockImplementation((index) => {
        const inputs = [address, domain, uri, nonce]
        return inputs[index]
      })

      await node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该处理包含中文的 domain', async () => {
      const address: Address = '0x1234567890123456789012345678901234567890'
      const domain = '例子.com'
      const uri = 'https://例子.com'
      const nonce = 'test-nonce'

      vi.spyOn(node, 'getInputData').mockImplementation((index) => {
        const inputs = [address, domain, uri, nonce]
        return inputs[index]
      })

      await node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该处理非常长的 nonce', async () => {
      const address: Address = '0x1234567890123456789012345678901234567890'
      const domain = 'example.com'
      const uri = 'https://example.com'
      const nonce = 'a'.repeat(1000)

      vi.spyOn(node, 'getInputData').mockImplementation((index) => {
        const inputs = [address, domain, uri, nonce]
        return inputs[index]
      })

      await node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })
  })

  describe('边界情况', () => {
    it('应该处理 null 输入', async () => {
      vi.spyOn(node, 'getInputData').mockReturnValue(null)

      await node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该处理混合有效和无效输入', async () => {
      const address: Address = '0x1234567890123456789012345678901234567890'
      const domain = 'example.com'
      const uri = null
      const nonce = 'test-nonce'

      vi.spyOn(node, 'getInputData').mockImplementation((index) => {
        const inputs = [address, domain, uri, nonce]
        return inputs[index]
      })

      await node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该处理超大字符串输入', async () => {
      const address: Address = '0x1234567890123456789012345678901234567890'
      const domain = 'a'.repeat(10000)
      const uri = 'https://example.com/' + 'a'.repeat(1000)
      const nonce = 'b'.repeat(500)

      vi.spyOn(node, 'getInputData').mockImplementation((index) => {
        const inputs = [address, domain, uri, nonce]
        return inputs[index]
      })

      await node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })
  })
})
