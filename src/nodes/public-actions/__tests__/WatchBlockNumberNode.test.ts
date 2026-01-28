import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { WatchBlockNumberNode } from '../WatchBlockNumberNode'
import { createMockPublicClient } from '@test-utils/helpers'
import type { PublicClient } from 'viem'

describe('WatchBlockNumberNode', () => {
  let node: WatchBlockNumberNode
  let mockClient: PublicClient
  let mockUnwatch: ReturnType<typeof vi.fn>

  beforeEach(() => {
    node = new WatchBlockNumberNode()
    mockUnwatch = vi.fn()
    mockClient = createMockPublicClient({
      watchBlockNumber: vi.fn().mockReturnValue(mockUnwatch),
    })
  })

  afterEach(() => {
    node.stopWatching()
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和输入输出', () => {
      expect(node.title).toBe('watchBlockNumber')
      expect(node.inputs).toHaveLength(2)
      expect(node.outputs).toHaveLength(2)
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs?.[0].name).toBe('trigger')
      expect(node.inputs?.[1].name).toBe('client')
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs?.[0].name).toBe('blockNumber')
      expect(node.outputs?.[1].name).toBe('onBlockNumber')
      expect(node.outputs?.[1].type).toBe(-1) // 事件类型
    })
  })

  describe('startWatching', () => {
    it('没有 client 时不应该开始监听', () => {
      node.getInputData = vi.fn().mockReturnValue(undefined) as typeof node.getInputData

      node.startWatching()

      expect(node.getIsWatching()).toBe(false)
    })

    it('应该成功开始监听', () => {
      node.getInputData = vi.fn((idx) => (idx === 1 ? mockClient : undefined)) as typeof node.getInputData

      node.startWatching()

      expect(node.getIsWatching()).toBe(true)
      expect(mockClient.watchBlockNumber).toHaveBeenCalled()
    })

    it('已经在监听时不应该重复开始', () => {
      node.getInputData = vi.fn((idx) => (idx === 1 ? mockClient : undefined)) as typeof node.getInputData

      node.startWatching()
      node.startWatching()

      expect(mockClient.watchBlockNumber).toHaveBeenCalledTimes(1)
    })

    it('收到区块号时应该触发输出', () => {
      let capturedCallback: ((blockNumber: bigint) => void) | undefined
      mockClient.watchBlockNumber = vi.fn().mockImplementation((options) => {
        capturedCallback = options.onBlockNumber
        return mockUnwatch
      })
      node.getInputData = vi.fn((idx) => (idx === 1 ? mockClient : undefined)) as typeof node.getInputData
      const triggerSlotSpy = vi.spyOn(node, 'triggerSlot')

      node.startWatching()
      capturedCallback?.(12345n)

      expect(node.getBlockNumber()).toBe(12345n)
      expect(triggerSlotSpy).toHaveBeenCalledWith(1, 12345n)
    })
  })

  describe('stopWatching', () => {
    it('应该停止监听并调用 unwatch', () => {
      node.getInputData = vi.fn((idx) => (idx === 1 ? mockClient : undefined)) as typeof node.getInputData

      node.startWatching()
      node.stopWatching()

      expect(node.getIsWatching()).toBe(false)
      expect(mockUnwatch).toHaveBeenCalled()
    })
  })

  describe('onAction', () => {
    it('触发 trigger 时应该切换监听状态', async () => {
      node.getInputData = vi.fn((idx) => (idx === 1 ? mockClient : undefined)) as typeof node.getInputData

      // 第一次触发：开始监听
      await node.onAction('trigger')
      expect(node.getIsWatching()).toBe(true)

      // 第二次触发：停止监听
      await node.onAction('trigger')
      expect(node.getIsWatching()).toBe(false)
    })
  })

  describe('onRemoved', () => {
    it('节点被移除时应该停止监听', () => {
      node.getInputData = vi.fn((idx) => (idx === 1 ? mockClient : undefined)) as typeof node.getInputData

      node.startWatching()
      node.onRemoved()

      expect(node.getIsWatching()).toBe(false)
      expect(mockUnwatch).toHaveBeenCalled()
    })
  })

  describe('onDrawForeground', () => {
    it('监听时应该显示 Watching 状态', () => {
      const ctx = {
        font: '',
        fillStyle: '',
        fillText: vi.fn(),
      } as unknown as CanvasRenderingContext2D

      node.getInputData = vi.fn((idx) => (idx === 1 ? mockClient : undefined)) as typeof node.getInputData
      node.startWatching()

      node.onDrawForeground(ctx)

      expect(ctx.fillText).toHaveBeenCalledWith('● Watching', 10, 55)
    })

    it('停止时应该显示 Stopped 状态', () => {
      const ctx = {
        font: '',
        fillStyle: '',
        fillText: vi.fn(),
      } as unknown as CanvasRenderingContext2D

      node.onDrawForeground(ctx)

      expect(ctx.fillText).toHaveBeenCalledWith('○ Stopped', 10, 55)
    })
  })
})
