import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SetNextBlockTimestampNode } from '../SetNextBlockTimestampNode'
import { createMockTestClient } from '@test-utils/helpers'
import type { TestClient } from 'viem'

describe('SetNextBlockTimestampNode', () => {
  let node: SetNextBlockTimestampNode
  let mockClient: TestClient

  beforeEach(() => {
    node = new SetNextBlockTimestampNode()
    mockClient = createMockTestClient()
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和描述', () => {
      expect(node.title).toBe('setNextBlockTimestamp')
      expect(SetNextBlockTimestampNode.title).toBe('setNextBlockTimestamp')
      expect(SetNextBlockTimestampNode.desc).toBe('Set the timestamp of the next block')
    })

    it('应该有正确的颜色配置', () => {
      expect(node.color).toBe('#805ad5')
      expect(node.bgcolor).toBe('#553c9a')
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs).toHaveLength(3)
      expect(node.inputs?.[0].name).toBe('client')
      expect(node.inputs?.[0].type).toBe('testClient')
      expect(node.inputs?.[1].name).toBe('timestamp')
      expect(node.inputs?.[1].type).toBe('bigint,number')
      expect(node.inputs?.[2].name).toBe('trigger')
      expect(node.inputs?.[2].type).toBe(-1)
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs).toHaveLength(1)
      expect(node.outputs?.[0].name).toBe('success')
      expect(node.outputs?.[0].type).toBe('boolean')
    })

    it('应该有正确的尺寸', () => {
      expect(node.size).toEqual([200, 80])
    })
  })

  describe('onAction', () => {
    it('应该正确执行 setNextBlockTimestamp 操作 (bigint)', async () => {
      const testTimestamp = 1700000000n
      const setTimestampSpy = vi.spyOn(mockClient, 'setNextBlockTimestamp').mockResolvedValue(undefined)

      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testTimestamp
        return undefined
      })

      await node.onAction('trigger')

      expect(setTimestampSpy).toHaveBeenCalledWith({ timestamp: testTimestamp })
      expect(node.getOutputData(0)).toBe(true)
    })

    it('应该正确执行 setNextBlockTimestamp 操作 (number)', async () => {
      const testTimestamp = 1700000000
      const setTimestampSpy = vi.spyOn(mockClient, 'setNextBlockTimestamp').mockResolvedValue(undefined)

      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testTimestamp
        return undefined
      })

      await node.onAction('trigger')

      expect(setTimestampSpy).toHaveBeenCalledWith({ timestamp: BigInt(testTimestamp) })
      expect(node.getOutputData(0)).toBe(true)
    })

    it('当没有 client 时应该返回', async () => {
      const setTimestampSpy = vi.spyOn(mockClient, 'setNextBlockTimestamp')
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 1) return 1700000000n
        return undefined
      })

      await node.onAction('trigger')

      expect(setTimestampSpy).not.toHaveBeenCalled()
    })

    it('当没有 timestamp 时应该返回', async () => {
      const setTimestampSpy = vi.spyOn(mockClient, 'setNextBlockTimestamp')
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        return undefined
      })

      await node.onAction('trigger')

      expect(setTimestampSpy).not.toHaveBeenCalled()
    })

    it('应该处理 setNextBlockTimestamp 错误并返回 false', async () => {
      vi.spyOn(mockClient, 'setNextBlockTimestamp').mockRejectedValue(new Error('Set timestamp failed'))
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return 1700000000n
        return undefined
      })

      await node.onAction('trigger')

      expect(node.getOutputData(0)).toBe(false)
    })

    it('非 trigger action 应该不执行操作', async () => {
      const setTimestampSpy = vi.spyOn(mockClient, 'setNextBlockTimestamp')
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return 1700000000n
        return undefined
      })

      await node.onAction('other')

      expect(setTimestampSpy).not.toHaveBeenCalled()
    })
  })

  describe('输出数据验证', () => {
    it('成功时应该输出 true', async () => {
      vi.spyOn(mockClient, 'setNextBlockTimestamp').mockResolvedValue(undefined)
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return 1800000000n
        return undefined
      })

      await node.onAction('trigger')

      expect(node.getOutputData(0)).toBe(true)
    })

    it('失败时应该输出 false', async () => {
      vi.spyOn(mockClient, 'setNextBlockTimestamp').mockRejectedValue(new Error('Error'))
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return 1700000000n
        return undefined
      })

      await node.onAction('trigger')

      expect(node.getOutputData(0)).toBe(false)
    })
  })

  describe('参数验证', () => {
    it('应该正确传递 bigint 类型 timestamp', async () => {
      const setTimestampSpy = vi.spyOn(mockClient, 'setNextBlockTimestamp').mockResolvedValue(undefined)
      const testTimestamp = 1900000000n

      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testTimestamp
        return undefined
      })

      await node.onAction('trigger')

      expect(setTimestampSpy).toHaveBeenCalledWith({ timestamp: testTimestamp })
      expect(node.getOutputData(0)).toBe(true)
    })

    it('应该正确传递 number 类型 timestamp 并转换为 bigint', async () => {
      const setTimestampSpy = vi.spyOn(mockClient, 'setNextBlockTimestamp').mockResolvedValue(undefined)
      const testTimestamp = 2000000000

      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return testTimestamp
        return undefined
      })

      await node.onAction('trigger')

      expect(setTimestampSpy).toHaveBeenCalledWith({ timestamp: BigInt(testTimestamp) })
      expect(node.getOutputData(0)).toBe(true)
    })

    it('应该处理零时间戳', async () => {
      const setTimestampSpy = vi.spyOn(mockClient, 'setNextBlockTimestamp').mockResolvedValue(undefined)
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return 0n
        return undefined
      })

      await node.onAction('trigger')

      expect(setTimestampSpy).toHaveBeenCalledWith({ timestamp: 0n })
      expect(node.getOutputData(0)).toBe(true)
    })

    it('应该处理非常大的时间戳', async () => {
      const setTimestampSpy = vi.spyOn(mockClient, 'setNextBlockTimestamp').mockResolvedValue(undefined)
      const largeTimestamp = 9999999999n

      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return largeTimestamp
        return undefined
      })

      await node.onAction('trigger')

      expect(setTimestampSpy).toHaveBeenCalledWith({ timestamp: largeTimestamp })
      expect(node.getOutputData(0)).toBe(true)
    })

    it('应该处理负数时间戳（如果提供）', async () => {
      const setTimestampSpy = vi.spyOn(mockClient, 'setNextBlockTimestamp').mockResolvedValue(undefined)
      const negativeTimestamp = -1

      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return negativeTimestamp
        return undefined
      })

      await node.onAction('trigger')

      expect(setTimestampSpy).toHaveBeenCalledWith({ timestamp: BigInt(negativeTimestamp) })
      expect(node.getOutputData(0)).toBe(true)
    })
  })

  describe('类型转换', () => {
    it('应该正确识别 bigint 类型', async () => {
      const setTimestampSpy = vi.spyOn(mockClient, 'setNextBlockTimestamp').mockResolvedValue(undefined)
      const bigintTimestamp = 1234567890n

      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return bigintTimestamp
        return undefined
      })

      await node.onAction('trigger')

      // 验证传递的是原始 bigint 而不是转换后的
      expect(setTimestampSpy).toHaveBeenCalledWith({ timestamp: bigintTimestamp })
    })

    it('应该正确转换 number 类型为 bigint', async () => {
      const setTimestampSpy = vi.spyOn(mockClient, 'setNextBlockTimestamp').mockResolvedValue(undefined)
      const numberTimestamp = 1234567890

      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return numberTimestamp
        return undefined
      })

      await node.onAction('trigger')

      // 验证传递的是转换后的 bigint
      expect(setTimestampSpy).toHaveBeenCalledWith({ timestamp: 1234567890n })
    })
  })

  describe('实际场景测试', () => {
    it('应该处理 Unix 时间戳（2024-01-01）', async () => {
      const setTimestampSpy = vi.spyOn(mockClient, 'setNextBlockTimestamp').mockResolvedValue(undefined)
      const unixTimestamp = 1704067200n // 2024-01-01 00:00:00 UTC

      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return unixTimestamp
        return undefined
      })

      await node.onAction('trigger')

      expect(setTimestampSpy).toHaveBeenCalledWith({ timestamp: unixTimestamp })
      expect(node.getOutputData(0)).toBe(true)
    })

    it('应该处理未来时间戳', async () => {
      const setTimestampSpy = vi.spyOn(mockClient, 'setNextBlockTimestamp').mockResolvedValue(undefined)
      const futureTimestamp = 2000000000n // 2033-05-18

      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return futureTimestamp
        return undefined
      })

      await node.onAction('trigger')

      expect(setTimestampSpy).toHaveBeenCalledWith({ timestamp: futureTimestamp })
      expect(node.getOutputData(0)).toBe(true)
    })
  })
})
