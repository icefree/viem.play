/**
 * 集成测试配置 - 使用 Anvil 本地测试网
 */
import { createPublicClient, http, parseEther } from 'viem'
import { foundry } from 'viem/chains'

// Anvil 默认测试账户
export const TEST_ACCOUNTS = {
  deployer: {
    address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' as const,
    privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80' as const,
  },
} as const

// Anvil RPC URL
export const ANVIL_RPC_URL = 'http://127.0.0.1:8545'

// 创建连接 Anvil 的 PublicClient
export function createAnvilClient() {
  return createPublicClient({
    chain: foundry,
    transport: http(ANVIL_RPC_URL),
  })
}

// 预期测试数据
export const EXPECTED = {
  deployerBalance: parseEther('10000'), // 10000 ETH
}
