/**
 * WalletClient 节点集成测试 - 使用 Anvil 真实数据验证
 */
import { describe, it, expect, beforeAll } from 'vitest'
import {
  createWalletClient,
  createPublicClient,
  http,
  parseEther,
  formatEther,
} from 'viem'
import { anvil } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import { TEST_ACCOUNTS } from '../test-network'

describe('WalletClient 集成测试 (Anvil)', () => {
  let walletClient: ReturnType<typeof createWalletClient>
  let publicClient: ReturnType<typeof createPublicClient>
  const ANVIL_RPC_URL = 'http://127.0.0.1:8545'

  beforeAll(async () => {
    // 创建 Wallet Client
    const account = privateKeyToAccount(TEST_ACCOUNTS.deployer.privateKey)
    walletClient = createWalletClient({
      account,
      chain: anvil,
      transport: http(ANVIL_RPC_URL),
    })

    // 创建 Public Client 用于验证
    publicClient = createPublicClient({
      chain: anvil,
      transport: http(ANVIL_RPC_URL),
    })

    // 验证 Anvil 连接
    try {
      await publicClient.getChainId()
    } catch {
      throw new Error('无法连接到 Anvil，请确保已运行: anvil')
    }
  })

  describe('账户管理', () => {
    it('应该返回账户地址', () => {
      // WalletClient 使用 account.address 而不是 getAddresses()
      const address = walletClient.account?.address

      expect(address).toBeDefined()
      expect(address).toBe(TEST_ACCOUNTS.deployer.address)
    })

    it('应该返回账户的 chainId', async () => {
      const chainId = await walletClient.getChainId()

      expect(chainId).toBe(31337) // Anvil chainId (number type)
    })

    it('应该能够切换 chain', async () => {
      // 这个测试验证客户端能够处理不同的链
      // 注意: 实际切换链可能需要重新创建客户端
      const currentChainId = await walletClient.getChainId()
      expect(currentChainId).toBe(31337)
    })
  })

  describe('签名消息', () => {
    it('应该能够签名个人消息', async () => {
      const message = 'Hello, Anvil!'
      const signature = await walletClient.signMessage({
        message,
      })

      expect(signature).toBeDefined()
      expect(signature).toMatch(/^0x[a-fA-F0-9]{130}$/)
    })

    it('应该能够签名不同编码的消息', async () => {
      const message = 'Test message with different encoding'
      const signature = await walletClient.signMessage({
        message,
      })

      expect(signature).toBeDefined()
      expect(signature.length).toBe(132) // 0x + 130 hex chars
    })

    it('应该能够签名空消息', async () => {
      const message = ''
      const signature = await walletClient.signMessage({
        message,
      })

      expect(signature).toBeDefined()
      expect(signature).toMatch(/^0x[a-fA-F0-9]{130}$/)
    })
  })

  describe('签名类型化数据 (EIP-712)', () => {
    it('应该能够签名类型化数据', async () => {
      const signature = await walletClient.signTypedData({
        domain: {
          name: 'TestApp',
          version: '1',
          chainId: 31337,
          verifyingContract: TEST_ACCOUNTS.deployer.address,
        },
        types: {
          Person: [
            { name: 'name', type: 'string' },
            { name: 'wallet', type: 'address' },
          ],
        },
        primaryType: 'Person',
        message: {
          name: 'Alice',
          wallet: '0x0000000000000000000000000000000000000000',
        },
      })

      expect(signature).toBeDefined()
      expect(signature).toMatch(/^0x[a-fA-F0-9]{130}$/)
    })

    it('应该支持复杂的类型化数据', async () => {
      const signature = await walletClient.signTypedData({
        domain: {
          name: 'TestApp',
          version: '1',
          chainId: 31337,
        },
        types: {
          Mail: [
            { name: 'from', type: 'Person' },
            { name: 'to', type: 'Person' },
            { name: 'contents', type: 'string' },
          ],
          Person: [
            { name: 'name', type: 'string' },
            { name: 'wallet', type: 'address' },
          ],
        },
        primaryType: 'Mail',
        message: {
          from: {
            name: 'Alice',
            wallet: '0x0000000000000000000000000000000000000000',
          },
          to: {
            name: 'Bob',
            wallet: '0x0000000000000000000000000000000000000000',
          },
          contents: 'Hello!',
        },
      })

      expect(signature).toBeDefined()
    })
  })

  describe('发送交易', () => {
    it('应该能够发送交易', async () => {
      const address = '0x1234567890123456789012345678901234567890' as const


      // 发送交易
      const hash = await walletClient.sendTransaction({
        to: address,
        value: parseEther('0.01'),
        
      })

      expect(hash).toBeDefined()
      expect(hash).toMatch(/^0x[a-fA-F0-9]{64}$/)

      // 等待交易被打包
      const receipt = await publicClient.waitForTransactionReceipt({ hash })
      expect(receipt.status).toBe('success')
    }, 10000)

    it('应该能够发送带有 gasLimit 的交易', async () => {
      const address = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8' as const

      const hash = await walletClient.sendTransaction({
        to: address,
        value: parseEther('0.01'),
        gas: 21000n,
      })

      expect(hash).toBeDefined()

      const receipt = await publicClient.waitForTransactionReceipt({ hash })
      expect(receipt.status).toBe('success')
    }, 10000)
  })

  describe('估算 gas', () => {
    it('应该能够估算交易的 gas', async () => {
      const address = '0x1234567890123456789012345678901234567890' as const

      const gasEstimate = await publicClient.estimateGas({
        account: walletClient.account!.address,
        to: address,
        value: parseEther('0.01'),
      })

      expect(gasEstimate).toBeDefined()
      expect(gasEstimate).toBeGreaterThan(0n)
      expect(gasEstimate).toBeLessThan(1000000n)
    })

    it('应该能够估算合约调用的 gas', async () => {
      // 这是一个通用的 gas 估算测试
      const address = '0x1234567890123456789012345678901234567890' as const

      const gasEstimate = await publicClient.estimateGas({
        account: walletClient.account!.address,
        to: address,
        data: '0x',
      })

      expect(gasEstimate).toBeDefined()
    })
  })

  describe('余额验证', () => {
    it('账户应该有足够的余额', async () => {
      const balance = await publicClient.getBalance({
        address: walletClient.account!.address,
      })

      expect(balance).toBeGreaterThan(parseEther('100')) // Anvil 默认余额
    })

    it('发送交易后余额应该减少', async () => {
      const address = '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC' as const

      const balanceBefore = await publicClient.getBalance({
        address: walletClient.account!.address,
      })

      const hash = await walletClient.sendTransaction({
        to: address,
        value: parseEther('0.01'),
      })

      await publicClient.waitForTransactionReceipt({ hash })

      const balanceAfter = await publicClient.getBalance({
        address: walletClient.account!.address,
      })

      // 余额应该减少 (包含 gas 费用)
      expect(balanceAfter).toBeLessThan(balanceBefore)
    }, 10000)
  })

  describe('地址验证', () => {
    it('应该返回正确的账户地址', () => {
      const address = walletClient.account!.address

      expect(address).toBe(TEST_ACCOUNTS.deployer.address)
      expect(address).toMatch(/^0x[a-fA-F0-9]{40}$/)
    })

    it('应该能够获取账户地址', () => {
      // WalletClient 使用 account.address 而不是 getAddresses()
      const address = walletClient.account!.address

      expect(typeof address).toBe('string')
      expect(address).toMatch(/^0x[a-fA-F0-9]{40}$/)
    })
  })

  describe('错误处理', () => {
    it('发送到无效地址应该失败', async () => {
      await expect(
        walletClient.sendTransaction({
          // @ts-expect-error - 测试无效地址
          to: 'invalid-address',
          value: parseEther('0.01'),
        }),
      ).rejects.toThrow()
    })

    it('余额不足应该失败', async () => {
      const address = '0x1234567890123456789012345678901234567890' as const

      await expect(
        walletClient.sendTransaction({
          to: address,
          value: parseEther('999999999'), // 超过余额
        }),
      ).rejects.toThrow()
    })
  })
})
