/**
 * GetTransactionCount 节点集成测试 - 使用 Anvil 真实数据验证
 */
import { describe, it, expect, beforeAll } from 'vitest'
import { createTestClient, TEST_ACCOUNTS } from '../test-network'
import type { PublicClient } from 'viem'

describe('GetTransactionCount 集成测试 (Anvil)', () => {
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

  describe('getTransactionCount (nonce)', () => {
    it('应该返回指定地址的交易计数 (nonce)', async () => {
      const count = await client.getTransactionCount({
        address: TEST_ACCOUNTS.deployer.address,
      })

      expect(typeof count).toBe('number')
      expect(count).toBeGreaterThanOrEqual(0)
    })

    it('新账户的 nonce 应该是 0', async () => {
      const randomAddress = '0x1234567890123456789012345678901234567890' as const
      const count = await client.getTransactionCount({
        address: randomAddress,
      })

      expect(count).toBe(0)
    })

    it('应该支持 latest 标签 (默认)', async () => {
      const count = await client.getTransactionCount({
        address: TEST_ACCOUNTS.deployer.address,
        blockTag: 'latest',
      })

      expect(typeof count).toBe('number')
      expect(count).toBeGreaterThanOrEqual(0)
    })

    it('应该支持 pending 标签', async () => {
      const count = await client.getTransactionCount({
        address: TEST_ACCOUNTS.deployer.address,
        blockTag: 'pending',
      })

      expect(typeof count).toBe('number')
      expect(count).toBeGreaterThanOrEqual(0)
    })

    it('通过区块号获取历史 nonce', async () => {
      const currentBlock = await client.getBlockNumber()

      // 获取当前 nonce
      const currentCount = await client.getTransactionCount({
        address: TEST_ACCOUNTS.deployer.address,
        blockNumber: currentBlock,
      })

      // 获取前一个区块的 nonce
      const previousCount = await client.getTransactionCount({
        address: TEST_ACCOUNTS.deployer.address,
        blockNumber: currentBlock - 1n,
      })

      // 当前 nonce 应该大于或等于历史 nonce
      expect(currentCount).toBeGreaterThanOrEqual(previousCount)
    })
  })

  describe('nonce 行为特征', () => {
    it('同一地址的 nonce 在同一区块应该一致', async () => {
      const blockNumber = await client.getBlockNumber()

      const count1 = await client.getTransactionCount({
        address: TEST_ACCOUNTS.deployer.address,
        blockNumber,
      })

      const count2 = await client.getTransactionCount({
        address: TEST_ACCOUNTS.deployer.address,
        blockNumber,
      })

      expect(count1).toBe(count2)
    })

    it('不同地址的 nonce 应该独立', async () => {
      const address1 = TEST_ACCOUNTS.deployer.address
      const address2 = '0x1234567890123456789012345678901234567890' as const

      const count1 = await client.getTransactionCount({ address: address1 })
      const count2 = await client.getTransactionCount({ address: address2 })

      // 两个 nonce 应该是独立的值
      // address2 是新地址，nonce 应该是 0
      expect(count2).toBe(0)
      // address1 和 address2 的 nonce 应该不同（除非都是 0，这也是可能的）
      if (count1 !== 0) {
        expect(count1).not.toBe(count2)
      }
    })

    it('nonce 应该是合理的数值范围', async () => {
      const count = await client.getTransactionCount({
        address: TEST_ACCOUNTS.deployer.address,
      })

      // 在测试环境中，nonce 不应该太大
      expect(count).toBeLessThan(1000000)
    })
  })

  describe('与交易发送的关系', () => {
    it('deployer 账户应该有初始 nonce', async () => {
      const count = await client.getTransactionCount({
        address: TEST_ACCOUNTS.deployer.address,
      })

      // Anvil 的默认账户可能已经有交易
      expect(count).toBeGreaterThanOrEqual(0)
    })

    it('zero 地址的 nonce 应该是 0', async () => {
      const zeroAddress = '0x0000000000000000000000000000000000000000' as const
      const count = await client.getTransactionCount({
        address: zeroAddress,
      })

      expect(count).toBe(0)
    })
  })

  describe('区块标签支持', () => {
    it('应该支持 earliest 标签', async () => {
      const count = await client.getTransactionCount({
        address: TEST_ACCOUNTS.deployer.address,
        blockTag: 'earliest',
      })

      expect(typeof count).toBe('number')
      // 在创世区块，所有账户的 nonce 都应该是 0
      expect(count).toBe(0)
    })

    it('应该支持 safe 标签', async () => {
      const count = await client.getTransactionCount({
        address: TEST_ACCOUNTS.deployer.address,
        blockTag: 'safe',
      })

      expect(typeof count).toBe('number')
      expect(count).toBeGreaterThanOrEqual(0)
    })

    it('应该支持 finalized 标签', async () => {
      const count = await client.getTransactionCount({
        address: TEST_ACCOUNTS.deployer.address,
        blockTag: 'finalized',
      })

      expect(typeof count).toBe('number')
      expect(count).toBeGreaterThanOrEqual(0)
    })
  })
})
