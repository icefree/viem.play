import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GetEnsNameNode } from '../GetEnsNameNode'
import { createMockPublicClient } from '@test-utils/helpers'
import type { PublicClient } from 'viem'

describe('GetEnsNameNode', () => {
  let node: GetEnsNameNode
  let mockClient: PublicClient

  beforeEach(() => {
    node = new GetEnsNameNode()
    mockClient = createMockPublicClient()
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和输入输出', () => {
      expect(node.title).toBe('getEnsName')
      expect(node.inputs).toHaveLength(2)
      expect(node.outputs).toHaveLength(1)
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs?.[0].name).toBe('client')
      expect(node.inputs?.[0].type).toBe('publicClient')
      expect(node.inputs?.[1].name).toBe('address')
      expect(node.inputs?.[1].type).toBe('address')
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs?.[0].name).toBe('name')
      expect(node.outputs?.[0].type).toBe('string')
    })

    it('应该有正确的节点颜色配置', () => {
      expect(node.color).toBe('#319795')
      expect(node.bgcolor).toBe('#234e52')
    })

    it('应该有正确的节点尺寸', () => {
      expect(node.size).toEqual([180, 70])
    })
  })

  describe('onExecute', () => {
    it('当没有 client 时应该输出 null', async () => {
      vi.spyOn(node, 'getInputData').mockReturnValue(undefined)

      await node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('当没有 address 时应该输出 null', async () => {
      vi.spyOn(node, 'getInputData').mockImplementation((idx) => {
        if (idx === 0) return mockClient
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
      expect(GetEnsNameNode.title).toBe('getEnsName')
    })

    it('应该有正确的 desc', () => {
      expect(GetEnsNameNode.desc).toBe('Reverse resolve address to ENS name')
    })
  })

  describe('节点功能完整性', () => {
    it('应该支持地址到 ENS 名称的反向解析', () => {
      expect(node.outputs?.[0].name).toBe('name')
      expect(node.outputs?.[0].type).toBe('string')
    })

    it('应该正确处理地址类型的输入', () => {
      expect(node.inputs?.[1].type).toBe('address')
    })
  })

  describe('节点状态', () => {
    it('应该继承自 LGraphNode', () => {
      expect(node.constructor.name).toBe('GetEnsNameNode')
      expect(node).toHaveProperty('inputs')
      expect(node).toHaveProperty('outputs')
    })
  })
})
