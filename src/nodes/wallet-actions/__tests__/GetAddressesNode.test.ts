import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GetAddressesNode } from '../GetAddressesNode'
import type { WalletClient } from 'viem'

describe('GetAddressesNode', () => {
  let node: GetAddressesNode
  let mockClient: WalletClient

  beforeEach(() => {
    node = new GetAddressesNode()
    mockClient = {
      getAddresses: vi.fn(),
    } as unknown as WalletClient
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和输入输出', () => {
      expect(node.title).toBe('getAddresses')
      expect(node.inputs).toHaveLength(2)
      expect(node.outputs).toHaveLength(1)
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs?.[0].name).toBe('client')
      expect(node.inputs?.[1].name).toBe('trigger')
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs?.[0].name).toBe('addresses')
      expect(node.outputs?.[0].type).toBe('array')
    })

    it('应该初始化空地址数组', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((node as any).addresses).toEqual([])
    })
  })

  describe('onAction', () => {
    it('当没有 client 时不应该获取地址', async () => {
      vi.spyOn(node, 'getInputData').mockReturnValue(undefined)

      await node.onAction('trigger')

      expect(mockClient.getAddresses).not.toHaveBeenCalled()
    })

    it('应该成功获取地址列表', async () => {
      const testAddresses = [
        '0x1234567890123456789012345678901234567890',
        '0x0987654321098765432109876543210987654321',
      ]

      mockClient.getAddresses = vi.fn().mockResolvedValue(testAddresses)
      vi.spyOn(node, 'getInputData').mockReturnValue(mockClient)

      await node.onAction('trigger')
      node.onExecute()

      expect(mockClient.getAddresses).toHaveBeenCalled()
      expect(node.getOutputData(0)).toEqual(testAddresses)
    })

    it('应该处理获取地址错误', async () => {
      mockClient.getAddresses = vi.fn().mockRejectedValue(new Error('Wallet locked'))
      vi.spyOn(node, 'getInputData').mockReturnValue(mockClient)

      await node.onAction('trigger')
      node.onExecute()

      expect(node.getOutputData(0)).toEqual([])
    })

    it('应该处理空地址列表', async () => {
      const testAddresses: string[] = []
      mockClient.getAddresses = vi.fn().mockResolvedValue(testAddresses)
      vi.spyOn(node, 'getInputData').mockReturnValue(mockClient)

      await node.onAction('trigger')
      node.onExecute()

      expect(node.getOutputData(0)).toEqual([])
    })

    it('其他 action 不应该触发获取', async () => {
      vi.spyOn(node, 'getInputData').mockReturnValue(mockClient)

      await node.onAction('other')

      expect(mockClient.getAddresses).not.toHaveBeenCalled()
    })
  })

  describe('onExecute', () => {
    it('应该设置输出数据', () => {
      const testAddresses = ['0x1234567890123456789012345678901234567890']
      Object.defineProperty(node, 'addresses', { value: testAddresses, writable: true })

      node.onExecute()

      expect(node.getOutputData(0)).toEqual(testAddresses)
    })

    it('初始状态应该输出空数组', () => {
      node.onExecute()

      expect(node.getOutputData(0)).toEqual([])
    })
  })
})
