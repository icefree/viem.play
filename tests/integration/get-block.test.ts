/**
 * GetBlock 节点集成测试 - 使用 Anvil 真实数据验证
 */
import { describe, it, expect, beforeAll } from 'vitest'
import { createTestClient } from '../test-network'
import type { PublicClient } from 'viem'

describe('GetBlock 集成测试 (Anvil)', () => {
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

  describe('getBlock', () => {
    it('应该返回最新的区块信息', async () => {
      const block = await client.getBlock()

      expect(block).toBeDefined()
      expect(block.number).toBeGreaterThanOrEqual(0n)
      expect(block.hash).toBeDefined()
      expect(block.timestamp).toBeGreaterThan(0n)
    })

    it('应该返回包含交易列表的区块', async () => {
      const block = await client.getBlock({ includeTransactions: true })

      expect(block.transactions).toBeDefined()
      expect(Array.isArray(block.transactions)).toBe(true)
    })

    it('通过区块号获取特定区块', async () => {
      const latestBlock = await client.getBlock()
      const block = await client.getBlock({
        blockNumber: latestBlock.number - 1n,
      })

      expect(block).toBeDefined()
      expect(block.number).toBe(latestBlock.number - 1n)
    })

    it('通过区块哈希获取特定区块', async () => {
      const latestBlock = await client.getBlock()
      const block = await client.getBlock({
        blockHash: latestBlock.hash,
      })

      expect(block).toBeDefined()
      expect(block.hash).toBe(latestBlock.hash)
    })

    it('区块应该包含 baseFeePerGas (EIP-1559)', async () => {
      const block = await client.getBlock()

      expect(block.baseFeePerGas).toBeDefined()
      expect(typeof block.baseFeePerGas).toBe('bigint')
    })

    it('区块应该包含 gasLimit 和 gasUsed', async () => {
      const block = await client.getBlock()

      expect(block.gasLimit).toBeDefined()
      expect(block.gasUsed).toBeDefined()
      expect(block.gasLimit).toBeGreaterThan(block.gasUsed)
    })

    it('区块应该包含矿工地址', async () => {
      const block = await client.getBlock()

      expect(block.miner).toBeDefined()
      expect(block.miner).toMatch(/^0x[a-fA-F0-9]{40}$/)
    })

    it('区块应该包含父哈希', async () => {
      const block = await client.getBlock()

      expect(block.parentHash).toBeDefined()
      expect(block.parentHash).toMatch(/^0x[a-fA-F0-9]{64}$/)
    })

    it('区块时间戳应该是合理的', async () => {
      const block = await client.getBlock()
      const now = Math.floor(Date.now() / 1000)

      // Anvil 的区块时间戳应该接近当前时间
      expect(Number(block.timestamp)).toBeLessThanOrEqual(now)
      expect(Number(block.timestamp)).toBeGreaterThan(now - 3600) // 1小时内
    })
  })

  describe('getBlockTag', () => {
    it('应该支持 earliest 标签', async () => {
      const block = await client.getBlock({ blockTag: 'earliest' })

      expect(block).toBeDefined()
      expect(block.number).toBe(0n)
    })

    it('应该支持 latest 标签 (默认)', async () => {
      const latestBlock = await client.getBlock({ blockTag: 'latest' })
      const defaultBlock = await client.getBlock()

      expect(latestBlock.number).toBe(defaultBlock.number)
    })

    it('应该支持 safe 标签', async () => {
      const block = await client.getBlock({ blockTag: 'safe' })

      expect(block).toBeDefined()
      expect(block.number).toBeGreaterThanOrEqual(0n)
    })

    it('应该支持 finalized 标签', async () => {
      const block = await client.getBlock({ blockTag: 'finalized' })

      expect(block).toBeDefined()
      expect(block.number).toBeGreaterThanOrEqual(0n)
    })

    it('应该支持 pending 标签', async () => {
      const block = await client.getBlock({ blockTag: 'pending' })

      expect(block).toBeDefined()
    })
  })

  describe('区块交易计数', () => {
    it('应该能够获取区块的交易数量', async () => {
      const block = await client.getBlock()
      const transactionCount = await client.getBlockTransactionCount({
        blockNumber: block.number,
      })

      expect(transactionCount).toBeDefined()
      expect(typeof transactionCount).toBe('bigint')
      // 创世区块可能有0笔交易
      expect(transactionCount).toBeGreaterThanOrEqual(0n)
    })
  })
})
