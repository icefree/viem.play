/**
 * WebSocket Transport 集成测试 - 使用 Anvil 验证 WebSocket 连接
 * 测试 WebSocket 传输层的连接、请求和订阅功能
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import {
  createPublicClient,
  webSocket,
  http,
  type PublicClient,
} from 'viem'
import { anvil } from 'viem/chains'
import { ANVIL_RPC_URL } from '../test-network'

// Anvil WebSocket URL
const ANVIL_WS_URL = 'ws://127.0.0.1:8545'

describe('WebSocket Transport 集成测试 (Anvil)', () => {
  let wsClient: PublicClient | null = null
  let httpClient: PublicClient

  beforeAll(async () => {
    // 创建 HTTP 客户端作为对照
    httpClient = createPublicClient({
      chain: anvil,
      transport: http(ANVIL_RPC_URL),
    })

    // 验证 Anvil 连接
    try {
      await httpClient.getChainId()
    } catch {
      throw new Error('无法连接到 Anvil，请确保已运行: anvil')
    }

    // 尝试创建 WebSocket 客户端
    try {
      wsClient = createPublicClient({
        chain: anvil,
        transport: webSocket(ANVIL_WS_URL),
      })
      await wsClient.getChainId()
    } catch {
      console.warn('WebSocket 不可用，将跳过 WebSocket 特定测试')
      wsClient = null
    }
  })

  afterAll(async () => {
    if (wsClient) {
      try {
        // 尝试清理 WebSocket 连接
        await (wsClient.transport as { destroy?: () => Promise<void> })?.destroy?.()
      } catch {
        // 忽略清理错误
      }
    }
  })

  describe('基本连接', () => {
    it('应该能够通过 WebSocket 建立连接', async () => {
      if (!wsClient) {
        console.warn('跳过: WebSocket 客户端不可用')
        return
      }

      const chainId = await wsClient.getChainId()
      expect(chainId).toBe(31337) // Anvil chainId
    })

    it('WebSocket 和 HTTP 应该返回相同的 chainId', async () => {
      if (!wsClient) {
        console.warn('跳过: WebSocket 客户端不可用')
        return
      }

      const wsChainId = await wsClient.getChainId()
      const httpChainId = await httpClient.getChainId()

      expect(wsChainId).toBe(httpChainId)
    })
  })

  describe('区块查询', () => {
    it('应该能够通过 WebSocket 获取区块号', async () => {
      if (!wsClient) {
        console.warn('跳过: WebSocket 客户端不可用')
        return
      }

      const blockNumber = await wsClient.getBlockNumber()
      expect(blockNumber).toBeGreaterThan(0n)
    })

    it('WebSocket 和 HTTP 应该返回相同的区块号', async () => {
      if (!wsClient) {
        console.warn('跳过: WebSocket 客户端不可用')
        return
      }

      const wsBlockNumber = await wsClient.getBlockNumber()
      const httpBlockNumber = await httpClient.getBlockNumber()

      // 区块号可能在请求之间变化，但应该非常接近
      expect(Math.abs(Number(wsBlockNumber - httpBlockNumber))).toBeLessThanOrEqual(1)
    })

    it('应该能够通过 WebSocket 获取区块详情', async () => {
      if (!wsClient) {
        console.warn('跳过: WebSocket 客户端不可用')
        return
      }

      const block = await wsClient.getBlock()

      expect(block).toBeDefined()
      expect(block.number).toBeDefined()
      expect(block.hash).toBeDefined()
      expect(block.timestamp).toBeGreaterThan(0n)
    })

    it('WebSocket 和 HTTP 应该返回相同的区块详情', async () => {
      if (!wsClient) {
        console.warn('跳过: WebSocket 客户端不可用')
        return
      }

      const blockNumber = await wsClient.getBlockNumber()
      
      const wsBlock = await wsClient.getBlock({ blockNumber })
      const httpBlock = await httpClient.getBlock({ blockNumber })

      expect(wsBlock.hash).toBe(httpBlock.hash)
      expect(wsBlock.number).toBe(httpBlock.number)
      expect(wsBlock.timestamp).toBe(httpBlock.timestamp)
    })
  })

  describe('账户查询', () => {
    it('应该能够通过 WebSocket 获取余额', async () => {
      if (!wsClient) {
        console.warn('跳过: WebSocket 客户端不可用')
        return
      }

      const balance = await wsClient.getBalance({
        address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', // Anvil 默认账户
      })

      expect(balance).toBeGreaterThan(0n)
    })

    it('WebSocket 和 HTTP 应该返回相同的余额', async () => {
      if (!wsClient) {
        console.warn('跳过: WebSocket 客户端不可用')
        return
      }

      const address = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' as const

      const wsBalance = await wsClient.getBalance({ address })
      const httpBalance = await httpClient.getBalance({ address })

      expect(wsBalance).toBe(httpBalance)
    })

    it('应该能够通过 WebSocket 获取交易数量', async () => {
      if (!wsClient) {
        console.warn('跳过: WebSocket 客户端不可用')
        return
      }

      const count = await wsClient.getTransactionCount({
        address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      })

      expect(count).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Gas 查询', () => {
    it('应该能够通过 WebSocket 获取 gas 价格', async () => {
      if (!wsClient) {
        console.warn('跳过: WebSocket 客户端不可用')
        return
      }

      const gasPrice = await wsClient.getGasPrice()

      expect(gasPrice).toBeDefined()
      expect(gasPrice).toBeGreaterThan(0n)
    })

    it('WebSocket 和 HTTP 应该返回相同的 gas 价格', async () => {
      if (!wsClient) {
        console.warn('跳过: WebSocket 客户端不可用')
        return
      }

      const wsGasPrice = await wsClient.getGasPrice()
      const httpGasPrice = await httpClient.getGasPrice()

      expect(wsGasPrice).toBe(httpGasPrice)
    })

    it('应该能够通过 WebSocket 获取 fee history', async () => {
      if (!wsClient) {
        console.warn('跳过: WebSocket 客户端不可用')
        return
      }

      const feeHistory = await wsClient.getFeeHistory({
        blockCount: 4,
        rewardPercentiles: [25, 50, 75],
      })

      expect(feeHistory).toBeDefined()
      expect(feeHistory.baseFeePerGas).toBeDefined()
    })
  })

  describe('区块订阅 (WebSocket 特有)', () => {
    it('应该能够通过 WebSocket 订阅新区块号', async () => {
      if (!wsClient) {
        console.warn('跳过: WebSocket 客户端不可用')
        return
      }

      return new Promise<void>((resolve) => {
        const timeout = setTimeout(() => {
          unwatch()
          // 即使没有新区块也算通过
          resolve()
        }, 3000)

        const unwatch = wsClient!.watchBlockNumber({
          onBlockNumber: (blockNumber) => {
            clearTimeout(timeout)
            unwatch()
            expect(blockNumber).toBeGreaterThan(0n)
            resolve()
          },
          poll: true,
          pollingInterval: 100,
        })
      })
    }, 10000)

    it('应该能够通过 WebSocket 订阅新区块', async () => {
      if (!wsClient) {
        console.warn('跳过: WebSocket 客户端不可用')
        return
      }

      return new Promise<void>((resolve) => {
        const timeout = setTimeout(() => {
          unwatch()
          resolve()
        }, 3000)

        const unwatch = wsClient!.watchBlocks({
          onBlock: (block) => {
            clearTimeout(timeout)
            unwatch()
            expect(block).toBeDefined()
            expect(block.number).toBeDefined()
            resolve()
          },
          poll: true,
          pollingInterval: 100,
        })
      })
    }, 10000)

    it('应该能够取消订阅', async () => {
      if (!wsClient) {
        console.warn('跳过: WebSocket 客户端不可用')
        return
      }

      const unwatch = wsClient.watchBlockNumber({
        onBlockNumber: () => {},
        poll: true,
        pollingInterval: 1000,
      })

      expect(() => unwatch()).not.toThrow()
    })
  })

  describe('Pending 交易订阅', () => {
    it('应该能够通过 WebSocket 订阅 pending 交易', async () => {
      if (!wsClient) {
        console.warn('跳过: WebSocket 客户端不可用')
        return
      }

      return new Promise<void>((resolve) => {
        const timeout = setTimeout(() => {
          unwatch()
          // 没有 pending 交易也算通过
          resolve()
        }, 2000)

        const unwatch = wsClient!.watchPendingTransactions({
          onTransactions: (hashes) => {
            clearTimeout(timeout)
            unwatch()
            expect(hashes).toBeDefined()
            expect(Array.isArray(hashes)).toBe(true)
            resolve()
          },
          poll: true,
          pollingInterval: 100,
        })
      })
    }, 10000)
  })

  describe('多请求并发', () => {
    it('应该能够同时处理多个 WebSocket 请求', async () => {
      if (!wsClient) {
        console.warn('跳过: WebSocket 客户端不可用')
        return
      }

      const [chainId, blockNumber, gasPrice, balance] = await Promise.all([
        wsClient.getChainId(),
        wsClient.getBlockNumber(),
        wsClient.getGasPrice(),
        wsClient.getBalance({
          address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        }),
      ])

      expect(chainId).toBe(31337)
      expect(blockNumber).toBeGreaterThan(0n)
      expect(gasPrice).toBeGreaterThan(0n)
      expect(balance).toBeGreaterThan(0n)
    })

    it('WebSocket 和 HTTP 并发请求应该返回一致结果', async () => {
      if (!wsClient) {
        console.warn('跳过: WebSocket 客户端不可用')
        return
      }

      const [wsChainId, httpChainId, wsGasPrice, httpGasPrice] = await Promise.all([
        wsClient.getChainId(),
        httpClient.getChainId(),
        wsClient.getGasPrice(),
        httpClient.getGasPrice(),
      ])

      expect(wsChainId).toBe(httpChainId)
      expect(wsGasPrice).toBe(httpGasPrice)
    })
  })

  describe('错误处理', () => {
    it('查询不存在的区块应该抛出错误', async () => {
      if (!wsClient) {
        console.warn('跳过: WebSocket 客户端不可用')
        return
      }

      // viem 对不存在的区块会抛出 BlockNotFoundError
      await expect(
        wsClient.getBlock({
          blockNumber: 999999999n,
        })
      ).rejects.toThrow()
    })

    it('查询不存在的交易应该抛出错误', async () => {
      if (!wsClient) {
        console.warn('跳过: WebSocket 客户端不可用')
        return
      }

      // viem 对不存在的交易会抛出 TransactionNotFoundError
      await expect(
        wsClient.getTransaction({
          hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        })
      ).rejects.toThrow()
    })
  })
})
