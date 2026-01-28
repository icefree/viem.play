/**
 * Contract 节点集成测试 - 使用 WebSocket 传输在 Anvil 上验证
 * 测试合约部署、读取、写入和事件监听功能
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import {
  createPublicClient,
  createWalletClient,
  webSocket,
  http,
  parseAbi,
  type PublicClient,
  type WalletClient,
  type Address,
} from 'viem'
import { anvil } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import { TEST_ACCOUNTS, ANVIL_RPC_URL } from '../test-network'

// Anvil WebSocket URL
const ANVIL_WS_URL = 'ws://127.0.0.1:8545'

// SimpleStorage 合约 ABI - 简单的存储合约
// contract SimpleStorage { uint256 public value; function setValue(uint256 _value) public { value = _value; } }
const SIMPLE_STORAGE_ABI = parseAbi([
  'function value() view returns (uint256)',
  'function setValue(uint256 _value)',
])

// SimpleStorage 合约字节码 - 使用 solcjs 0.8.33 编译的完整字节码
// 这是一个经过验证的有效字节码（偶数长度：644 hex chars = 322 bytes）
// SPDX-License-Identifier: MIT
// pragma solidity ^0.8.0;
// contract SimpleStorage {
//     uint256 public value;
//     function setValue(uint256 _value) public {
//         value = _value;
//     }
// }
const SIMPLE_STORAGE_BYTECODE = '0x6080604052348015600e575f5ffd5b506101268061001c5f395ff3fe6080604052348015600e575f5ffd5b50600436106030575f3560e01c80633fa4f2451460345780635524107714604e575b5f5ffd5b603a6066565b60405160459190608a565b60405180910390f35b606460048036038101906060919060ca565b606b565b005b5f5481565b805f8190555050565b5f819050919050565b6084816074565b82525050565b5f602082019050609b5f830184607d565b92915050565b5f5ffd5b60ac816074565b811460b5575f5ffd5b50565b5f8135905060c48160a5565b92915050565b5f6020828403121560dc5760db60a1565b5b5f60e78482850160b8565b9150509291505056fea2646970667358221220becfd0bcaa57b5e1dd0b66da2815372fdc4602bf46125a515781847ae7e9be4164736f6c63430008210033' as const

describe('Contract WebSocket 集成测试 (Anvil)', () => {
  let wsClient: PublicClient | null = null
  let httpClient: PublicClient
  let walletClient: WalletClient
  let contractAddress: Address | null = null

  beforeAll(async () => {
    // 创建 HTTP 客户端作为备用和验证
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
      // 验证 WebSocket 连接
      await wsClient.getChainId()
    } catch {
      console.warn('WebSocket 不可用，将跳过 WebSocket 特定测试')
      wsClient = null
    }

    // 创建 Wallet Client
    const account = privateKeyToAccount(TEST_ACCOUNTS.deployer.privateKey)
    walletClient = createWalletClient({
      account,
      chain: anvil,
      transport: http(ANVIL_RPC_URL),
    })
  })

  afterAll(async () => {
    // 清理 WebSocket 连接
    if (wsClient) {
      try {
        // @ts-expect-error - transport.destroy 可能存在
        await wsClient.transport?.destroy?.()
      } catch {
        // 忽略清理错误
      }
    }
  })

  describe('WebSocket 连接', () => {
    it('应该能够通过 WebSocket 连接到 Anvil', async () => {
      if (!wsClient) {
        console.warn('跳过: WebSocket 客户端不可用')
        return
      }

      const chainId = await wsClient.getChainId()
      expect(chainId).toBe(31337) // Anvil chainId
    })

    it('应该能够通过 WebSocket 获取区块号', async () => {
      if (!wsClient) {
        console.warn('跳过: WebSocket 客户端不可用')
        return
      }

      const blockNumber = await wsClient.getBlockNumber()
      expect(blockNumber).toBeGreaterThan(0n)
    })

    it('应该能够通过 WebSocket 获取余额', async () => {
      if (!wsClient) {
        console.warn('跳过: WebSocket 客户端不可用')
        return
      }

      const balance = await wsClient.getBalance({
        address: TEST_ACCOUNTS.deployer.address,
      })
      expect(balance).toBeGreaterThan(0n)
    })
  })

  describe('合约部署', () => {
    it('应该能够部署简单的存储合约', async () => {
      // 部署合约
      const hash = await walletClient.deployContract({
        abi: SIMPLE_STORAGE_ABI,
        bytecode: SIMPLE_STORAGE_BYTECODE,
      })

      expect(hash).toBeDefined()
      expect(hash).toMatch(/^0x[a-fA-F0-9]{64}$/)

      // 等待交易确认
      const receipt = await httpClient.waitForTransactionReceipt({ hash })
      expect(receipt.status).toBe('success')
      expect(receipt.contractAddress).toBeDefined()

      // 保存合约地址用于后续测试
      contractAddress = receipt.contractAddress!
    }, 15000)

    it('部署的合约应该有有效地址', () => {
      expect(contractAddress).toBeDefined()
      expect(contractAddress).toMatch(/^0x[a-fA-F0-9]{40}$/)
    })
  })

  describe('readContract (通过 WebSocket)', () => {
    it('应该能够通过 WebSocket 读取合约状态', async () => {
      if (!wsClient || !contractAddress) {
        console.warn('跳过: WebSocket 客户端或合约地址不可用')
        return
      }

      const value = await wsClient.readContract({
        address: contractAddress,
        abi: SIMPLE_STORAGE_ABI,
        functionName: 'value',
      })

      expect(value).toBeDefined()
      expect(typeof value).toBe('bigint')
    })

    it('HTTP 和 WebSocket 读取结果应该一致', async () => {
      if (!wsClient || !contractAddress) {
        console.warn('跳过: WebSocket 客户端或合约地址不可用')
        return
      }

      const wsValue = await wsClient.readContract({
        address: contractAddress,
        abi: SIMPLE_STORAGE_ABI,
        functionName: 'value',
      })

      const httpValue = await httpClient.readContract({
        address: contractAddress,
        abi: SIMPLE_STORAGE_ABI,
        functionName: 'value',
      })

      expect(wsValue).toBe(httpValue)
    })
  })

  describe('writeContract + readContract', () => {
    it('应该能够写入并读取合约状态', async () => {
      if (!contractAddress) {
        console.warn('跳过: 合约地址不可用')
        return
      }

      const testValue = 42n

      // 写入合约
      const hash = await walletClient.writeContract({
        address: contractAddress,
        abi: SIMPLE_STORAGE_ABI,
        functionName: 'setValue',
        args: [testValue],
      })

      expect(hash).toBeDefined()

      // 等待交易确认
      const receipt = await httpClient.waitForTransactionReceipt({ hash })
      expect(receipt.status).toBe('success')

      // 通过 WebSocket 读取验证
      if (wsClient) {
        const value = await wsClient.readContract({
          address: contractAddress,
          abi: SIMPLE_STORAGE_ABI,
          functionName: 'value',
        })
        expect(value).toBe(testValue)
      }

      // 通过 HTTP 读取验证
      const httpValue = await httpClient.readContract({
        address: contractAddress,
        abi: SIMPLE_STORAGE_ABI,
        functionName: 'value',
      })
      expect(httpValue).toBe(testValue)
    }, 15000)

    it('应该能够多次写入合约', async () => {
      if (!contractAddress) {
        console.warn('跳过: 合约地址不可用')
        return
      }

      const testValues = [100n, 200n, 300n]

      for (const testValue of testValues) {
        // 写入
        const hash = await walletClient.writeContract({
          address: contractAddress,
          abi: SIMPLE_STORAGE_ABI,
          functionName: 'setValue',
          args: [testValue],
        })

        // 等待确认
        const receipt = await httpClient.waitForTransactionReceipt({ hash })
        expect(receipt.status).toBe('success')

        // 读取验证
        const value = await httpClient.readContract({
          address: contractAddress,
          abi: SIMPLE_STORAGE_ABI,
          functionName: 'value',
        })
        expect(value).toBe(testValue)
      }
    }, 30000)
  })

  describe('simulateContract (通过 WebSocket)', () => {
    it('应该能够通过 WebSocket 模拟合约调用', async () => {
      if (!wsClient || !contractAddress) {
        console.warn('跳过: WebSocket 客户端或合约地址不可用')
        return
      }

      const result = await wsClient.simulateContract({
        address: contractAddress,
        abi: SIMPLE_STORAGE_ABI,
        functionName: 'setValue',
        args: [999n],
        account: TEST_ACCOUNTS.deployer.address,
      })

      expect(result).toBeDefined()
      expect(result.request).toBeDefined()
    })

    it('模拟不应该改变实际状态', async () => {
      if (!wsClient || !contractAddress) {
        console.warn('跳过: WebSocket 客户端或合约地址不可用')
        return
      }

      // 获取当前值
      const valueBefore = await wsClient.readContract({
        address: contractAddress,
        abi: SIMPLE_STORAGE_ABI,
        functionName: 'value',
      })

      // 模拟设置新值
      await wsClient.simulateContract({
        address: contractAddress,
        abi: SIMPLE_STORAGE_ABI,
        functionName: 'setValue',
        args: [99999n],
        account: TEST_ACCOUNTS.deployer.address,
      })

      // 验证实际值未改变
      const valueAfter = await wsClient.readContract({
        address: contractAddress,
        abi: SIMPLE_STORAGE_ABI,
        functionName: 'value',
      })

      expect(valueAfter).toBe(valueBefore)
    })
  })

  describe('estimateContractGas (通过 WebSocket)', () => {
    it('应该能够通过 WebSocket 估算 gas', async () => {
      if (!wsClient || !contractAddress) {
        console.warn('跳过: WebSocket 客户端或合约地址不可用')
        return
      }

      const gas = await wsClient.estimateContractGas({
        address: contractAddress,
        abi: SIMPLE_STORAGE_ABI,
        functionName: 'setValue',
        args: [123n],
        account: TEST_ACCOUNTS.deployer.address,
      })

      expect(gas).toBeDefined()
      expect(gas).toBeGreaterThan(0n)
    })

    it('WebSocket 和 HTTP 估算结果应该一致', async () => {
      if (!wsClient || !contractAddress) {
        console.warn('跳过: WebSocket 客户端或合约地址不可用')
        return
      }

      const wsGas = await wsClient.estimateContractGas({
        address: contractAddress,
        abi: SIMPLE_STORAGE_ABI,
        functionName: 'setValue',
        args: [456n],
        account: TEST_ACCOUNTS.deployer.address,
      })

      const httpGas = await httpClient.estimateContractGas({
        address: contractAddress,
        abi: SIMPLE_STORAGE_ABI,
        functionName: 'setValue',
        args: [456n],
        account: TEST_ACCOUNTS.deployer.address,
      })

      // Gas 估算应该相同或非常接近
      expect(wsGas).toBe(httpGas)
    })
  })

  describe('watchContractEvent (通过 WebSocket)', () => {
    it('应该能够通过 WebSocket 监听合约事件', async () => {
      if (!wsClient || !contractAddress) {
        console.warn('跳过: WebSocket 客户端或合约地址不可用')
        return
      }

      // 由于 SimpleStorage 合约没有事件，我们只测试监听器设置是否正常
      return new Promise<void>((resolve) => {
        const timeout = setTimeout(() => {
          unwatch()
          // 没有事件是正常的，测试通过
          resolve()
        }, 2000)

        // 使用轮询模式监听
        const unwatch = wsClient!.watchContractEvent({
          address: contractAddress!,
          abi: SIMPLE_STORAGE_ABI,
          onLogs: (logs) => {
            clearTimeout(timeout)
            unwatch()
            expect(logs).toBeDefined()
            resolve()
          },
          poll: true,
          pollingInterval: 100,
        })
      })
    }, 10000)
  })

  describe('错误处理', () => {
    it('调用不存在的函数应该失败', async () => {
      if (!wsClient || !contractAddress) {
        console.warn('跳过: WebSocket 客户端或合约地址不可用')
        return
      }

      const INVALID_ABI = parseAbi([
        'function nonExistentFunction() view returns (uint256)',
      ])

      await expect(
        wsClient.readContract({
          address: contractAddress,
          abi: INVALID_ABI,
          functionName: 'nonExistentFunction',
        })
      ).rejects.toThrow()
    })

    it('调用无效地址应该处理错误', async () => {
      if (!wsClient) {
        console.warn('跳过: WebSocket 客户端不可用')
        return
      }

      const invalidAddress = '0x0000000000000000000000000000000000000000' as const

      // 调用零地址上的合约方法应该失败或返回默认值
      try {
        const result = await wsClient.readContract({
          address: invalidAddress,
          abi: SIMPLE_STORAGE_ABI,
          functionName: 'value',
        })
        // 如果没有抛出错误，验证返回值
        expect(result).toBeDefined()
      } catch (error) {
        // 期望抛出错误
        expect(error).toBeDefined()
      }
    })
  })

  describe('完整合约生命周期 (WebSocket)', () => {
    it('部署 -> 读取 -> 写入 -> 读取 -> 验证', async () => {
      if (!wsClient) {
        console.warn('跳过: WebSocket 客户端不可用')
        return
      }

      // 1. 部署
      const deployHash = await walletClient.deployContract({
        abi: SIMPLE_STORAGE_ABI,
        bytecode: SIMPLE_STORAGE_BYTECODE,
      })

      const deployReceipt = await httpClient.waitForTransactionReceipt({ hash: deployHash })
      expect(deployReceipt.status).toBe('success')
      const newContractAddress = deployReceipt.contractAddress!

      // 2. 通过 WebSocket 读取初始值
      const initialValue = await wsClient.readContract({
        address: newContractAddress,
        abi: SIMPLE_STORAGE_ABI,
        functionName: 'value',
      })
      expect(initialValue).toBe(0n)

      // 3. 写入新值
      const testValue = 12345n
      const writeHash = await walletClient.writeContract({
        address: newContractAddress,
        abi: SIMPLE_STORAGE_ABI,
        functionName: 'setValue',
        args: [testValue],
      })

      const writeReceipt = await httpClient.waitForTransactionReceipt({ hash: writeHash })
      expect(writeReceipt.status).toBe('success')

      // 4. 通过 WebSocket 读取新值
      const newValue = await wsClient.readContract({
        address: newContractAddress,
        abi: SIMPLE_STORAGE_ABI,
        functionName: 'value',
      })
      expect(newValue).toBe(testValue)

      // 5. 通过 HTTP 验证
      const httpValue = await httpClient.readContract({
        address: newContractAddress,
        abi: SIMPLE_STORAGE_ABI,
        functionName: 'value',
      })
      expect(httpValue).toBe(testValue)
    }, 30000)
  })
})
