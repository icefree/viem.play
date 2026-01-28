import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SnapshotNode } from '../SnapshotNode'
import { createMockTestClient } from '@test-utils/helpers'
import type { TestClient } from 'viem'

describe('SnapshotNode', () => {
  let node: SnapshotNode
  let mockClient: TestClient

  beforeEach(() => {
    node = new SnapshotNode()
    mockClient = createMockTestClient()
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和描述', () => {
      expect(node.title).toBe('snapshot')
      expect(SnapshotNode.title).toBe('snapshot')
      expect(SnapshotNode.desc).toBe('Create a snapshot of the current state')
    })

    it('应该有正确的颜色配置', () => {
      expect(node.color).toBe('#805ad5')
      expect(node.bgcolor).toBe('#553c9a')
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs).toHaveLength(2)
      expect(node.inputs?.[0].name).toBe('client')
      expect(node.inputs?.[0].type).toBe('testClient')
      expect(node.inputs?.[1].name).toBe('trigger')
      expect(node.inputs?.[1].type).toBe(-1)
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs).toHaveLength(1)
      expect(node.outputs?.[0].name).toBe('id')
      expect(node.outputs?.[0].type).toBe('string')
    })

    it('应该有正确的尺寸', () => {
      expect(node.size).toEqual([160, 60])
    })

    it('应该初始化 snapshotId 为 null', () => {
      // 通过 onExecute 获取初始输出
      node.onExecute()
      expect(node.getOutputData(0)).toBeNull()
    })
  })

  describe('onAction', () => {
    it('应该正确执行 snapshot 操作并存储 ID', async () => {
      const testSnapshotId = '0x123' as `0x${string}`
      const snapshotSpy = vi.spyOn(mockClient, 'snapshot').mockResolvedValue(testSnapshotId)

      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        return undefined
      })

      await node.onAction('trigger')

      expect(snapshotSpy).toHaveBeenCalled()
      node.onExecute()
      expect(node.getOutputData(0)).toBe(testSnapshotId)
    })

    it('当没有 client 时应该返回', async () => {
      const snapshotSpy = vi.spyOn(mockClient, 'snapshot')
      vi.spyOn(node, 'getInputData').mockReturnValue(undefined)

      await node.onAction('trigger')

      expect(snapshotSpy).not.toHaveBeenCalled()
    })

    it('应该处理 snapshot 错误并打印到控制台', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      const testError = new Error('Snapshot failed')
      vi.spyOn(mockClient, 'snapshot').mockRejectedValue(testError)

      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        return undefined
      })

      await node.onAction('trigger')

      expect(consoleError).toHaveBeenCalledWith(testError)
      consoleError.mockRestore()
    })

    it('非 trigger action 应该 not 执行操作', async () => {
      const snapshotSpy = vi.spyOn(mockClient, 'snapshot')
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        return undefined
      })

      await node.onAction('other')

      expect(snapshotSpy).not.toHaveBeenCalled()
    })

    it('应该更新 snapshotId', async () => {
      const firstSnapshotId = '0x1' as `0x${string}`
      const secondSnapshotId = '0x2' as `0x${string}`
      const snapshotSpy = vi.spyOn(mockClient, 'snapshot')
        .mockResolvedValueOnce(firstSnapshotId)
        .mockResolvedValueOnce(secondSnapshotId)

      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        return undefined
      })

      // 第一次 snapshot
      await node.onAction('trigger')
      node.onExecute()
      expect(node.getOutputData(0)).toBe(firstSnapshotId)

      // 第二次 snapshot
      await node.onAction('trigger')
      node.onExecute()
      expect(node.getOutputData(0)).toBe(secondSnapshotId)

      expect(snapshotSpy).toHaveBeenCalledTimes(2)
    })
  })

  describe('onExecute', () => {
    it('应该输出当前的 snapshotId', async () => {
      const testSnapshotId = '0x456' as `0x${string}`
      vi.spyOn(mockClient, 'snapshot').mockResolvedValue(testSnapshotId)

      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        return undefined
      })

      await node.onAction('trigger')
      node.onExecute()

      expect(node.getOutputData(0)).toBe(testSnapshotId)
    })

    it('初始状态应该输出 null', () => {
      node.onExecute()
      expect(node.getOutputData(0)).toBeNull()
    })

    it('多次调用 onExecute 应该保持相同的 snapshotId', async () => {
      const testSnapshotId = '0x789' as `0x${string}`
      vi.spyOn(mockClient, 'snapshot').mockResolvedValue(testSnapshotId)

      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        return undefined
      })

      await node.onAction('trigger')

      // 多次调用 onExecute
      node.onExecute()
      expect(node.getOutputData(0)).toBe(testSnapshotId)

      node.onExecute()
      expect(node.getOutputData(0)).toBe(testSnapshotId)

      node.onExecute()
      expect(node.getOutputData(0)).toBe(testSnapshotId)
    })
  })

  describe('输出数据验证', () => {
    it('成功时应该输出 snapshot ID', async () => {
      const testSnapshotId = '0xabcd1234' as `0x${string}`
      vi.spyOn(mockClient, 'snapshot').mockResolvedValue(testSnapshotId)

      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        return undefined
      })

      await node.onAction('trigger')
      node.onExecute()

      expect(node.getOutputData(0)).toBe(testSnapshotId)
      expect(typeof node.getOutputData(0)).toBe('string')
    })

    it('失败时不应该更新 snapshotId', async () => {
      const initialSnapshotId = '0x999' as `0x${string}`
      // 首先设置一个初始值
      vi.spyOn(mockClient, 'snapshot').mockResolvedValue(initialSnapshotId)
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        return undefined
      })

      await node.onAction('trigger')
      node.onExecute()
      expect(node.getOutputData(0)).toBe(initialSnapshotId)

      // 第二次调用失败
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      vi.spyOn(mockClient, 'snapshot').mockRejectedValue(new Error('Error'))

      await node.onAction('trigger')
      node.onExecute()

      // snapshotId 应该保持不变
      expect(node.getOutputData(0)).toBe(initialSnapshotId)
      consoleError.mockRestore()
    })
  })

  describe('不同的快照 ID 格式', () => {
    it('应该处理不同的快照 ID 格式', async () => {
      const testCases = [
        '0x1' as `0x${string}`,
        '0x123' as `0x${string}`,
        '0xffffffff' as `0x${string}`,
        ('0x' + '1'.repeat(64)) as `0x${string}`,
      ]

      for (const snapshotId of testCases) {
        // 创建新节点实例
        const newNode = new SnapshotNode()
        vi.spyOn(mockClient, 'snapshot').mockResolvedValue(snapshotId)
        vi.spyOn(newNode, 'getInputData').mockImplementation((idx) => {
          if (idx === 0) return mockClient
          return undefined
        })

        await newNode.onAction('trigger')
        newNode.onExecute()

        expect(newNode.getOutputData(0)).toBe(snapshotId)
      }
    })
  })
})
