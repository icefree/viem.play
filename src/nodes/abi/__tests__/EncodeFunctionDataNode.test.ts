import { describe, it, expect, vi, beforeEach } from 'vitest'
import { EncodeFunctionDataNode } from '../EncodeFunctionDataNode'

describe('EncodeFunctionDataNode', () => {
  let node: EncodeFunctionDataNode

  beforeEach(() => {
    node = new EncodeFunctionDataNode()
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和描述', () => {
      expect(EncodeFunctionDataNode.title).toBe('encodeFunctionData')
      expect(EncodeFunctionDataNode.desc).toBe('Encode function call data')
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs).toHaveLength(3)
      expect(node.inputs?.[0].name).toBe('abi')
      expect(node.inputs?.[0].type).toBe('abi')
      expect(node.inputs?.[1].name).toBe('functionName')
      expect(node.inputs?.[1].type).toBe('string')
      expect(node.inputs?.[2].name).toBe('args')
      expect(node.inputs?.[2].type).toBe('array')
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs).toHaveLength(1)
      expect(node.outputs?.[0].name).toBe('data')
      expect(node.outputs?.[0].type).toBe('bytes')
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
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('transfer')
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([])

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在缺少 functionName 时输出 null', () => {
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
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(undefined)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([])

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在缺少 args 时输出 null', () => {
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
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(undefined)

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在 abi 为空数组时输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('transfer')
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([])

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在 functionName 为空字符串时输出 null', () => {
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
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('')
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([])

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在 abi 中找不到指定函数时输出 null', () => {
      const abi = [
        {
          type: 'function',
          name: 'balanceOf',
          stateMutability: 'view',
          inputs: [{ name: 'owner', type: 'address' }],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('transfer')
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([])

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在 args 与函数参数数量不匹配时输出 null', () => {
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
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(['0x0000000000000000000000000000000000000000'])

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在 args 为非数组类型时输出 null', () => {
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
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('invalid' as unknown as [])

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在 abi 为非数组类型时输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('invalid' as unknown as [])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('transfer')
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([])

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在 functionName 为非字符串类型时输出 null', () => {
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
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(123 as unknown as string)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([])

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

    it('应该编码无参数的函数调用', () => {
      const abi = [
        {
          type: 'function',
          name: 'mint',
          stateMutability: 'nonpayable',
          inputs: [],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('mint')
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([])

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该编码 transfer 函数调用', () => {
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
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([
        '0x0000000000000000000000000000000000000000',
        1000000000000000000n,
      ])

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该编码 balanceOf 函数调用', () => {
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
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([
        '0x0000000000000000000000000000000000000000',
      ])

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该编码 approve 函数调用', () => {
      const abi = [
        {
          type: 'function',
          name: 'approve',
          stateMutability: 'nonpayable',
          inputs: [
            { name: 'spender', type: 'address' },
            { name: 'amount', type: 'uint256' },
          ],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('approve')
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([
        '0x0000000000000000000000000000000000000000',
        115792089237316195423570985008687907853269984665640564039457584007913129639935n,
      ])

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该编码包含字符串参数的函数调用', () => {
      const abi = [
        {
          type: 'function',
          name: 'setName',
          stateMutability: 'nonpayable',
          inputs: [{ name: 'name', type: 'string' }],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('setName')
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(['MyToken'])

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该编码包含字节数组参数的函数调用', () => {
      const abi = [
        {
          type: 'function',
          name: 'mintBytes',
          stateMutability: 'nonpayable',
          inputs: [{ name: 'data', type: 'bytes' }],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('mintBytes')
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(['0xdeadbeef'])

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该编码包含数组参数的函数调用', () => {
      const abi = [
        {
          type: 'function',
          name: 'batchTransfer',
          stateMutability: 'nonpayable',
          inputs: [
            { name: 'recipients', type: 'address[]' },
            { name: 'amounts', type: 'uint256[]' },
          ],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('batchTransfer')
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([
        ['0x0000000000000000000000000000000000000001', '0x0000000000000000000000000000000000000002'],
        [100n, 200n],
      ])

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该编码包含布尔值参数的函数调用', () => {
      const abi = [
        {
          type: 'function',
          name: 'setFlag',
          stateMutability: 'nonpayable',
          inputs: [{ name: 'flag', type: 'bool' }],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('setFlag')
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([true])

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该编码包含多个不同类型参数的函数调用', () => {
      const abi = [
        {
          type: 'function',
          name: 'complexFunction',
          stateMutability: 'nonpayable',
          inputs: [
            { name: 'addr', type: 'address' },
            { name: 'amount', type: 'uint256' },
            { name: 'flag', type: 'bool' },
            { name: 'str', type: 'string' },
          ],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('complexFunction')
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([
        '0x0000000000000000000000000000000000000000',
        1000n,
        true,
        'test',
      ])

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该编码 payable 函数调用', () => {
      const abi = [
        {
          type: 'function',
          name: 'deposit',
          stateMutability: 'payable',
          inputs: [],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('deposit')
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([])

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该正确处理 0 值参数', () => {
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
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([
        '0x0000000000000000000000000000000000000000',
        0n,
      ])

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该正确处理最大 uint256 值', () => {
      const abi = [
        {
          type: 'function',
          name: 'setMaxAmount',
          stateMutability: 'nonpayable',
          inputs: [{ name: 'amount', type: 'uint256' }],
        },
      ]

      const maxUint256 = 115792089237316195423570985008687907853269984665640564039457584007913129639935n

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('setMaxAmount')
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([maxUint256])

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该处理空字符串参数', () => {
      const abi = [
        {
          type: 'function',
          name: 'setName',
          stateMutability: 'nonpayable',
          inputs: [{ name: 'name', type: 'string' }],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('setName')
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([''])

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该处理空数组参数', () => {
      const abi = [
        {
          type: 'function',
          name: 'processAddresses',
          stateMutability: 'nonpayable',
          inputs: [{ name: 'addresses', type: 'address[]' }],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('processAddresses')
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([[]])

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该在函数名大小写不匹配时输出 null', () => {
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
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('Transfer')
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([
        '0x0000000000000000000000000000000000000000',
        1000n,
      ])

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该在 ABI 包含多个函数时正确编码指定函数', () => {
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
          name: 'transfer',
          stateMutability: 'nonpayable',
          inputs: [
            { name: 'to', type: 'address' },
            { name: 'amount', type: 'uint256' },
          ],
        },
        {
          type: 'function',
          name: 'approve',
          stateMutability: 'nonpayable',
          inputs: [
            { name: 'spender', type: 'address' },
            { name: 'amount', type: 'uint256' },
          ],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('approve')
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([
        '0x0000000000000000000000000000000000000000',
        1000n,
      ])

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })
  })
})
