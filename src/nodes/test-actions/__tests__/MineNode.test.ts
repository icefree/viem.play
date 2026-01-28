import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MineNode } from '../MineNode'
import { createMockTestClient } from '@test-utils/helpers'
import type { TestClient } from 'viem'

describe('MineNode', () => {
  let node: MineNode
  let mockClient: TestClient

  beforeEach(() => {
    node = new MineNode()
    mockClient = createMockTestClient()
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和描述', () => {
      expect(node.title).toBe('mine')
      expect(MineNode.title).toBe('mine')
      expect(MineNode.desc).toBe('Mine a specified number of blocks')
    })

    it('应该有正确的颜色配置', () => {
      expect(node.color).toBe('#805ad5')
      expect(node.bgcolor).toBe('#553c9a')
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs).toHaveLength(3)
      expect(node.inputs?.[0].name).toBe('client')
      expect(node.inputs?.[0].type).toBe('testClient')
      expect(node.inputs?.[1].name).toBe('blocks')
      expect(node.inputs?.[1].type).toBe('number')
      expect(node.inputs?.[2].name).toBe('trigger')
      expect(node.inputs?.[2].type).toBe(-1)
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs).toHaveLength(1)
      expect(node.outputs?.[0].name).toBe('success')
      expect(node.outputs?.[0].type).toBe('boolean')
    })

    it('应该有正确的尺寸', () => {
      expect(node.size).toEqual([160, 80])
    })
  })

  describe('onAction', () => {
    it('应该正确执行 mine 操作', async () => {
      const mineSpy = vi.spyOn(mockClient, 'mine').mockResolvedValue(undefined)
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return 5
        return undefined
      })

      await node.onAction('trigger')

      expect(mineSpy).toHaveBeenCalledWith({ blocks: 5 })
      expect(node.getOutputData(0)).toBe(true)
    })

    it('应该处理 undefined 的 blocks 参数', async () => {
      const mineSpy = vi.spyOn(mockClient, 'mine').mockResolvedValue(undefined)
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        return undefined
      })

      await node.onAction('trigger')

      // 当 blocks 为 undefined 时,会直接传递 undefined
      expect(mineSpy).toHaveBeenCalledWith({ blocks: undefined })
      expect(node.getOutputData(0)).toBe(true)
    })

    it('当没有 client 时应该返回', async () => {
      const mineSpy = vi.spyOn(mockClient, 'mine')
      vi.spyOn(node, 'getInputData').mockReturnValue(undefined)

      await node.onAction('trigger')

      expect(mineSpy).not.toHaveBeenCalled()
    })

    it('应该处理 mine 错误并返回 false', async () => {
      vi.spyOn(mockClient, 'mine').mockRejectedValue(new Error('Mine failed'))
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        return undefined
      })

      await node.onAction('trigger')

      expect(node.getOutputData(0)).toBe(false)
    })

    it('非 trigger action 应该不执行操作', async () => {
      const mineSpy = vi.spyOn(mockClient, 'mine')
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        return undefined
      })

      await node.onAction('other')

      expect(mineSpy).not.toHaveBeenCalled()
    })
  })

  describe('输出数据验证', () => {
    it('成功时应该输出 true', async () => {
      vi.spyOn(mockClient, 'mine').mockResolvedValue(undefined)
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return 10
        return undefined
      })

      await node.onAction('trigger')

      expect(node.getOutputData(0)).toBe(true)
    })

    it('失败时应该输出 false', async () => {
      vi.spyOn(mockClient, 'mine').mockRejectedValue(new Error('Error'))
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        return undefined
      })

      await node.onAction('trigger')

      expect(node.getOutputData(0)).toBe(false)
    })
  })

  describe('参数验证', () => {
    it('应该正确传递 blocks 参数', async () => {
      const mineSpy = vi.spyOn(mockClient, 'mine').mockResolvedValue(undefined)
      const testBlocks = 100

      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testBlocks
        return undefined
      })

      await node.onAction('trigger')

      expect(mineSpy).toHaveBeenCalledWith({ blocks: testBlocks })
    })

    it('应该处理零个区块的情况', async () => {
      const mineSpy = vi.spyOn(mockClient, 'mine').mockResolvedValue(undefined)
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return 0
        return undefined
      })

      await node.onAction('trigger')

      expect(mineSpy).toHaveBeenCalledWith({ blocks: 0 })
      expect(node.getOutputData(0)).toBe(true)
    })
  })
})
