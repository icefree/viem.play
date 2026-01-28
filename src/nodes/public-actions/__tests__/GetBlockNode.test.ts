import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GetBlockNode } from '../GetBlockNode'
import { createMockPublicClient, createMockBlock } from '../../../../tests/utils/helpers'
import type { PublicClient } from 'viem'

describe('GetBlockNode', () => {
  let node: GetBlockNode
  let mockClient: PublicClient

  beforeEach(() => {
    node = new GetBlockNode()
    mockClient = createMockPublicClient()
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和输入输出', () => {
      expect(node.title).toBe('getBlock')
      expect(node.inputs).toHaveLength(3)
      expect(node.outputs).toHaveLength(3)
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs?.[0].name).toBe('trigger')
      expect(node.inputs?.[1].name).toBe('client')
      expect(node.inputs?.[2].name).toBe('blockNumber')
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs?.[0].name).toBe('block')
      expect(node.outputs?.[1].name).toBe('timestamp')
      expect(node.outputs?.[2].name).toBe('hash')
    })
  })

  describe('fetchBlock', () => {
    it('当没有 client 时应该输出 null', async () => {
      node.getInputData = vi.fn().mockReturnValue(undefined)

      await node.fetchBlock()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该成功获取最新区块', async () => {
      const mockBlock = createMockBlock({ number: 100n })
      mockClient.getBlock = vi.fn().mockResolvedValue(mockBlock)
      node.getInputData = vi.fn((idx) => (idx === 1 ? mockClient : undefined))

      await node.fetchBlock()

      expect(mockClient.getBlock).toHaveBeenCalledWith({})
      expect(node.getOutputData(0)).toEqual(mockBlock)
      expect(node.getOutputData(1)).toBe(mockBlock.timestamp)
      expect(node.getOutputData(2)).toBe(mockBlock.hash)
    })

    it('应该根据 blockNumber 获取指定区块', async () => {
      const blockNumber = 12345n
      const mockBlock = createMockBlock({ number: blockNumber })
      mockClient.getBlock = vi.fn().mockResolvedValue(mockBlock)
      node.getInputData = vi.fn((idx) => {
        if (idx === 1) return mockClient
        if (idx === 2) return blockNumber
        return undefined
      })

      await node.fetchBlock()

      expect(mockClient.getBlock).toHaveBeenCalledWith({ blockNumber })
      expect(node.getOutputData(0)).toEqual(mockBlock)
    })

    it('应该处理 API 错误', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      mockClient.getBlock = vi.fn().mockRejectedValue(new Error('API Error'))
      node.getInputData = vi.fn((idx) => (idx === 1 ? mockClient : undefined))

      await node.fetchBlock()

      expect(consoleError).toHaveBeenCalledWith('GetBlock error:', expect.any(Error))
      consoleError.mockRestore()
    })

    it('应该防止并发请求', async () => {
      mockClient.getBlock = vi.fn().mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(createMockBlock()), 100))
      )
      node.getInputData = vi.fn((idx) => (idx === 1 ? mockClient : undefined))

      // 同时发起两次请求
      const promise1 = node.fetchBlock()
      const promise2 = node.fetchBlock()

      await Promise.all([promise1, promise2])

      // 只应该调用一次
      expect(mockClient.getBlock).toHaveBeenCalledTimes(1)
    })
  })

  describe('onAction', () => {
    it('触发 trigger action 时应该调用 fetchBlock', async () => {
      const fetchBlockSpy = vi.spyOn(node, 'fetchBlock').mockResolvedValue()

      await node.onAction('trigger')

      expect(fetchBlockSpy).toHaveBeenCalled()
    })

    it('其他 action 不应该触发 fetchBlock', async () => {
      const fetchBlockSpy = vi.spyOn(node, 'fetchBlock').mockResolvedValue()

      await node.onAction('other')

      expect(fetchBlockSpy).not.toHaveBeenCalled()
    })
  })

  describe('onExecute', () => {
    it('当有缓存 block 时应该输出它', async () => {
      const mockBlock = createMockBlock()
      mockClient.getBlock = vi.fn().mockResolvedValue(mockBlock)
      node.getInputData = vi.fn((idx) => (idx === 1 ? mockClient : undefined))

      await node.fetchBlock()
      node.onExecute()

      expect(node.getOutputData(0)).toEqual(mockBlock)
    })
  })
})
