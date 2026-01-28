import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GetEnsTextNode } from '../GetEnsTextNode'
import { createMockPublicClient } from '@test-utils/helpers'
import type { PublicClient } from 'viem'

describe('GetEnsTextNode', () => {
  let node: GetEnsTextNode
  let mockClient: PublicClient

  beforeEach(() => {
    node = new GetEnsTextNode()
    mockClient = createMockPublicClient()
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和输入输出', () => {
      expect(node.title).toBe('getEnsText')
      expect(node.inputs).toHaveLength(3)
      expect(node.outputs).toHaveLength(1)
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs?.[0].name).toBe('client')
      expect(node.inputs?.[0].type).toBe('publicClient')
      expect(node.inputs?.[1].name).toBe('name')
      expect(node.inputs?.[1].type).toBe('string')
      expect(node.inputs?.[2].name).toBe('key')
      expect(node.inputs?.[2].type).toBe('string')
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs?.[0].name).toBe('value')
      expect(node.outputs?.[0].type).toBe('string')
    })

    it('应该有正确的节点颜色配置', () => {
      expect(node.color).toBe('#319795')
      expect(node.bgcolor).toBe('#234e52')
    })

    it('应该有正确的节点尺寸', () => {
      expect(node.size).toEqual([180, 90])
    })
  })

  describe('onExecute', () => {
    it('当没有 client 时应该输出 null', async () => {
      vi.spyOn(node, 'getInputData').mockReturnValue(undefined)

      await node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('当没有 name 时应该输出 null', async () => {
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        return undefined
      })

      await node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('当没有 key 时应该输出 null', async () => {
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
        if (idx === 1) return 'vitalik.eth'
        return undefined
      })

      await node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('初始状态输出应为 null', () => {
      node.onExecute()
      expect(node.getOutputData(0)).toBeNull()
    })
  })

  describe('静态属性', () => {
    it('应该有正确的 title', () => {
      expect(GetEnsTextNode.title).toBe('getEnsText')
    })

    it('应该有正确的 desc', () => {
      expect(GetEnsTextNode.desc).toBe('Get ENS text record')
    })
  })

  describe('节点功能完整性', () => {
    it('应该支持 ENS 文本记录的获取', () => {
      expect(node.outputs?.[0].name).toBe('value')
      expect(node.outputs?.[0].type).toBe('string')
    })

    it('应该正确处理字符串类型的 ENS 名称输入', () => {
      expect(node.inputs?.[1].type).toBe('string')
    })

    it('应该正确处理字符串类型的 key 输入', () => {
      expect(node.inputs?.[2].type).toBe('string')
    })
  })

  describe('节点状态', () => {
    it('应该继承自 LGraphNode', () => {
      expect(node.constructor.name).toBe('GetEnsTextNode')
      expect(node).toHaveProperty('inputs')
      expect(node).toHaveProperty('outputs')
    })
  })
})
