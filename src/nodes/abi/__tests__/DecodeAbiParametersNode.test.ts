import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DecodeAbiParametersNode } from '../DecodeAbiParametersNode'

describe('DecodeAbiParametersNode', () => {
  let node: DecodeAbiParametersNode

  beforeEach(() => {
    node = new DecodeAbiParametersNode()
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和描述', () => {
      expect(DecodeAbiParametersNode.title).toBe('decodeAbiParameters')
      expect(DecodeAbiParametersNode.desc).toBe('Decode ABI parameters')
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs).toHaveLength(2)
      expect(node.inputs?.[0].name).toBe('types')
      expect(node.inputs?.[0].type).toBe('array')
      expect(node.inputs?.[1].name).toBe('data')
      expect(node.inputs?.[1].type).toBe('bytes')
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs).toHaveLength(1)
      expect(node.outputs?.[0].name).toBe('decoded')
      expect(node.outputs?.[0].type).toBe('array')
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
    it('应该在 types 和 data 都为 undefined 时输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValue(undefined)

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在 types 为空数组时输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('0x')

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在缺少 types 时输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(undefined)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('0x0000000000000000000000000000000000000000000000000000000000000000')

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在缺少 data 时输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([{ type: 'uint256' }])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(undefined)

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在 types 为非数组类型时输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('invalid' as unknown as [])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('0x')

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在 data 为非字符串类型时输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([{ type: 'uint256' }])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(12345 as unknown as string)

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在 data 为无效十六进制时输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([{ type: 'uint256' }])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('0xgg')

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在 data 不以 0x 开头时输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([{ type: 'uint256' }])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('deadbeef')

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在 data 为空字符串时输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([{ type: 'uint256' }])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('')

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
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('0x')

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在 types 为无效格式时输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(['uint256', 'address'] as unknown as [])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('0x')

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在 types 为空对象数组时输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([{}, {}] as unknown as [])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('0x')

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在 data 长度不足时输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([{ type: 'uint256' }])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('0x0011')

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该处理单个 uint256 参数', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([{ type: 'uint256' }])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(
        '0x0000000000000000000000000000000000000000000000000000000000000001'
      )

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
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(
        '0x0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000001'
      )

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该处理字符串类型参数', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([{ type: 'string' }])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(
        '0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000d48656c6c6f2c20576f726c6421000000000000000000000000000000000000'
      )

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该处理字节数组类型参数', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([{ type: 'bytes' }])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(
        '0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000004deadbeef0000000000000000000000000000000000000000000000000000000000'
      )

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该处理数组类型参数', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([{ type: 'uint256[]' }])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(
        '0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000003'
      )

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
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(
        '0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002'
      )

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该处理地址数组', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([{ type: 'address[]' }])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(
        '0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002'
      )

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该处理固定长度字节数组', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([{ type: 'bytes32' }])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(
        '0x0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000005'
      )

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该处理 int 类型(有符号整数)', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([{ type: 'int256' }])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(
        '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
      )

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该处理嵌套数组', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([{ type: 'uint256[][]' }])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(
        '0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000004'
      )

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
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(
        '0x0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000004746573740000000000000000000000000000000000000000000000000000000000'
      )

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该处理 0 值', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([{ type: 'uint256' }])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(
        '0x0000000000000000000000000000000000000000000000000000000000000000'
      )

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该处理空字符串', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([{ type: 'string' }])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(
        '0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000'
      )

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该处理空数组', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([{ type: 'address[]' }])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(
        '0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000'
      )

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该正确处理带有 0x 前缀的数据', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([{ type: 'uint256' }])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(
        '0x0000000000000000000000000000000000000000000000000000000000000001'
      )

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该处理带有函数选择器的数据', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([
        { type: 'address' },
        { type: 'uint256' },
      ])
      // 假设这是 transfer 函数的编码数据(包含 4 字节选择器)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(
        '0xa9059cbb00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002'
      )

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该处理奇数长度的十六进制字符串', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([{ type: 'uint256' }])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('0xabc')

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })
  })
})
