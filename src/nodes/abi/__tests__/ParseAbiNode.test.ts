import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ParseAbiNode } from '../ParseAbiNode'

describe('ParseAbiNode', () => {
  let node: ParseAbiNode

  beforeEach(() => {
    node = new ParseAbiNode()
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和描述', () => {
      expect(ParseAbiNode.title).toBe('parseAbi')
      expect(ParseAbiNode.desc).toBe('Parse ABI from JSON string')
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs).toHaveLength(1)
      expect(node.inputs?.[0].name).toBe('abiJson')
      expect(node.inputs?.[0].type).toBe('string')
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs).toHaveLength(1)
      expect(node.outputs?.[0].name).toBe('abi')
      expect(node.outputs?.[0].type).toBe('abi')
    })

    it('应该有正确的节点尺寸', () => {
      expect(node.size).toEqual([160, 50])
    })

    it('应该有正确的颜色配置', () => {
      expect(node.color).toBe('#e53e3e')
      expect(node.bgcolor).toBe('#742a2a')
    })
  })

  describe('onExecute', () => {
    it('应该正确解析有效的函数 ABI JSON', () => {
      const abiJson = JSON.stringify([
        {
          type: 'function',
          name: 'transfer',
          stateMutability: 'nonpayable',
          inputs: [
            { name: 'to', type: 'address' },
            { name: 'amount', type: 'uint256' },
          ],
        },
      ])

      vi.spyOn(node, 'getInputData').mockReturnValue(abiJson)

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeTruthy()
      expect(Array.isArray(result)).toBe(true)
      expect(result[0]).toMatchObject({
        type: 'function',
        name: 'transfer',
      })
    })

    it('应该正确解析事件 ABI JSON', () => {
      const abiJson = JSON.stringify([
        {
          type: 'event',
          name: 'Transfer',
          inputs: [
            { name: 'from', type: 'address', indexed: true },
            { name: 'to', type: 'address', indexed: true },
            { name: 'value', type: 'uint256', indexed: false },
          ],
        },
      ])

      vi.spyOn(node, 'getInputData').mockReturnValue(abiJson)

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeTruthy()
      expect(Array.isArray(result)).toBe(true)
      expect(result[0]).toMatchObject({
        type: 'event',
        name: 'Transfer',
      })
    })

    it('应该正确解析包含多个条目的 ABI JSON', () => {
      const abiJson = JSON.stringify([
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
          type: 'event',
          name: 'Transfer',
          inputs: [
            { name: 'from', type: 'address', indexed: true },
            { name: 'to', type: 'address', indexed: true },
            { name: 'value', type: 'uint256', indexed: false },
          ],
        },
      ])

      vi.spyOn(node, 'getInputData').mockReturnValue(abiJson)

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeTruthy()
      expect(Array.isArray(result)).toBe(true)
      expect(result).toHaveLength(3)
    })

    it('应该正确解析构造函数 ABI', () => {
      const abiJson = JSON.stringify([
        {
          type: 'constructor',
          stateMutability: 'nonpayable',
          inputs: [{ name: 'initialSupply', type: 'uint256' }],
        },
      ])

      vi.spyOn(node, 'getInputData').mockReturnValue(abiJson)

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeTruthy()
      expect(Array.isArray(result)).toBe(true)
      expect(result[0]).toMatchObject({
        type: 'constructor',
      })
    })

    it('应该正确解析错误类型的 ABI', () => {
      const abiJson = JSON.stringify([
        {
          type: 'error',
          name: 'InsufficientBalance',
          inputs: [{ name: 'balance', type: 'uint256' }],
        },
      ])

      vi.spyOn(node, 'getInputData').mockReturnValue(abiJson)

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeTruthy()
      expect(Array.isArray(result)).toBe(true)
      expect(result[0]).toMatchObject({
        type: 'error',
        name: 'InsufficientBalance',
      })
    })

    it('应该在输入为 undefined 时输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValue(undefined)

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在输入为 null 时输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValue(null)

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在输入为空字符串时输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValue('')

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在输入为无效 JSON 时输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValue('{invalid json}')

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在输入为非字符串类型时返回该值(JSON.parse 会原样返回数字)', () => {
      vi.spyOn(node, 'getInputData').mockReturnValue(12345 as unknown as string)

      node.onExecute()

      // 注意: JSON.parse(12345) 实际上会返回 12345,不会抛出错误
      // 这是当前实现的行为
      expect(node.getOutputData(0)).toBe(12345)
    })

    it('应该处理复杂的 ABI 结构', () => {
      const abiJson = JSON.stringify([
        {
          type: 'function',
          name: 'permit',
          stateMutability: 'nonpayable',
          inputs: [
            { name: 'owner', type: 'address' },
            { name: 'spender', type: 'address' },
            { name: 'value', type: 'uint256' },
            { name: 'deadline', type: 'uint256' },
            { name: 'v', type: 'uint8' },
            { name: 'r', type: 'bytes32' },
            { name: 's', type: 'bytes32' },
          ],
        },
      ])

      vi.spyOn(node, 'getInputData').mockReturnValue(abiJson)

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeTruthy()
      expect(Array.isArray(result)).toBe(true)
      expect(result[0].inputs).toHaveLength(7)
    })

    it('应该正确处理包含数组和元组的类型', () => {
      const abiJson = JSON.stringify([
        {
          type: 'function',
          name: 'batchTransfer',
          stateMutability: 'nonpayable',
          inputs: [
            { name: 'recipients', type: 'address[]' },
            { name: 'amounts', type: 'uint256[]' },
          ],
        },
      ])

      vi.spyOn(node, 'getInputData').mockReturnValue(abiJson)

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeTruthy()
      expect(Array.isArray(result)).toBe(true)
      expect(result[0].inputs[0].type).toBe('address[]')
    })

    it('应该处理带有多余空格的 JSON 字符串', () => {
      const abiJson = `  [
        {
          "type": "function",
          "name": "foo",
          "stateMutability": "view",
          "inputs": []
        }
      ]  `

      vi.spyOn(node, 'getInputData').mockReturnValue(abiJson)

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeTruthy()
      expect(Array.isArray(result)).toBe(true)
    })

    it('应该正确处理 fallback 和 receive 函数', () => {
      const abiJson = JSON.stringify([
        {
          type: 'fallback',
          stateMutability: 'payable',
        },
        {
          type: 'receive',
          stateMutability: 'payable',
        },
      ])

      vi.spyOn(node, 'getInputData').mockReturnValue(abiJson)

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeTruthy()
      expect(Array.isArray(result)).toBe(true)
      expect(result).toHaveLength(2)
      expect(result[0].type).toBe('fallback')
      expect(result[1].type).toBe('receive')
    })
  })
})
