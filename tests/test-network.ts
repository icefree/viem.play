/**
 * 集成测试配置 - 使用 Anvil 本地测试网
 */
import { createPublicClient, http, parseEther } from 'viem'
import { anvil } from 'viem/chains'

// Anvil 默认测试账户 (使用第一个账户,索引为0)
// 这些是 Anvil 的默认账户,参见 Foundry 文档
export const TEST_ACCOUNTS = {
  deployer: {
    // Anvil 账户 #0 (第一个默认账户)
    address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' as const,
    privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80' as const,
  },
  // 账户 #1
  account1: {
    address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8' as const,
    privateKey: '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d' as const,
  },
} as const

// Anvil RPC URL
export const ANVIL_RPC_URL = 'http://127.0.0.1:8545'

// 创建连接 Anvil 的 PublicClient
export function createTestClient() {
  return createPublicClient({
    chain: anvil,
    transport: http(ANVIL_RPC_URL),
  })
}

// 预期测试数据 (注意: 余额会因为之前的交易而减少)
export const EXPECTED = {
  deployerBalance: parseEther('10000'), // 10000 ETH (初始余额,实际可能因交易而减少)
}
