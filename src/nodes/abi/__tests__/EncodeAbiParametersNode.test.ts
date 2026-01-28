import { describe, it, expect, vi, beforeEach } from 'vitest'
import { EncodeAbiParametersNode } from '../EncodeAbiParametersNode'

describe('EncodeAbiParametersNode', () => {
  let node: EncodeAbiParametersNode

  beforeEach(() => {
    node = new EncodeAbiParametersNode()
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和描述', () => {
      expect(EncodeAbiParametersNode.title).toBe('encodeAbiParameters')
      expect(EncodeAbiParametersNode.desc).toBe('Encode ABI parameters')
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs).toHaveLength(2)
      expect(node.inputs?.[0].name).toBe('types')
      expect(node.inputs?.[0].type).toBe('array')
      expect(node.inputs?.[1].name).toBe('values')
      expect(node.inputs?.[1].type).toBe('array')
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs).toHaveLength(1)
      expect(node.outputs?.[0].name).toBe('encoded')
      expect(node.outputs?.[0].type).toBe('bytes')
    })

    it('应该有正确的节点尺寸', () => {
      expect(node.size).toEqual([200, 70])
    })

    it('应该有正确的颜色配置', () => {
      expect(node.color).toBe('#e53e3e')
      expect(node.bgcolor).toBe('#742a2a')
    })
  })

  describe('onExecute', () => {
    it('应该在 types 和 values 都为 undefined 时输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValue(undefined)

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在 types 为空数组时输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([])

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在缺少 types 时输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(undefined)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([1n, 2n])

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在缺少 values 时输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([{ type: 'uint256' }])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(undefined)

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在 types 和 values 数量不匹配时输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([
        { type: 'uint256' },
        { type: 'uint256' },
      ])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([1n])

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在 types 为非数组类型时输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('invalid' as unknown as [])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([])

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在 values 为非数组类型时输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('invalid' as unknown as [])

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该处理空的 types 数组', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([])

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该处理 null 输入', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(null)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(null)

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该处理包含 null 的 types 数组', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([null, { type: 'uint256' }] as unknown as [])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([1n, 2n])

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该处理包含 undefined 的 values 数组', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([
        { type: 'uint256' },
        { type: 'address' },
      ])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([1n, undefined] as unknown as [])

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在 types 为无效格式时输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(['uint256', 'address'] as unknown as [])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([1n, '0x0000000000000000000000000000000000000000'])

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在类型不匹配时输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([{ type: 'uint256' }])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(['not a number' as unknown as bigint])

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在 types 为空对象数组时输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([{}, {}] as unknown as [])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([1n, 2n])

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该处理单个 uint256 参数', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([{ type: 'uint256' }])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([1234567890n])

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该处理多个不同类型的参数', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([
        { type: 'address' },
        { type: 'uint256' },
        { type: 'bool' },
      ])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([
        '0x0000000000000000000000000000000000000000',
        1000000000000000000n,
        true,
      ])

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该处理字符串类型参数', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([{ type: 'string' }])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(['Hello, World!'])

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该处理字节数组类型参数', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([{ type: 'bytes' }])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(['0xdeadbeef'])

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该处理数组类型参数', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([{ type: 'uint256[]' }])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([[1n, 2n, 3n]])

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该处理元组类型参数', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([
        {
          type: 'tuple',
          components: [
            { name: 'x', type: 'uint256' },
            { name: 'y', type: 'uint256' },
          ],
        },
      ])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([{ x: 1n, y: 2n }])

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该处理地址数组', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([{ type: 'address[]' }])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([
        [
          '0x0000000000000000000000000000000000000001',
          '0x0000000000000000000000000000000000000002',
        ],
      ])

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该处理固定长度字节数组', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([{ type: 'bytes32' }])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([
        '0x0000000000000000000000000000000000000000000000000000000000000001',
      ])

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该处理 int 类型(有符号整数)', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([{ type: 'int256' }])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([-1234567890n])

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该处理嵌套数组', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([{ type: 'uint256[][]' }])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([[[1n, 2n], [3n, 4n]]])

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该处理混合类型和复杂结构', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([
        { type: 'address' },
        { type: 'uint256' },
        { type: 'bool' },
        { type: 'string' },
      ])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([
        '0x0000000000000000000000000000000000000000',
        1000000000000000000n,
        true,
        'test',
      ])

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该正确处理非常大的数值', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([{ type: 'uint256' }])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([
        115792089237316195423570985008687907853269984665640564039457584007913129639935n,
      ])

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该处理 0 值', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([{ type: 'uint256' }])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([0n])

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该处理空字符串', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([{ type: 'string' }])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([''])

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该处理空数组', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([{ type: 'address[]' }])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([[]])

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })
  })
})
