import { describe, it, expect, vi, beforeEach } from 'vitest'
import { RevertNode } from '../RevertNode'
import { createMockTestClient } from '@test-utils/helpers'
import type { TestClient } from 'viem'

describe('RevertNode', () => {
  let node: RevertNode
  let mockClient: TestClient

  beforeEach(() => {
    node = new RevertNode()
    mockClient = createMockTestClient()
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和描述', () => {
      expect(node.title).toBe('revert')
      expect(RevertNode.title).toBe('revert')
      expect(RevertNode.desc).toBe('Revert state to a previous snapshot')
    })

    it('应该有正确的颜色配置', () => {
      expect(node.color).toBe('#805ad5')
      expect(node.bgcolor).toBe('#553c9a')
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs).toHaveLength(3)
      expect(node.inputs?.[0].name).toBe('client')
      expect(node.inputs?.[0].type).toBe('testClient')
      expect(node.inputs?.[1].name).toBe('id')
      expect(node.inputs?.[1].type).toBe('string')
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
    it('应该正确执行 revert 操作', async () => {
      const testSnapshotId = '0x123'
      const revertSpy = vi.spyOn(mockClient, 'revert').mockResolvedValue(undefined)

      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testSnapshotId
        return undefined
      })

      await node.onAction('trigger')

      expect(revertSpy).toHaveBeenCalledWith({ id: testSnapshotId })
      expect(node.getOutputData(0)).toBe(true)
    })

    it('当没有 client 时应该返回', async () => {
      const revertSpy = vi.spyOn(mockClient, 'revert')
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 1) return '0x123'
        return undefined
      })

      await node.onAction('trigger')

      expect(revertSpy).not.toHaveBeenCalled()
    })

    it('当没有 id 时应该返回', async () => {
      const revertSpy = vi.spyOn(mockClient, 'revert')
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        return undefined
      })

      await node.onAction('trigger')

      expect(revertSpy).not.toHaveBeenCalled()
    })

    it('应该处理 revert 错误并返回 false', async () => {
      vi.spyOn(mockClient, 'revert').mockRejectedValue(new Error('Revert failed'))
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return '0x123'
        return undefined
      })

      await node.onAction('trigger')

      expect(node.getOutputData(0)).toBe(false)
    })

    it('非 trigger action 应该不执行操作', async () => {
      const revertSpy = vi.spyOn(mockClient, 'revert')
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return '0x123'
        return undefined
      })

      await node.onAction('other')

      expect(revertSpy).not.toHaveBeenCalled()
    })
  })

  describe('输出数据验证', () => {
    it('成功时应该输出 true', async () => {
      vi.spyOn(mockClient, 'revert').mockResolvedValue(undefined)
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return '0x456'
        return undefined
      })

      await node.onAction('trigger')

      expect(node.getOutputData(0)).toBe(true)
    })

    it('失败时应该输出 false', async () => {
      vi.spyOn(mockClient, 'revert').mockRejectedValue(new Error('Error'))
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return '0x789'
        return undefined
      })

      await node.onAction('trigger')

      expect(node.getOutputData(0)).toBe(false)
    })
  })

  describe('参数验证', () => {
    it('应该正确传递 id 参数', async () => {
      const revertSpy = vi.spyOn(mockClient, 'revert').mockResolvedValue(undefined)
      const testSnapshotId = '0xabcd'

      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testSnapshotId
        return undefined
      })

      await node.onAction('trigger')

      expect(revertSpy).toHaveBeenCalledWith({ id: testSnapshotId })
    })

    it('应该处理不同的快照 ID 格式', async () => {
      const testCases = [
        '0x1',
        '0x123',
        '0xffffffff',
        '0x' + '1'.repeat(64),
      ]

      for (const snapshotId of testCases) {
        const revertSpy = vi.spyOn(mockClient, 'revert').mockResolvedValue(undefined)

        vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
          if (idx === 0) return mockClient
          if (idx === 1) return snapshotId
          return undefined
        })

        await node.onAction('trigger')

        expect(revertSpy).toHaveBeenCalledWith({ id: snapshotId })
        expect(node.getOutputData(0)).toBe(true)
      }
    })

    it('应该处理空字符串 ID', async () => {
      const revertSpy = vi.spyOn(mockClient, 'revert')

      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return ''
        return undefined
      })

      await node.onAction('trigger')

      // 空字符串是 falsy，所以应该不调用 revert
      expect(revertSpy).not.toHaveBeenCalled()
    })
  })

  describe('错误处理', () => {
    it('应该处理快照 ID 不存在的错误', async () => {
      vi.spyOn(mockClient, 'revert').mockRejectedValue(
        new Error('Snapshot not found')
      )

      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return '0xnonexistent'
        return undefined
      })

      await node.onAction('trigger')

      expect(node.getOutputData(0)).toBe(false)
    })

    it('应该处理网络错误', async () => {
      vi.spyOn(mockClient, 'revert').mockRejectedValue(
        new Error('Network error')
      )

      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return '0x123'
        return undefined
      })

      await node.onAction('trigger')

      expect(node.getOutputData(0)).toBe(false)
    })
  })

  describe('多次调用', () => {
    it('应该支持多次 revert 操作', async () => {
      const revertSpy = vi.spyOn(mockClient, 'revert').mockResolvedValue(undefined)

      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return '0x1'
        return undefined
      })

      // 第一次调用
      await node.onAction('trigger')
      expect(revertSpy).toHaveBeenCalledTimes(1)
      expect(node.getOutputData(0)).toBe(true)

      // 第二次调用
      await node.onAction('trigger')
      expect(revertSpy).toHaveBeenCalledTimes(2)
      expect(node.getOutputData(0)).toBe(true)

      // 第三次调用
      await node.onAction('trigger')
      expect(revertSpy).toHaveBeenCalledTimes(3)
      expect(node.getOutputData(0)).toBe(true)
    })
  })
})
