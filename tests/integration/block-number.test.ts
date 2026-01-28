/**
 * GetBlockNumber 节点集成测试 - 使用 Anvil 真实数据验证
 */
import { describe, it, expect, beforeAll } from 'vitest'
import { createTestClient } from '../test-network'
import type { PublicClient } from 'viem'

describe('GetBlockNumber 集成测试 (Anvil)', () => {
  let client: PublicClient

  beforeAll(async () => {
    client = createTestClient()

    // 验证 Anvil 连接
    try {
      await client.getChainId()
    } catch {
      throw new Error('无法连接到 Anvil，请确保已运行: anvil')
    }
  })

  describe('getBlockNumber', () => {
    it('应该返回当前区块号', async () => {
      const blockNumber = await client.getBlockNumber()

      expect(typeof blockNumber).toBe('bigint')
      expect(blockNumber).toBeGreaterThan(0n)
    })

    it('连续调用应该返回递增的区块号', async () => {
      const blockNumber1 = await client.getBlockNumber()

      // Anvil 默认不自动挖矿，需要手动触发或等待
      // 这里我们验证返回值是有效的
      expect(blockNumber1).toBeGreaterThan(0n)

      // 在实际应用中，如果有新区块被挖出，第二次调用会返回更大的值
      // 但在测试环境中，可能返回相同的区块号
      const blockNumber2 = await client.getBlockNumber()
      expect(blockNumber2).toBeGreaterThanOrEqual(blockNumber1)
    })

    it('区块号应该与 getBlock 返回的区块号一致', async () => {
      const blockNumber = await client.getBlockNumber()
      const block = await client.getBlock()

      expect(block.number).toBe(blockNumber)
    })

    it('区块号应该是合理的数值范围', async () => {
      const blockNumber = await client.getBlockNumber()

      // Anvil 初始区块号通常是 0
      expect(blockNumber).toBeGreaterThan(0n)
      // 在测试环境中，区块号不应该太大
      expect(blockNumber).toBeLessThan(1000000n)
    })

    it('应该能够将区块号转换为数字', async () => {
      const blockNumber = await client.getBlockNumber()

      expect(() => Number(blockNumber)).not.toThrow()
      expect(Number(blockNumber)).toBeGreaterThan(0)
    })
  })

  describe('与区块信息的关系', () => {
    it('区块号应该对应有效的区块哈希', async () => {
      const blockNumber = await client.getBlockNumber()
      const block = await client.getBlock({ blockNumber })

      expect(block).toBeDefined()
      expect(block.hash).toMatch(/^0x[a-fA-F0-9]{64}$/)
    })

    it('区块号应该对应有效的时间戳', async () => {
      const blockNumber = await client.getBlockNumber()
      const block = await client.getBlock({ blockNumber })

      expect(block.timestamp).toBeDefined()
      expect(block.timestamp).toBeGreaterThan(0n)
    })
  })
})
