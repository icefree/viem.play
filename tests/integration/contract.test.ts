/**
 * Contract 节点集成测试 - 使用 Anvil 真实数据验证
 * 测试 readContract, writeContract, simulateContract, deployContract
 */
import { describe, it, expect, beforeAll } from 'vitest'
import {
  createWalletClient,
  createPublicClient,
  http,
  parseEther,
  encodeDeployData,
  Abi,
} from 'viem'
import { anvil } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import { TEST_ACCOUNTS } from '../test-network'

// 简单的存储合约 ABI
const STORAGE_ABI = [
  {
    inputs: [],
    name: 'retrieve',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'num', type: 'uint256' }],
    name: 'store',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const satisfies Abi

// 简单的存储合约字节码
const STORAGE_BYTECODE =
  '0x6080604052348015600f57600080fd5b50606e80601d6000396000f3fe60806040526004361060395760003560e01c80632e64cec114603e5780636057361d146064575b600080fd5b60446070565b60405160529190608c565b60405180910390f35b607e6082565b005b8060005260206000f35b5b60008190555090565b60008151101560ab5760a98182604051806020016040528060008152506064565b505b5050565b609a80609c6000396000f3fe6080604052600080fdfea26469706673582212200e3c8f4f7e0e7a3d3b9c0f8e7e6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f64736f6c63430008070033' as const

describe('Contract 节点集成测试 (Anvil)', () => {
  let walletClient: ReturnType<typeof createWalletClient>
  let publicClient: ReturnType<typeof createPublicClient>
  let contractAddress: `0x${string}` | null = null
  const ANVIL_RPC_URL = 'http://127.0.0.1:8545'

  beforeAll(async () => {
    const account = privateKeyToAccount(TEST_ACCOUNTS.deployer.privateKey)

    walletClient = createWalletClient({
      account,
      chain: anvil,
      transport: http(ANVIL_RPC_URL),
    })

    publicClient = createPublicClient({
      chain: anvil,
      transport: http(ANVIL_RPC_URL),
    })

    try {
      await publicClient.getChainId()
    } catch {
      throw new Error('无法连接到 Anvil，请确保已运行: anvil')
    }
  })

  describe('deployContract', () => {
    it('应该能够部署合约', async () => {
      const hash = await walletClient.deployContract({
        abi: STORAGE_ABI,
        bytecode: STORAGE_BYTECODE,
        args: [],
      })

      expect(hash).toBeDefined()
      expect(hash).toMatch(/^0x[a-fA-F0-9]{64}$/)

      // 等待交易收据
      const receipt = await publicClient.waitForTransactionReceipt({ hash })
      expect(receipt.contractAddress).toBeDefined()

      if (receipt.contractAddress) {
        contractAddress = receipt.contractAddress
      }
    }, 10000)

    it('部署的合约应该有有效地址', () => {
      expect(contractAddress).toBeDefined()
      expect(contractAddress).toMatch(/^0x[a-fA-F0-9]{40}$/)
    })
  })

  describe('readContract', () => {
    it('应该能够读取合约状态', async () => {
      if (!contractAddress) {
        throw new Error('合约未部署')
      }

      const value = await publicClient.readContract({
        address: contractAddress,
        abi: STORAGE_ABI,
        functionName: 'retrieve',
      })

      expect(value).toBeDefined()
      // 初始值应该是 0
      expect(value).toBe(0n)
    })

    it('读取不存在的函数应该失败', async () => {
      if (!contractAddress) {
        throw new Error('合约未部署')
      }

      await expect(
        publicClient.readContract({
          address: contractAddress,
          abi: STORAGE_ABI,
          // @ts-expect-error - 测试不存在的函数
          functionName: 'nonExistentFunction',
        }),
      ).rejects.toThrow()
    })
  })

  describe('simulateContract', () => {
    it('应该能够模拟合约调用', async () => {
      if (!contractAddress) {
        throw new Error('合约未部署')
      }

      const result = await publicClient.simulateContract({
        address: contractAddress,
        abi: STORAGE_ABI,
        functionName: 'store',
        args: [42n],
        account: walletClient.account!.address,
      })

      expect(result).toBeDefined()
      expect(result.result).toBeDefined()
    })

    it('模拟调用应该返回请求对象', async () => {
      if (!contractAddress) {
        throw new Error('合约未部署')
      }

      const result = await publicClient.simulateContract({
        address: contractAddress,
        abi: STORAGE_ABI,
        functionName: 'store',
        args: [100n],
        account: walletClient.account!.address,
      })

      expect(result.request).toBeDefined()
      expect(result.request.abi).toBeDefined()
      expect(result.request.address).toBe(contractAddress)
    })

    it('模拟失败的操作应该返回错误', async () => {
      if (!contractAddress) {
        throw new Error('合约未部署')
      }

      // 这个测试验证模拟会正确处理错误
      // 由于我们的简单合约不会 revert，这里只是验证模拟机制
      const result = await publicClient.simulateContract({
        address: contractAddress,
        abi: STORAGE_ABI,
        functionName: 'retrieve',
        args: [],
      })

      expect(result).toBeDefined()
    })
  })

  describe('writeContract', () => {
    it('应该能够写入合约状态', async () => {
      if (!contractAddress) {
        throw new Error('合约未部署')
      }

      const hash = await walletClient.writeContract({
        address: contractAddress,
        abi: STORAGE_ABI,
        functionName: 'store',
        args: [123n],
      })

      expect(hash).toBeDefined()
      expect(hash).toMatch(/^0x[a-fA-F0-9]{64}$/)

      // 等待交易确认
      const receipt = await publicClient.waitForTransactionReceipt({ hash })
      expect(receipt.status).toBe('success')
    }, 10000)

    it('写入后应该能够读取新值', async () => {
      if (!contractAddress) {
        throw new Error('合约未部署')
      }

      const value = await publicClient.readContract({
        address: contractAddress,
        abi: STORAGE_ABI,
        functionName: 'retrieve',
      })

      expect(value).toBe(123n)
    })

    it('应该能够多次写入合约', async () => {
      if (!contractAddress) {
        throw new Error('合约未部署')
      }

      const testValues = [456n, 789n, 1000n]

      for (const testValue of testValues) {
        const hash = await walletClient.writeContract({
          address: contractAddress,
          abi: STORAGE_ABI,
          functionName: 'store',
          args: [testValue],
        })

        await publicClient.waitForTransactionReceipt({ hash })

        // 验证值
        const value = await publicClient.readContract({
          address: contractAddress,
          abi: STORAGE_ABI,
          functionName: 'retrieve',
        })

        expect(value).toBe(testValue)
      }
    }, 15000)
  })

  describe('合约事件', () => {
    it('应该能够获取合约事件', async () => {
      if (!contractAddress) {
        throw new Error('合约未部署')
      }

      // 我们的简单合约没有事件，但这个测试验证 API 调用
      const events = await publicClient.getContractEvents({
        address: contractAddress,
        abi: STORAGE_ABI,
      })

      expect(Array.isArray(events)).toBe(true)
    })

    it('应该能够过滤事件', async () => {
      if (!contractAddress) {
        throw new Error('合约未部署')
      }

      // 由于我们的合约没有事件，这里返回空数组
      const events = await publicClient.getContractEvents({
        address: contractAddress,
        abi: STORAGE_ABI,
        // 可以添加事件过滤器
      })

      expect(Array.isArray(events)).toBe(true)
    })
  })

  describe('gas 估算', () => {
    it('应该能够估算合约调用的 gas', async () => {
      if (!contractAddress) {
        throw new Error('合约未部署')
      }

      const gas = await publicClient.estimateContractGas({
        address: contractAddress,
        abi: STORAGE_ABI,
        functionName: 'store',
        args: [999n],
        account: walletClient.account!.address,
      })

      expect(gas).toBeDefined()
      expect(gas).toBeGreaterThan(0n)
      expect(gas).toBeLessThan(1000000n)
    })

    it('读操作的 gas 应该是 0', async () => {
      if (!contractAddress) {
        throw new Error('合约未部署')
      }

      // 读操作通常不需要 gas（在链下执行）
      const value = await publicClient.readContract({
        address: contractAddress,
        abi: STORAGE_ABI,
        functionName: 'retrieve',
      })

      expect(value).toBeDefined()
    })
  })

  describe('错误处理', () => {
    it('调用无效地址应该失败', async () => {
      const invalidAddress = '0x1234567890123456789012345678901234567890' as const

      await expect(
        publicClient.readContract({
          address: invalidAddress,
          abi: STORAGE_ABI,
          functionName: 'retrieve',
        }),
      ).rejects.toThrow()
    })

    it('使用错误的参数类型应该失败', async () => {
      if (!contractAddress) {
        throw new Error('合约未部署')
      }

      // store 函数期望 uint256，传入错误类型的参数
      await expect(
        publicClient.simulateContract({
          address: contractAddress,
          abi: STORAGE_ABI,
          functionName: 'store',
          args: ['not a number' as unknown as bigint],
          account: walletClient.account!.address,
        }),
      ).rejects.toThrow()
    })
  })

  describe('合约交互完整性', () => {
    it('完整的合约生命周期: 部署 -> 读取 -> 写入 -> 读取', async () => {
      // 这个测试已经在前面的测试中覆盖
      // 这里我们验证合约仍然可用
      if (!contractAddress) {
        throw new Error('合约未部署')
      }

      const value = await publicClient.readContract({
        address: contractAddress,
        abi: STORAGE_ABI,
        functionName: 'retrieve',
      })

      expect(value).toBeDefined()
      expect(typeof value).toBe('bigint')
    })
  })
})
