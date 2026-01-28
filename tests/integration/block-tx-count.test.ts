/**
 * GetBlockTransactionCount 节点集成测试 - 使用 Anvil 真实数据验证
 */
import { describe, it, expect, beforeAll } from 'vitest'
import { createTestClient } from '../test-network'
import type { PublicClient } from 'viem'

describe('GetBlockTransactionCount 集成测试 (Anvil)', () => {
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

  describe('getBlockTransactionCount', () => {
    it('应该返回最新区块的交易数量', async () => {
      const count = await client.getBlockTransactionCount()

      expect(typeof count).toBe('number')
      expect(count).toBeGreaterThanOrEqual(0)
    })

    it('通过区块号获取交易数量', async () => {
      const blockNumber = await client.getBlockNumber()
      const count = await client.getBlockTransactionCount({
        blockNumber,
      })

      expect(typeof count).toBe('number')
      expect(count).toBeGreaterThanOrEqual(0)
    })

    it('通过区块哈希获取交易数量', async () => {
      const block = await client.getBlock()
      const count = await client.getBlockTransactionCount({
        blockHash: block.hash,
      })

      expect(typeof count).toBe('number')
      expect(count).toBeGreaterThanOrEqual(0)
    })

    it('创世区块可能没有交易', async () => {
      const count = await client.getBlockTransactionCount({
        blockNumber: 0n,
      })

      expect(typeof count).toBe('number')
      // 创世区块通常没有交易
      expect(count).toBe(0)
    })

    it('交易数量应该与 getBlock 返回的交易列表长度一致', async () => {
      const blockNumber = await client.getBlockNumber()
      const count = await client.getBlockTransactionCount({
        blockNumber,
      })
      const block = await client.getBlock({
        blockNumber,
        includeTransactions: true,
      })

      expect(count).toBe(block.transactions.length)
    })
  })

  describe('使用不同的区块标签', () => {
    it('应该支持 latest 标签', async () => {
      const count = await client.getBlockTransactionCount({
        blockTag: 'latest',
      })

      expect(typeof count).toBe('number')
      expect(count).toBeGreaterThanOrEqual(0)
    })

    it('应该支持 earliest 标签', async () => {
      const count = await client.getBlockTransactionCount({
        blockTag: 'earliest',
      })

      expect(typeof count).toBe('number')
      // 创世区块通常没有交易
      expect(count).toBe(0)
    })

    it('应该支持 pending 标签', async () => {
      const count = await client.getBlockTransactionCount({
        blockTag: 'pending',
      })

      expect(typeof count).toBe('number')
      expect(count).toBeGreaterThanOrEqual(0)
    })

    it('应该支持 safe 标签', async () => {
      const count = await client.getBlockTransactionCount({
        blockTag: 'safe',
      })

      expect(typeof count).toBe('number')
      expect(count).toBeGreaterThanOrEqual(0)
    })

    it('应该支持 finalized 标签', async () => {
      const count = await client.getBlockTransactionCount({
        blockTag: 'finalized',
      })

      expect(typeof count).toBe('number')
      expect(count).toBeGreaterThanOrEqual(0)
    })
  })

  describe('数据一致性', () => {
    it('同一区块的交易数量应该保持一致', async () => {
      const blockNumber = await client.getBlockNumber()
      const count1 = await client.getBlockTransactionCount({
        blockNumber,
      })
      const count2 = await client.getBlockTransactionCount({
        blockNumber,
      })

      expect(count1).toBe(count2)
    })

    it('交易数量应该是合理的数值', async () => {
      const blockNumber = await client.getBlockNumber()
      const count = await client.getBlockTransactionCount({
        blockNumber,
      })

      // 在测试环境中，单个区块的交易数量不应该太多
      expect(count).toBeLessThan(1000n)
    })
  })
})
