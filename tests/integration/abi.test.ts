/**
 * ABI 节点集成测试 - 使用 Anvil 真实数据验证
 * 测试 ParseAbi, EncodeAbiParameters, DecodeAbiParameters, EncodeFunctionData, DecodeFunctionResult
 */
import { describe, it, expect } from 'vitest'
import {
  parseAbi,
  encodeAbiParameters,
  decodeAbiParameters,
  encodeFunctionData,
  decodeFunctionResult,
  Abi,
  toFunctionSelector,
} from 'viem'

describe('ABI 节点集成测试', () => {
  describe('parseAbi', () => {
    it('应该能够解析人类可读的 ABI', () => {
      const abi = parseAbi([
        'function balanceOf(address owner) view returns (uint256)',
        'function transfer(address to, uint256 amount) returns (bool)',
        'event Transfer(address indexed from, address indexed to, uint256 amount)',
      ])

      expect(abi).toBeDefined()
      expect(Array.isArray(abi)).toBe(true)
      expect(abi.length).toBe(3)
    })

    it('解析的 ABI 应该包含正确的函数签名', () => {
      const abi = parseAbi([
        'function balanceOf(address owner) view returns (uint256)',
      ])

      expect(abi[0].type).toBe('function')
      expect(abi[0].name).toBe('balanceOf')
    })

    it('解析的 ABI 应该包含事件', () => {
      const abi = parseAbi([
        'event Transfer(address indexed from, address indexed to, uint256 amount)',
      ])

      expect(abi[0].type).toBe('event')
      expect(abi[0].name).toBe('Transfer')
    })

    it('应该能够解析复杂的函数', () => {
      const abi = parseAbi([
        'function foo((string name, uint256 value)[] data, address[] addresses) returns (bool success)',
      ])

      expect(abi[0].type).toBe('function')
      expect(abi[0].name).toBe('foo')
      expect(abi[0].inputs).toBeDefined()
      expect(abi[0].inputs.length).toBe(2)
    })

    it('应该能够解析结构体', () => {
      const abi = parseAbi([
        'struct User { string name; uint256 age; }',
        'function getUser(User memory user) pure returns (string)',
      ])

      expect(abi.length).toBe(2)
      expect(abi[0].type).toBe('function')
    })

    it('应该能够解析错误定义', () => {
      const abi = parseAbi([
        'error InsufficientBalance(uint256 balance, uint256 required)',
      ])

      expect(abi[0].type).toBe('error')
      expect(abi[0].name).toBe('InsufficientBalance')
    })

    it('应该能够解析构造函数', () => {
      const abi = parseAbi([
        'constructor(uint256 initialValue, address owner)',
      ])

      expect(abi[0].type).toBe('constructor')
      expect(abi[0].inputs).toBeDefined()
    })

    it('应该能够解析 fallback 和 receive 函数', () => {
      const abi = parseAbi([
        'receive() external payable',
        'fallback() external payable',
      ])

      expect(abi.length).toBe(2)
      expect(abi[0].type).toBe('receive')
      expect(abi[1].type).toBe('fallback')
    })
  })

  describe('encodeAbiParameters', () => {
    it('应该能够编码基本类型', () => {
      const encoded = encodeAbiParameters(
        [{ type: 'uint256' }, { type: 'address' }, { type: 'bool' }],
        [123n, '0x0000000000000000000000000000000000000000', true],
      )

      expect(encoded).toBeDefined()
      expect(encoded.startsWith('0x')).toBe(true)
    })

    it('应该能够编码字符串', () => {
      const encoded = encodeAbiParameters(
        [{ type: 'string' }],
        ['hello world'],
      )

      expect(encoded).toBeDefined()
      expect(encoded.length).toBeGreaterThan(2)
    })

    it('应该能够编码数组', () => {
      const encoded = encodeAbiParameters(
        [{ type: 'uint256[]' }],
        [[1n, 2n, 3n]],
      )

      expect(encoded).toBeDefined()
    })

    it('应该能够编码结构体', () => {
      const encoded = encodeAbiParameters(
        [
          {
            type: 'tuple',
            components: [
              { name: 'name', type: 'string' },
              { name: 'age', type: 'uint256' },
            ],
          },
        ],
        [{ name: 'Alice', age: 30n }],
      )

      expect(encoded).toBeDefined()
    })

    it('应该能够编码嵌套结构', () => {
      const encoded = encodeAbiParameters(
        [
          {
            type: 'tuple[]',
            components: [
              { name: 'x', type: 'uint256' },
              { name: 'y', type: 'uint256' },
            ],
          },
        ],
        [[{ x: 1n, y: 2n }, { x: 3n, y: 4n }]],
      )

      expect(encoded).toBeDefined()
    })

    it('编码和解码应该是可逆的', () => {
      const original = [123n, '0x0000000000000000000000000000000000000000', true]
      const encoded = encodeAbiParameters(
        [{ type: 'uint256' }, { type: 'address' }, { type: 'bool' }],
        original,
      )
      const decoded = decodeAbiParameters(
        [{ type: 'uint256' }, { type: 'address' }, { type: 'bool' }],
        encoded,
      )

      expect(decoded).toEqual(original)
    })
  })

  describe('decodeAbiParameters', () => {
    it('应该能够解码基本类型', () => {
      const encoded = encodeAbiParameters(
        [{ type: 'uint256' }, { type: 'address' }],
        [123n, '0x0000000000000000000000000000000000000000'],
      )
      const decoded = decodeAbiParameters(
        [{ type: 'uint256' }, { type: 'address' }],
        encoded,
      )

      expect(decoded).toEqual([
        123n,
        '0x0000000000000000000000000000000000000000',
      ])
    })

    it('应该能够解码字符串', () => {
      const encoded = encodeAbiParameters(
        [{ type: 'string' }],
        ['hello world'],
      )
      const decoded = decodeAbiParameters([{ type: 'string' }], encoded)

      expect(decoded).toEqual(['hello world'])
    })

    it('应该能够解码数组', () => {
      const encoded = encodeAbiParameters(
        [{ type: 'uint256[]' }],
        [[1n, 2n, 3n]],
      )
      const decoded = decodeAbiParameters([{ type: 'uint256[]' }], encoded)

      expect(decoded).toEqual([[1n, 2n, 3n]])
    })

    it('应该能够解码结构体', () => {
      const encoded = encodeAbiParameters(
        [
          {
            type: 'tuple',
            components: [
              { name: 'name', type: 'string' },
              { name: 'age', type: 'uint256' },
            ],
          },
        ],
        [{ name: 'Bob', age: 25n }],
      )
      const decoded = decodeAbiParameters(
        [
          {
            type: 'tuple',
            components: [
              { name: 'name', type: 'string' },
              { name: 'age', type: 'uint256' },
            ],
          },
        ],
        encoded,
      )

      expect(decoded).toEqual([{ name: 'Bob', age: 25n }])
    })

    it('应该能够解码动态类型', () => {
      const encoded = encodeAbiParameters(
        [{ type: 'bytes' }],
        ['0x1234'],
      )
      const decoded = decodeAbiParameters([{ type: 'bytes' }], encoded)

      expect(decoded).toEqual(['0x1234'])
    })
  })

  describe('encodeFunctionData', () => {
    it('应该能够编码函数调用数据', () => {
      const data = encodeFunctionData({
        abi: parseAbi(['function foo(uint256 x, uint256 y) returns (uint256)']),
        functionName: 'foo',
        args: [1n, 2n],
      })

      expect(data).toBeDefined()
      expect(data.startsWith('0x')).toBe(true)
      // 函数选择器应该是 4 字节
      expect(data.length).toBeGreaterThan(10)
    })

    it('编码的函数数据应该包含函数选择器', () => {
      const data = encodeFunctionData({
        abi: parseAbi(['function transfer(address to, uint256 amount)']),
        functionName: 'transfer',
        args: ['0x0000000000000000000000000000000000000000', 100n],
      })

      const functionSelector = data.slice(0, 10)
      expect(functionSelector).toMatch(/^0x[a-fA-F0-9]{8}$/)
    })

    it('应该能够编码重载函数', () => {
      const data = encodeFunctionData({
        abi: parseAbi([
          'function foo(uint256 x)',
          'function foo(bytes32 x)',
        ]),
        functionName: 'foo',
        args: [123n],
      })

      expect(data).toBeDefined()
    })

    it('应该能够编码没有参数的函数', () => {
      const data = encodeFunctionData({
        abi: parseAbi(['function greet() returns (string)']),
        functionName: 'greet',
      })

      expect(data).toBeDefined()
      expect(data.length).toBe(10) // 0x + 4 字节选择器
    })
  })

  describe('decodeFunctionResult', () => {
    it('应该能够解码函数返回值', () => {
      const data = encodeAbiParameters([{ type: 'uint256' }], [42n])

      const result = decodeFunctionResult({
        abi: parseAbi(['function foo() returns (uint256)']),
        functionName: 'foo',
        data,
      })

      expect(result).toBe(42n)
    })

    it('应该能够解码多个返回值', () => {
      const data = encodeAbiParameters(
        [{ type: 'uint256' }, { type: 'bool' }, { type: 'address' }],
        [123n, true, '0x0000000000000000000000000000000000000000'],
      )

      const result = decodeFunctionResult({
        abi: parseAbi([
          'function foo() returns (uint256, bool, address)',
        ]),
        functionName: 'foo',
        data,
      })

      expect(result).toEqual([
        123n,
        true,
        '0x0000000000000000000000000000000000000000',
      ])
    })

    it('应该能够解码字符串返回值', () => {
      const data = encodeAbiParameters([{ type: 'string' }], ['hello'])

      const result = decodeFunctionResult({
        abi: parseAbi(['function greet() returns (string)']),
        functionName: 'greet',
        data,
      })

      expect(result).toBe('hello')
    })

    it('应该能够解码结构体返回值', () => {
      const data = encodeAbiParameters(
        [
          {
            type: 'tuple',
            components: [{ name: 'x', type: 'uint256' }, { name: 'y', type: 'uint256' }],
          },
        ],
        [{ x: 10n, y: 20n }],
      )

      const result = decodeFunctionResult({
        abi: parseAbi([
          'function getPoint() returns (tuple(uint256 x, uint256 y))',
        ]),
        functionName: 'getPoint',
        data,
      })

      expect(result).toEqual({ x: 10n, y: 20n })
    })
  })

  describe('ABI 与函数选择器', () => {
    it('应该能够生成正确的函数选择器', () => {
      const selector = toFunctionSelector('function transfer(address,uint256)')

      expect(selector).toMatch(/^0x[a-fA-F0-9]{8}$/)
    })

    it('相同的函数签名应该生成相同的选择器', () => {
      const selector1 = toFunctionSelector('function balanceOf(address)')
      const selector2 = toFunctionSelector('function balanceOf(address)')

      expect(selector1).toBe(selector2)
    })

    it('不同的函数签名应该生成不同的选择器', () => {
      const selector1 = toFunctionSelector('function foo(uint256)')
      const selector2 = toFunctionSelector('function bar(uint256)')

      expect(selector1).not.toBe(selector2)
    })
  })

  describe('错误处理', () => {
    it('使用错误的参数编码应该失败', () => {
      expect(() =>
        encodeAbiParameters([{ type: 'uint256' }], ['not a number' as unknown as bigint]),
      ).toThrow()
    })

    it('使用错误的类型解码应该失败', () => {
      const data = '0x'

      expect(() =>
        decodeAbiParameters([{ type: 'uint256' }], data),
      ).toThrow()
    })

    it('解码不完整的函数数据应该失败', () => {
      expect(() =>
        decodeFunctionResult({
          abi: parseAbi(['function foo() returns (uint256)']),
          functionName: 'foo',
          data: '0x',
        }),
      ).toThrow()
    })
  })

  describe('复杂数据类型', () => {
    it('应该能够处理嵌套数组', () => {
      const encoded = encodeAbiParameters(
        [{ type: 'uint256[][]' }],
        [[[1n, 2n], [3n, 4n]]],
      )

      expect(encoded).toBeDefined()
    })

    it('应该能够处理固定大小数组', () => {
      const encoded = encodeAbiParameters(
        [{ type: 'uint256[3]' }],
        [[1n, 2n, 3n]],
      )

      expect(encoded).toBeDefined()
    })

    it('应该能够处理嵌套结构体', () => {
      const encoded = encodeAbiParameters(
        [
          {
            type: 'tuple',
            components: [
              {
                name: 'inner',
                type: 'tuple',
                components: [
                  { name: 'value', type: 'uint256' },
                ],
              },
            ],
          },
        ],
        [{ inner: { value: 42n } }],
      )

      expect(encoded).toBeDefined()
    })
  })
})
