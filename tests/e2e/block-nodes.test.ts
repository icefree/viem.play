/**
 * Block 节点集成测试 - 使用 Anvil 真实数据验证
 */
import { describe, it, expect, beforeAll } from 'vitest'
import { createAnvilClient, TEST_ACCOUNTS, EXPECTED } from './setup'
import type { PublicClient } from 'viem'

describe('Block 节点集成测试 (Anvil)', () => {
  let client: PublicClient

  beforeAll(async () => {
    client = createAnvilClient()
    
    // 验证 Anvil 连接
    try {
      await client.getChainId()
    } catch {
      throw new Error('无法连接到 Anvil，请确保已运行: anvil')
    }
  })

  describe('getBlockNumber', () => {
    it('应该返回有效的区块号 (bigint)', async () => {
      const blockNumber = await client.getBlockNumber()
      
      expect(typeof blockNumber).toBe('bigint')
      expect(blockNumber).toBeGreaterThanOrEqual(0n)
    })
  })

  describe('getBlock', () => {
    it('应该获取最新区块', async () => {
      const block = await client.getBlock()
      
      expect(block).toBeDefined()
      expect(block.number).toBeDefined()
      expect(block.hash).toBeDefined()
      expect(block.timestamp).toBeGreaterThan(0n)
    })

    it('应该通过区块号获取指定区块', async () => {
      const latestBlockNumber = await client.getBlockNumber()
      const block = await client.getBlock({ blockNumber: latestBlockNumber })
      
      expect(block.number).toBe(latestBlockNumber)
    })

    it('区块应包含正确的字段结构', async () => {
      const block = await client.getBlock()

      // 验证必需字段
      expect(block).toHaveProperty('number')
      expect(block).toHaveProperty('hash')
      expect(block).toHaveProperty('parentHash')
      expect(block).toHaveProperty('timestamp')
      expect(block).toHaveProperty('gasLimit')
      expect(block).toHaveProperty('gasUsed')
      expect(block).toHaveProperty('transactions')
    })
  })

  describe('getBlockTransactionCount', () => {
    it('应该返回区块中的交易数量', async () => {
      const count = await client.getBlockTransactionCount()
      
      expect(typeof count).toBe('number')
      expect(count).toBeGreaterThanOrEqual(0)
    })
  })

  describe('watchBlockNumber', () => {
    it('应该能够监听新区块号', async () => {
      return new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          unwatch()
          reject(new Error('监听超时'))
        }, 10000)

        const unwatch = client.watchBlockNumber({
          onBlockNumber: (blockNumber) => {
            clearTimeout(timeout)
            unwatch()
            
            expect(typeof blockNumber).toBe('bigint')
            resolve()
          },
          onError: (error) => {
            clearTimeout(timeout)
            unwatch()
            reject(error)
          },
          poll: true,
          pollingInterval: 1000,
        })
      })
    })
  })

  describe('watchBlocks', () => {
    it('应该能够监听新区块', async () => {
      return new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          unwatch()
          reject(new Error('监听超时'))
        }, 10000)

        const unwatch = client.watchBlocks({
          onBlock: (block) => {
            clearTimeout(timeout)
            unwatch()
            
            expect(block).toBeDefined()
            expect(block.number).toBeDefined()
            resolve()
          },
          onError: (error) => {
            clearTimeout(timeout)
            unwatch()
            reject(error)
          },
          poll: true,
          pollingInterval: 1000,
        })
      })
    })
  })

  // 验证 Mock 数据与真实数据的一致性
  describe('数据结构验证', () => {
    it('getBlockNumber 返回的 bigint 应可直接用于 getBlock', async () => {
      const blockNumber = await client.getBlockNumber()
      const block = await client.getBlock({ blockNumber })
      
      expect(block.number).toBe(blockNumber)
    })

    it('区块 timestamp 应为合理的 Unix 时间戳', async () => {
      const block = await client.getBlock()
      const timestampMs = Number(block.timestamp) * 1000
      const date = new Date(timestampMs)
      
      // 验证时间戳在合理范围内（2020年之后）
      expect(date.getFullYear()).toBeGreaterThanOrEqual(2020)
    })
  })

  // 测试账户验证
  describe('测试账户验证', () => {
    it('测试账户应有预期余额', async () => {
      const balance = await client.getBalance({
        address: TEST_ACCOUNTS.deployer.address,
      })
      
      expect(balance).toBe(EXPECTED.deployerBalance)
    })
  })
})
