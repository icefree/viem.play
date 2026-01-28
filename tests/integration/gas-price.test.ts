/**
 * GetGasPrice 节点集成测试 - 使用 Anvil 真实数据验证
 */
import { describe, it, expect, beforeAll } from 'vitest'
import { createTestClient } from '../test-network'
import type { PublicClient } from 'viem'

describe('GetGasPrice 集成测试 (Anvil)', () => {
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

  describe('getGasPrice', () => {
    it('应该返回有效的 gas 价格 (bigint)', async () => {
      const gasPrice = await client.getGasPrice()

      expect(typeof gasPrice).toBe('bigint')
      expect(gasPrice).toBeGreaterThan(0n)
    })

    it('gas 价格应该在合理范围内 (1 Gwei ~ 1000 Gwei)', async () => {
      const gasPrice = await client.getGasPrice()
      const oneGwei = 1000000000n
      const oneThousandGwei = 1000000000000n

      expect(gasPrice).toBeGreaterThanOrEqual(oneGwei)
      expect(gasPrice).toBeLessThanOrEqual(oneThousandGwei)
    })

    it('多次调用应该返回一致的 gas 价格', async () => {
      const gasPrice1 = await client.getGasPrice()
      const gasPrice2 = await client.getGasPrice()

      // Anvil 在没有新交易时 gas 价格应该保持一致
      expect(gasPrice1).toBe(gasPrice2)
    })

    it('gas 价格应该能被正确格式化为 Gwei', async () => {
      const gasPrice = await client.getGasPrice()
      const gasPriceInGwei = Number(gasPrice) / 1e9

      expect(gasPriceInGwei).toBeGreaterThan(0)
      expect(Number.isFinite(gasPriceInGwei)).toBe(true)
    })
  })

  describe('与区块数据的关系', () => {
    it('gas 价格应该与最新区块的 baseFeePerGas 相关联', async () => {
      const gasPrice = await client.getGasPrice()
      const block = await client.getBlock()

      // gasPrice 应该大于等于 baseFeePerGas (如果存在)
      if (block.baseFeePerGas) {
        expect(gasPrice).toBeGreaterThanOrEqual(block.baseFeePerGas)
      }
    })
  })
})
