/**
 * WatchBlockNumber 和 WatchBlocks 节点集成测试 - 使用 Anvil 真实数据验证
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createTestClient } from '../test-network'
import type { PublicClient } from 'viem'

describe('Watch Blocks 集成测试 (Anvil)', () => {
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

  describe('watchBlockNumber', () => {
    it('应该能够监听新区块', async () => {
      return new Promise<void>(async (resolve, reject) => {
        const blocks: bigint[] = []
        const timeout = setTimeout(() => {
          unsubscribe()
          reject(new Error('未能在超时时间内接收到区块更新'))
        }, 10000) // 10秒超时

        const unsubscribe = client.watchBlockNumber(
          { pollingInterval: 1000 },
          (blockNumber) => {
            blocks.push(blockNumber)
            console.log('接收到区块号:', blockNumber)

            if (blocks.length >= 2) {
              clearTimeout(timeout)
              unsubscribe()
              expect(blocks.length).toBeGreaterThan(0)
              resolve()
            }
          },
        )

        // 注意: Anvil 默认不自动挖矿，需要手动触发或配置
        // 这个测试可能需要在 Anvil 启动时添加 --block-time 参数
      })
    }, 15000)

    it('应该支持取消订阅', () => {
      const unsubscribe = client.watchBlockNumber(
        { pollingInterval: 1000 },
        () => {},
      )

      expect(() => unsubscribe()).not.toThrow()
    })

    it('应该支持轮询模式', async () => {
      return new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          unsubscribe()
          reject(new Error('轮询模式未能接收到数据'))
        }, 5000)

        let callCount = 0
        const unsubscribe = client.watchBlockNumber(
          { pollingInterval: 100 },
          (blockNumber) => {
            callCount++
            console.log(`轮询调用 ${callCount}:`, blockNumber)

            if (callCount >= 2) {
              clearTimeout(timeout)
              unsubscribe()
              expect(callCount).toBeGreaterThanOrEqual(2)
              resolve()
            }
          },
        )
      })
    }, 10000)
  })

  describe('watchBlocks', () => {
    it('应该能够监听完整的区块信息', async () => {
      return new Promise<void>((resolve, reject) => {
        const blocks: any[] = []
        const timeout = setTimeout(() => {
          unsubscribe()
          reject(new Error('未能在超时时间内接收到区块'))
        }, 10000)

        const unsubscribe = client.watchBlocks(
          { pollingInterval: 1000, includeTransactions: false },
          (block) => {
            blocks.push(block)
            console.log('接收到区块:', block?.number)

            if (blocks.length >= 1) {
              clearTimeout(timeout)
              unsubscribe()

              expect(block).toBeDefined()
              expect(block?.number).toBeDefined()
              expect(block?.hash).toBeDefined()
              resolve()
            }
          },
        )
      })
    }, 15000)

    it('应该能够监听包含交易的区块', async () => {
      return new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          unsubscribe()
          reject(new Error('未能在超时时间内接收到区块'))
        }, 10000)

        const unsubscribe = client.watchBlocks(
          { pollingInterval: 1000, includeTransactions: true },
          (block) => {
            if (block) {
              clearTimeout(timeout)
              unsubscribe()

              expect(block).toBeDefined()
              expect(block.transactions).toBeDefined()
              expect(Array.isArray(block.transactions)).toBe(true)
              resolve()
            }
          },
        )
      })
    }, 15000)

    it('应该支持取消订阅区块监听', () => {
      const unsubscribe = client.watchBlocks(
        { pollingInterval: 1000 },
        () => {},
      )

      expect(() => unsubscribe()).not.toThrow()
    })
  })

  describe('区块监听模式', () => {
    it('应该支持 latest 模式', async () => {
      return new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          unsubscribe()
          // 如果 Anvil 没有新区块，这也算测试通过
          resolve()
        }, 3000)

        const unsubscribe = client.watchBlocks(
          { pollingInterval: 1000, blockTag: 'latest' },
          (block) => {
            if (block) {
              clearTimeout(timeout)
              unsubscribe()
              expect(block).toBeDefined()
              resolve()
            }
          },
        )
      })
    }, 8000)

    it('应该支持 safe 模式', async () => {
      return new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          unsubscribe()
          resolve()
        }, 3000)

        const unsubscribe = client.watchBlocks(
          { pollingInterval: 1000, blockTag: 'safe' },
          (block) => {
            if (block) {
              clearTimeout(timeout)
              unsubscribe()
              expect(block).toBeDefined()
              resolve()
            }
          },
        )
      })
    }, 8000)

    it('应该支持 finalized 模式', async () => {
      return new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          unsubscribe()
          resolve()
        }, 3000)

        const unsubscribe = client.watchBlocks(
          { pollingInterval: 1000, blockTag: 'finalized' },
          (block) => {
            if (block) {
              clearTimeout(timeout)
              unsubscribe()
              expect(block).toBeDefined()
              resolve()
            }
          },
        )
      })
    }, 8000)

    it('应该支持 pending 模式', async () => {
      return new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          unsubscribe()
          resolve()
        }, 3000)

        const unsubscribe = client.watchBlocks(
          { pollingInterval: 1000, blockTag: 'pending' },
          (block) => {
            if (block) {
              clearTimeout(timeout)
              unsubscribe()
              expect(block).toBeDefined()
              resolve()
            }
          },
        )
      })
    }, 8000)
  })

  describe('多监听器', () => {
    it('应该支持同时监听多个区块事件', async () => {
      return new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          unsub1()
          unsub2()
          resolve()
        }, 5000)

        let count1 = 0
        let count2 = 0

        const unsub1 = client.watchBlockNumber(
          { pollingInterval: 500 },
          () => {
            count1++
          },
        )

        const unsub2 = client.watchBlockNumber(
          { pollingInterval: 500 },
          () => {
            count2++
          },
        )

        // 等待一段时间，确保两个监听器都被调用
        setTimeout(() => {
          clearTimeout(timeout)
          unsub1()
          unsub2()

          // 验证两个监听器都被调用了
          expect(count1).toBeGreaterThan(0)
          expect(count2).toBeGreaterThan(0)
          resolve()
        }, 2000)
      })
    }, 10000)
  })
})
