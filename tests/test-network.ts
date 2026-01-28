/**
 * 集成测试配置 - 使用 Anvil 本地测试网
 */
import { createPublicClient, http, parseEther } from 'viem'
import { anvil } from 'viem/chains'

// Anvil 默认测试账户
export const TEST_ACCOUNTS = {
  deployer: {
    address: '0xa0ee7a142d267c1f36714e4a8f75612f20a79720' as const,
    privateKey: '0x2191ef87e392377ec08e7c08eb105ef5448eced5b2c88b2d1d1c4e4b8f7f1adf' as const,
  },
} as const

// Anvil RPC URL
export const ANVIL_RPC_URL = 'http://127.0.0.1:8545'

// 创建连接 Anvil 的 PublicClient
export function createAnvilClient() {
  return createPublicClient({
    chain: anvil,
    transport: http(ANVIL_RPC_URL),
  })
}

// 预期测试数据
export const EXPECTED = {
  deployerBalance: parseEther('10000'), // 10000 ETH
}
