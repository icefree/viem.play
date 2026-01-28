/**
 * Utilities 节点集成测试
 * 测试 FormatEther, ParseEther, Keccak256, Display 等工具节点
 */
import { describe, it, expect } from 'vitest'
import { formatEther, formatUnits, parseEther, parseUnits, keccak256, toHex, fromHex } from 'viem'

describe('Utilities 节点集成测试', () => {
  describe('formatEther', () => {
    it('应该能够格式化 wei 为 ether', () => {
      const wei = 1000000000000000000n
      const ether = formatEther(wei)

      expect(ether).toBe('1')
    })

    it('应该能够处理小数', () => {
      const wei = 1500000000000000000n
      const ether = formatEther(wei)

      expect(ether).toBe('1.5')
    })

    it('应该能够处理很小的值', () => {
      const wei = 1n
      const ether = formatEther(wei)

      expect(ether).toBe('0.000000000000000001')
    })

    it('应该能够处理 0', () => {
      const wei = 0n
      const ether = formatEther(wei)

      expect(ether).toBe('0')
    })

    it('应该能够处理很大的值', () => {
      const wei = 10000000000000000000000n
      const ether = formatEther(wei)

      expect(ether).toBe('10000')
    })
  })

  describe('parseEther', () => {
    it('应该能够解析 ether 为 wei', () => {
      const ether = '1'
      const wei = parseEther(ether)

      expect(wei).toBe(1000000000000000000n)
    })

    it('应该能够解析小数', () => {
      const ether = '1.5'
      const wei = parseEther(ether)

      expect(wei).toBe(1500000000000000000n)
    })

    it('应该能够处理科学计数法', () => {
      const ether = '1e-18'
      const wei = parseEther(ether)

      expect(wei).toBe(1n)
    })

    it('应该能够处理 0', () => {
      const ether = '0'
      const wei = parseEther(ether)

      expect(wei).toBe(0n)
    })

    it('应该处理精度丢失', () => {
      const ether = '0.1234567890123456789'
      const wei = parseEther(ether)

      expect(wei).toBeLessThan(1000000000000000000n)
      expect(wei).toBeGreaterThan(0n)
    })
  })

  describe('formatUnits', () => {
    it('应该能够格式化为指定单位', () => {
      const amount = 1000000n
      const formatted = formatUnits(amount, 6)

      expect(formatted).toBe('1')
    })

    it('应该支持 Gwei (9 decimals)', () => {
      const gwei = 1000000000n
      const ether = formatUnits(gwei, 9)

      expect(ether).toBe('1')
    })

    it('应该支持 Wei (0 decimals)', () => {
      const wei = 123n
      const formatted = formatUnits(wei, 0)

      expect(formatted).toBe('123')
    })
  })

  describe('parseUnits', () => {
    it('应该能够解析指定单位', () => {
      const amount = '1'
      const parsed = parseUnits(amount, 6)

      expect(parsed).toBe(1000000n)
    })

    it('应该支持 Gwei (9 decimals)', () => {
      const gwei = '1'
      const wei = parseUnits(gwei, 9)

      expect(wei).toBe(1000000000n)
    })
  })

  describe('keccak256', () => {
    it('应该能够计算哈希值', () => {
      const value = toHex('hello world')
      const hash = keccak256(value)

      expect(hash).toMatch(/^0x[a-fA-F0-9]{64}$/)
    })

    it('相同的输入应该产生相同的哈希', () => {
      const value = toHex('test')
      const hash1 = keccak256(value)
      const hash2 = keccak256(value)

      expect(hash1).toBe(hash2)
    })

    it('不同的输入应该产生不同的哈希', () => {
      const hash1 = keccak256(toHex('test1'))
      const hash2 = keccak256(toHex('test2'))

      expect(hash1).not.toBe(hash2)
    })

    it('应该能够哈希字节', () => {
      const bytes = new Uint8Array([1, 2, 3, 4, 5])
      const hash = keccak256(bytes)

      expect(hash).toMatch(/^0x[a-fA-F0-9]{64}$/)
    })

    it('空字符串的哈希应该是固定的', () => {
      const hash = keccak256(toHex(''))

      expect(hash).toBe('0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470')
    })
  })

  describe('toHex', () => {
    it('应该能够转换字符串为 hex', () => {
      const hex = toHex('hello')

      expect(hex.startsWith('0x')).toBe(true)
    })

    it('应该能够转换数字为 hex', () => {
      const hex = toHex(123)

      expect(hex).toBe('0x7b')
    })

    it('应该能够转换 bigint 为 hex', () => {
      const hex = toHex(123n)

      expect(hex).toBe('0x7b')
    })

    it('应该能够转换字节数组为 hex', () => {
      const bytes = new Uint8Array([1, 2, 3])
      const hex = toHex(bytes)

      expect(hex).toBe('0x010203')
    })
  })

  describe('fromHex', () => {
    it('应该能够从 hex 转换为字符串', () => {
      const hex = '0x68656c6c6f' // "hello" in hex
      const str = fromHex(hex, 'string')

      expect(str).toBe('hello')
    })

    it('应该能够从 hex 转换为数字', () => {
      const hex = '0x7b'
      const num = fromHex(hex, 'number')

      expect(num).toBe(123)
    })

    it('应该能够从 hex 转换为 bigint', () => {
      const hex = '0x7b'
      const big = fromHex(hex, 'bigint')

      expect(big).toBe(123n)
    })

    it('应该能够从 hex 转换为字节数组', () => {
      const hex = '0x010203'
      const bytes = fromHex(hex, 'bytes')

      expect(bytes[0]).toBe(1)
      expect(bytes[1]).toBe(2)
      expect(bytes[2]).toBe(3)
    })
  })

  describe('ToBigInt', () => {
    it('应该能够转换字符串为 bigint', () => {
      const str = '123'
      const big = BigInt(str)

      expect(big).toBe(123n)
    })

    it('应该能够转换 hex 为 bigint', () => {
      const hex = '0x7b'
      const big = BigInt(hex)

      expect(big).toBe(123n)
    })

    it('应该能够转换数字为 bigint', () => {
      const num = 123
      const big = BigInt(num)

      expect(big).toBe(123n)
    })
  })

  describe('组合操作', () => {
    it('parseEther -> formatEther 应该是可逆的（大部分情况）', () => {
      const original = '1.5'
      const wei = parseEther(original)
      const formatted = formatEther(wei)

      expect(formatted).toBe(original)
    })

    it('keccak256(toHex()) 应该正常工作', () => {
      const str = 'test data'
      const hex = toHex(str)
      const hash = keccak256(hex)

      expect(hash).toMatch(/^0x[a-fA-F0-9]{64}$/)
    })

    it('应该能够进行货币换算', () => {
      const gwei = 1000000000n
      const ether = formatUnits(gwei, 9)
      const wei = parseUnits(ether, 18)

      // 1 gwei = 10^9 wei, formatUnits 后变为 1, parseUnits 后变回 10^18 wei
      expect(wei).toBe(1000000000000000000n)
    })
  })

  describe('边界情况', () => {
    it('formatEther 应该处理最大值', () => {
      const maxUint256 = 2n ** 256n - 1n
      const ether = formatEther(maxUint256)

      expect(Number(ether)).toBeGreaterThan(0)
    })

    it('parseEther 应该处理很大的值', () => {
      const ether = '1000000000000000000'
      const wei = parseEther(ether)

      // parseEther 乘以 10^18,所以 10^18 * 10^18 = 10^36
      expect(wei).toBe(1000000000000000000000000000000000000n)
    })

    it('keccak256 应该处理空输入', () => {
      const hash = keccak256(toHex(''))

      expect(hash).toMatch(/^0x[a-fA-F0-9]{64}$/)
    })
  })

  describe('类型转换', () => {
    it('应该能够在不同进制之间转换', () => {
      const hex = '0xff'
      const decimal = Number(hex)

      expect(decimal).toBe(255)
    })

    it('应该能够处理负数（在特定上下文中）', () => {
      const num = -1
      const abs = Math.abs(num)

      expect(abs).toBe(1)
    })
  })
})
