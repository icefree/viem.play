/**
 * 测试工具函数
 */
import { vi } from 'vitest'
import type { PublicClient, Block } from 'viem'

/**
 * 创建模拟的 PublicClient
 */
export function createMockPublicClient(overrides: Partial<PublicClient> = {}): PublicClient {
  return {
    getBlockNumber: vi.fn().mockResolvedValue(12345678n),
    getBlock: vi.fn().mockResolvedValue({
      number: 12345678n,
      hash: '0xabc123def456...',
      timestamp: 1700000000n,
      transactions: [],
      gasLimit: 30000000n,
      gasUsed: 15000000n,
      baseFeePerGas: 1000000000n,
    } as unknown as Block),
    getBlockTransactionCount: vi.fn().mockResolvedValue(100),
    watchBlockNumber: vi.fn().mockReturnValue(() => {}),
    watchBlocks: vi.fn().mockReturnValue(() => {}),
    ...overrides,
  } as unknown as PublicClient
}

/**
 * 创建模拟区块
 */
export function createMockBlock(overrides: Partial<Block> = {}): Block {
  return {
    number: 12345678n,
    hash: '0xabc123def456...',
    parentHash: '0xparent...',
    timestamp: 1700000000n,
    nonce: '0x0000000000000000',
    difficulty: 0n,
    gasLimit: 30000000n,
    gasUsed: 15000000n,
    miner: '0x0000000000000000000000000000000000000000',
    extraData: '0x',
    size: 1000n,
    baseFeePerGas: 1000000000n,
    logsBloom: '0x',
    receiptsRoot: '0x',
    sha3Uncles: '0x',
    stateRoot: '0x',
    transactionsRoot: '0x',
    transactions: [],
    uncles: [],
    totalDifficulty: 0n,
    blobGasUsed: 0n,
    excessBlobGas: 0n,
    mixHash: '0x',
    withdrawals: [],
    withdrawalsRoot: '0x',
    ...overrides,
  } as unknown as Block
}

/**
 * 模拟节点输入数据
 */
export function mockNodeInputs<T extends { getInputData: (index: number) => unknown }>(
  node: T,
  inputs: Record<number, unknown>
) {
  const originalGetInputData = node.getInputData.bind(node)
  node.getInputData = vi.fn((index: number) => {
    if (index in inputs) {
      return inputs[index]
    }
    return originalGetInputData(index)
  })
}
