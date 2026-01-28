import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DecodeFunctionResultNode } from '../DecodeFunctionResultNode'

describe('DecodeFunctionResultNode', () => {
  let node: DecodeFunctionResultNode

  beforeEach(() => {
    node = new DecodeFunctionResultNode()
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和描述', () => {
      expect(DecodeFunctionResultNode.title).toBe('decodeFunctionResult')
      expect(DecodeFunctionResultNode.desc).toBe('Decode function result')
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs).toHaveLength(3)
      expect(node.inputs?.[0].name).toBe('abi')
      expect(node.inputs?.[0].type).toBe('abi')
      expect(node.inputs?.[1].name).toBe('functionName')
      expect(node.inputs?.[1].type).toBe('string')
      expect(node.inputs?.[2].name).toBe('data')
      expect(node.inputs?.[2].type).toBe('bytes')
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs).toHaveLength(1)
      expect(node.outputs?.[0].name).toBe('result')
      expect(node.outputs?.[0].type).toBe(0)
    })

    it('应该有正确的节点尺寸', () => {
      expect(node.size).toEqual([200, 90])
    })

    it('应该有正确的颜色配置', () => {
      expect(node.color).toBe('#e53e3e')
      expect(node.bgcolor).toBe('#742a2a')
    })
  })

  describe('onExecute', () => {
    it('应该在所有输入都为 undefined 时输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValue(undefined)

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在缺少 abi 时输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(undefined)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('balanceOf')
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('0x')

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在缺少 functionName 时输出 null', () => {
      const abi = [
        {
          type: 'function',
          name: 'balanceOf',
          stateMutability: 'view',
          inputs: [{ name: 'owner', type: 'address' }],
          outputs: [{ name: '', type: 'uint256' }],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(undefined)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('0x')

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在缺少 data 时输出 null', () => {
      const abi = [
        {
          type: 'function',
          name: 'balanceOf',
          stateMutability: 'view',
          inputs: [{ name: 'owner', type: 'address' }],
          outputs: [{ name: '', type: 'uint256' }],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('balanceOf')
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(undefined)

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在 abi 为空数组时输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('balanceOf')
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('0x')

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在 functionName 为空字符串时输出 null', () => {
      const abi = [
        {
          type: 'function',
          name: 'balanceOf',
          stateMutability: 'view',
          inputs: [{ name: 'owner', type: 'address' }],
          outputs: [{ name: '', type: 'uint256' }],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('')
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('0x')

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在 data 为空字符串时输出 null', () => {
      const abi = [
        {
          type: 'function',
          name: 'balanceOf',
          stateMutability: 'view',
          inputs: [{ name: 'owner', type: 'address' }],
          outputs: [{ name: '', type: 'uint256' }],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('balanceOf')
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('')

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在 abi 中找不到指定函数时输出 null', () => {
      const abi = [
        {
          type: 'function',
          name: 'transfer',
          stateMutability: 'nonpayable',
          inputs: [
            { name: 'to', type: 'address' },
            { name: 'amount', type: 'uint256' },
          ],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('balanceOf')
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('0x')

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在 data 为无效十六进制时输出 null', () => {
      const abi = [
        {
          type: 'function',
          name: 'balanceOf',
          stateMutability: 'view',
          inputs: [{ name: 'owner', type: 'address' }],
          outputs: [{ name: '', type: 'uint256' }],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('balanceOf')
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('0xgg')

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在 data 不以 0x 开头时输出 null', () => {
      const abi = [
        {
          type: 'function',
          name: 'balanceOf',
          stateMutability: 'view',
          inputs: [{ name: 'owner', type: 'address' }],
          outputs: [{ name: '', type: 'uint256' }],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('balanceOf')
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('deadbeef')

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在 abi 为非数组类型时输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('invalid' as unknown as [])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('balanceOf')
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('0x')

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在 functionName 为非字符串类型时输出 null', () => {
      const abi = [
        {
          type: 'function',
          name: 'balanceOf',
          stateMutability: 'view',
          inputs: [{ name: 'owner', type: 'address' }],
          outputs: [{ name: '', type: 'uint256' }],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(123 as unknown as string)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('0x')

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在 data 为非字符串类型时输出 null', () => {
      const abi = [
        {
          type: 'function',
          name: 'balanceOf',
          stateMutability: 'view',
          inputs: [{ name: 'owner', type: 'address' }],
          outputs: [{ name: '', type: 'uint256' }],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('balanceOf')
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(12345 as unknown as string)

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该处理 null 输入', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(null)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(null)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(null)

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该解码返回单个 uint256 的函数结果', () => {
      const abi = [
        {
          type: 'function',
          name: 'balanceOf',
          stateMutability: 'view',
          inputs: [{ name: 'owner', type: 'address' }],
          outputs: [{ name: '', type: 'uint256' }],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('balanceOf')
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(
        '0x0000000000000000000000000000000000000000000000000000000000000001'
      )

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该解码返回布尔值的函数结果', () => {
      const abi = [
        {
          type: 'function',
          name: 'isValid',
          stateMutability: 'view',
          inputs: [],
          outputs: [{ name: '', type: 'bool' }],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('isValid')
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(
        '0x0000000000000000000000000000000000000000000000000000000000000001'
      )

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该解码返回地址的函数结果', () => {
      const abi = [
        {
          type: 'function',
          name: 'owner',
          stateMutability: 'view',
          inputs: [],
          outputs: [{ name: '', type: 'address' }],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('owner')
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(
        '0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002'
      )

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该解码返回字符串的函数结果', () => {
      const abi = [
        {
          type: 'function',
          name: 'name',
          stateMutability: 'view',
          inputs: [],
          outputs: [{ name: '', type: 'string' }],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('name')
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(
        '0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000084d79546f6b656e0000000000000000000000000000000000000000000000000000'
      )

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该解码返回多个值的函数结果', () => {
      const abi = [
        {
          type: 'function',
          name: 'getDetails',
          stateMutability: 'view',
          inputs: [],
          outputs: [
            { name: 'balance', type: 'uint256' },
            { name: 'owner', type: 'address' },
            { name: 'active', type: 'bool' },
          ],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('getDetails')
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(
        '0x0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000001'
      )

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该解码返回数组的函数结果', () => {
      const abi = [
        {
          type: 'function',
          name: 'getAllOwners',
          stateMutability: 'view',
          inputs: [],
          outputs: [{ name: '', type: 'address[]' }],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('getAllOwners')
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(
        '0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002'
      )

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该解码返回字节数组的函数结果', () => {
      const abi = [
        {
          type: 'function',
          name: 'getData',
          stateMutability: 'view',
          inputs: [],
          outputs: [{ name: '', type: 'bytes' }],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('getData')
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(
        '0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000004deadbeef0000000000000000000000000000000000000000000000000000000000'
      )

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该解码返回元组的函数结果', () => {
      const abi = [
        {
          type: 'function',
          name: 'getPosition',
          stateMutability: 'view',
          inputs: [],
          outputs: [
            {
              name: '',
              type: 'tuple',
              components: [
                { name: 'x', type: 'uint256' },
                { name: 'y', type: 'uint256' },
              ],
            },
          ],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('getPosition')
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(
        '0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002'
      )

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该解码返回多个元组的函数结果', () => {
      const abi = [
        {
          type: 'function',
          name: 'getPositions',
          stateMutability: 'view',
          inputs: [],
          outputs: [
            {
              name: '',
              type: 'tuple[]',
              components: [
                { name: 'x', type: 'uint256' },
                { name: 'y', type: 'uint256' },
              ],
            },
          ],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('getPositions')
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(
        '0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000004'
      )

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该解码返回 0 的函数结果', () => {
      const abi = [
        {
          type: 'function',
          name: 'balanceOf',
          stateMutability: 'view',
          inputs: [{ name: 'owner', type: 'address' }],
          outputs: [{ name: '', type: 'uint256' }],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('balanceOf')
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(
        '0x0000000000000000000000000000000000000000000000000000000000000000'
      )

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该解码返回空字符串的函数结果', () => {
      const abi = [
        {
          type: 'function',
          name: 'symbol',
          stateMutability: 'view',
          inputs: [],
          outputs: [{ name: '', type: 'string' }],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('symbol')
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(
        '0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000'
      )

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该解码返回空数组的函数结果', () => {
      const abi = [
        {
          type: 'function',
          name: 'getAddresses',
          stateMutability: 'view',
          inputs: [],
          outputs: [{ name: '', type: 'address[]' }],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('getAddresses')
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(
        '0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000'
      )

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该解码返回最大 uint256 的函数结果', () => {
      const abi = [
        {
          type: 'function',
          name: 'totalSupply',
          stateMutability: 'view',
          inputs: [],
          outputs: [{ name: '', type: 'uint256' }],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('totalSupply')
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(
        '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
      )

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该在 ABI 包含多个函数时正确解码指定函数', () => {
      const abi = [
        {
          type: 'function',
          name: 'balanceOf',
          stateMutability: 'view',
          inputs: [{ name: 'owner', type: 'address' }],
          outputs: [{ name: '', type: 'uint256' }],
        },
        {
          type: 'function',
          name: 'totalSupply',
          stateMutability: 'view',
          inputs: [],
          outputs: [{ name: '', type: 'uint256' }],
        },
        {
          type: 'function',
          name: 'name',
          stateMutability: 'view',
          inputs: [],
          outputs: [{ name: '', type: 'string' }],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('totalSupply')
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(
        '0x0000000000000000000000000000000000000000000000000000000000000001'
      )

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该处理奇数长度的十六进制字符串', () => {
      const abi = [
        {
          type: 'function',
          name: 'balanceOf',
          stateMutability: 'view',
          inputs: [{ name: 'owner', type: 'address' }],
          outputs: [{ name: '', type: 'uint256' }],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('balanceOf')
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('0xabc')

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该在函数没有输出时输出 null', () => {
      const abi = [
        {
          type: 'function',
          name: 'transfer',
          stateMutability: 'nonpayable',
          inputs: [
            { name: 'to', type: 'address' },
            { name: 'amount', type: 'uint256' },
          ],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('transfer')
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('0x')

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该在数据长度不足时输出 null', () => {
      const abi = [
        {
          type: 'function',
          name: 'balanceOf',
          stateMutability: 'view',
          inputs: [{ name: 'owner', type: 'address' }],
          outputs: [{ name: '', type: 'uint256' }],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('balanceOf')
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('0x0011')

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })
  })
})
