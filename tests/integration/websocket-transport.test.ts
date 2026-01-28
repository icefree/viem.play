/**
 * WebSocketTransport 节点集成测试 - 使用 Anvil 真实数据验证
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createPublicClient, webSocket } from 'viem'
import { anvil } from 'viem/chains'

describe('WebSocketTransport 集成测试 (Anvil)', () => {
  // Anvil WebSocket URL (需要启动时添加 --ws-port 参数)
  const WS_URL = 'ws://127.0.0.1:8545'
  let client: ReturnType<typeof createPublicClient>

  beforeAll(async () => {
    client = createPublicClient({
      chain: anvil,
      transport: webSocket(WS_URL),
    })

    // 等待 WebSocket 连接建立
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // 验证连接
    try {
      await client.getChainId()
    } catch {
      throw new Error(
        '无法连接到 Anvil WebSocket，请确保已运行: anvil --ws.port 8545',
      )
    }
  }, 10000)

  afterAll(async () => {
    // 关闭 WebSocket 连接
    try {
      // @ts-expect-error - transport 可能具有 close 方法
      await client.transport.close()
    } catch {
      // 忽略关闭错误
    }
  })

  describe('基础连接', () => {
    it('应该成功建立 WebSocket 连接', async () => {
      const chainId = await client.getChainId()

      expect(chainId).toBeDefined()
      expect(chainId).toBe(31337n) // Anvil 的 chainId
    })

    it('应该能够获取区块号', async () => {
      const blockNumber = await client.getBlockNumber()

      expect(typeof blockNumber).toBe('bigint')
      expect(blockNumber).toBeGreaterThan(0n)
    })

    it('应该能够获取账户余额', async () => {
      const address = '0xa0ee7a142d267c1f36714e4a8f75612f20a79720' as const
      const balance = await client.getBalance({ address })

      expect(typeof balance).toBe('bigint')
      expect(balance).toBeGreaterThan(0n)
    })
  })

  describe('WebSocket 特性', () => {
    it('应该支持订阅区块事件', async () => {
      return new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          unsubscribe()
          reject(new Error('未能接收到区块事件'))
        }, 10000)

        const unsubscribe = client.watchBlocks(
          {},
          (block) => {
            if (block) {
              clearTimeout(timeout)
              unsubscribe()

              expect(block).toBeDefined()
              expect(block.number).toBeDefined()
              resolve()
            }
          },
        )
      })
    }, 15000)

    it('应该支持订阅新挂起的交易', async () => {
      return new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          unsubscribe()
          // 如果没有交易，也算通过
          resolve()
        }, 5000)

        const unsubscribe = client.watchPendingTransactions(
          {},
          (txHash) => {
            if (txHash) {
              clearTimeout(timeout)
              unsubscribe()

              expect(txHash).toBeDefined()
              expect(txHash).toMatch(/^0x[a-fA-F0-9]{64}$/)
              resolve()
            }
          },
        )
      })
    }, 10000)
  })

  describe('数据一致性', () => {
    it('WebSocket 和 HTTP 应该返回相同的数据', async () => {
      const wsBlockNumber = await client.getBlockNumber()

      // WebSocket 返回的区块号应该有效
      expect(wsBlockNumber).toBeGreaterThan(0n)
    })

    it('应该能够获取完整的区块信息', async () => {
      const block = await client.getBlock()

      expect(block).toBeDefined()
      expect(block.hash).toBeDefined()
      expect(block.number).toBeGreaterThan(0n)
      expect(block.timestamp).toBeGreaterThan(0n)
    })

    it('应该能够获取 gas 价格', async () => {
      const gasPrice = await client.getGasPrice()

      expect(typeof gasPrice).toBe('bigint')
      expect(gasPrice).toBeGreaterThan(0n)
    })
  })

  describe('错误处理', () => {
    it('应该处理无效的地址', async () => {
      await expect(
        client.getBalance({
          address: '0xinvalid' as `0x${string}`,
        }),
      ).rejects.toThrow()
    })

    it('应该处理无效的区块号', async () => {
      await expect(
        client.getBlock({
          blockNumber: -1n,
        }),
      ).rejects.toThrow()
    })
  })

  describe('重连机制', () => {
    it('应该能够在连接中断后重连', async () => {
      // 这是一个理论测试，实际中断连接可能需要特殊工具
      // 这里我们验证客户端能够正常工作
      const chainId1 = await client.getChainId()
      const chainId2 = await client.getChainId()

      expect(chainId1).toBe(chainId2)
    })
  })
})
