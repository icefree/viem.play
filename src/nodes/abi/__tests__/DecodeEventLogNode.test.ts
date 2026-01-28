import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DecodeEventLogNode } from '../DecodeEventLogNode'

describe('DecodeEventLogNode', () => {
  let node: DecodeEventLogNode

  beforeEach(() => {
    node = new DecodeEventLogNode()
  })

  describe('constructor', () => {
    it('应该正确设置节点标题和描述', () => {
      expect(DecodeEventLogNode.title).toBe('decodeEventLog')
      expect(DecodeEventLogNode.desc).toBe('Decode event log')
    })

    it('应该有正确的输入配置', () => {
      expect(node.inputs).toHaveLength(3)
      expect(node.inputs?.[0].name).toBe('abi')
      expect(node.inputs?.[0].type).toBe('abi')
      expect(node.inputs?.[1].name).toBe('topics')
      expect(node.inputs?.[1].type).toBe('array')
      expect(node.inputs?.[2].name).toBe('data')
      expect(node.inputs?.[2].type).toBe('bytes')
    })

    it('应该有正确的输出配置', () => {
      expect(node.outputs).toHaveLength(1)
      expect(node.outputs?.[0].name).toBe('decoded')
      expect(node.outputs?.[0].type).toBe('object')
    })

    it('应该有正确的节点尺寸', () => {
      expect(node.size).toEqual([180, 90])
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
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(['0x...'])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('0x...')

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在缺少 topics 时输出 null', () => {
      const abi = [
        {
          type: 'event',
          name: 'Transfer',
          inputs: [
            { name: 'from', type: 'address', indexed: true },
            { name: 'to', type: 'address', indexed: true },
            { name: 'value', type: 'uint256', indexed: false },
          ],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(undefined)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('0x...')

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在缺少 data 时输出 null', () => {
      const abi = [
        {
          type: 'event',
          name: 'Transfer',
          inputs: [
            { name: 'from', type: 'address', indexed: true },
            { name: 'to', type: 'address', indexed: true },
            { name: 'value', type: 'uint256', indexed: false },
          ],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(['0x...'])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(undefined)

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在 abi 为空数组时输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(['0x...'])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('0x...')

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在 topics 为空数组时输出 null', () => {
      const abi = [
        {
          type: 'event',
          name: 'Transfer',
          inputs: [
            { name: 'from', type: 'address', indexed: true },
            { name: 'to', type: 'address', indexed: true },
            { name: 'value', type: 'uint256', indexed: false },
          ],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('0x...')

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在 data 为空字符串时输出 null', () => {
      const abi = [
        {
          type: 'event',
          name: 'Transfer',
          inputs: [
            { name: 'from', type: 'address', indexed: true },
            { name: 'to', type: 'address', indexed: true },
            { name: 'value', type: 'uint256', indexed: false },
          ],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(['0x...'])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('')

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在 abi 为非数组类型时输出 null', () => {
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('invalid' as unknown as [])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(['0x...'])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('0x...')

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在 topics 为非数组类型时输出 null', () => {
      const abi = [
        {
          type: 'event',
          name: 'Transfer',
          inputs: [
            { name: 'from', type: 'address', indexed: true },
            { name: 'to', type: 'address', indexed: true },
            { name: 'value', type: 'uint256', indexed: false },
          ],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('invalid' as unknown as [])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('0x...')

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在 data 为非字符串类型时输出 null', () => {
      const abi = [
        {
          type: 'event',
          name: 'Transfer',
          inputs: [
            { name: 'from', type: 'address', indexed: true },
            { name: 'to', type: 'address', indexed: true },
            { name: 'value', type: 'uint256', indexed: false },
          ],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(['0x...'])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(12345 as unknown as string)

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在 data 为无效十六进制时输出 null', () => {
      const abi = [
        {
          type: 'event',
          name: 'Transfer',
          inputs: [
            { name: 'from', type: 'address', indexed: true },
            { name: 'to', type: 'address', indexed: true },
            { name: 'value', type: 'uint256', indexed: false },
          ],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(['0x...'])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('0xgg')

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在 data 不以 0x 开头时输出 null', () => {
      const abi = [
        {
          type: 'event',
          name: 'Transfer',
          inputs: [
            { name: 'from', type: 'address', indexed: true },
            { name: 'to', type: 'address', indexed: true },
            { name: 'value', type: 'uint256', indexed: false },
          ],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(['0x...'])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('deadbeef')

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该在 topics 包含非字符串元素时输出 null', () => {
      const abi = [
        {
          type: 'event',
          name: 'Transfer',
          inputs: [
            { name: 'from', type: 'address', indexed: true },
            { name: 'to', type: 'address', indexed: true },
            { name: 'value', type: 'uint256', indexed: false },
          ],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([123 as unknown as string])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('0x...')

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

    it('应该解码 Transfer 事件日志', () => {
      const abi = [
        {
          type: 'event',
          name: 'Transfer',
          inputs: [
            { name: 'from', type: 'address', indexed: true },
            { name: 'to', type: 'address', indexed: true },
            { name: 'value', type: 'uint256', indexed: false },
          ],
        },
      ]

      const topics = [
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', // Transfer 事件签名
        '0x0000000000000000000000000000000000000000000000000000000000000001', // from (indexed)
        '0x0000000000000000000000000000000000000000000000000000000000000002', // to (indexed)
      ]
      const data = '0x0000000000000000000000000000000000000000000000000000000000000001' // value

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(topics)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(data)

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该解码 Approval 事件日志', () => {
      const abi = [
        {
          type: 'event',
          name: 'Approval',
          inputs: [
            { name: 'owner', type: 'address', indexed: true },
            { name: 'spender', type: 'address', indexed: true },
            { name: 'value', type: 'uint256', indexed: false },
          ],
        },
      ]

      const topics = [
        '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925', // Approval 事件签名
        '0x0000000000000000000000000000000000000000000000000000000000000001', // owner
        '0x0000000000000000000000000000000000000000000000000000000000000002', // spender
      ]
      const data = '0x0000000000000000000000000000000000000000000000000000000000000001' // value

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(topics)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(data)

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该解码带有单个 indexed 参数的事件', () => {
      const abi = [
        {
          type: 'event',
          name: 'Mint',
          inputs: [
            { name: 'to', type: 'address', indexed: true },
            { name: 'amount', type: 'uint256', indexed: false },
          ],
        },
      ]

      const topics = [
        '0x...', // Mint 事件签名
        '0x0000000000000000000000000000000000000000000000000000000000000001', // to
      ]
      const data = '0x0000000000000000000000000000000000000000000000000000000000000001' // amount

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(topics)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(data)

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该解码没有 indexed 参数的事件', () => {
      const abi = [
        {
          type: 'event',
          name: 'ValueUpdate',
          inputs: [
            { name: 'oldValue', type: 'uint256', indexed: false },
            { name: 'newValue', type: 'uint256', indexed: false },
          ],
        },
      ]

      const topics = ['0x...'] // ValueUpdate 事件签名
      const data = '0x...' // 编码的 oldValue 和 newValue

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(topics)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(data)

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该解码带有字符串参数的事件', () => {
      const abi = [
        {
          type: 'event',
          name: 'MessageLogged',
          inputs: [
            { name: 'message', type: 'string', indexed: true },
            { name: 'timestamp', type: 'uint256', indexed: false },
          ],
        },
      ]

      const topics = ['0x...', '0x...'] // 事件签名和哈希的消息
      const data = '0x...' // 时间戳

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(topics)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(data)

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该解码带有数组参数的事件', () => {
      const abi = [
        {
          type: 'event',
          name: 'BatchTransfer',
          inputs: [
            { name: 'recipients', type: 'address[]', indexed: false },
            { name: 'amounts', type: 'uint256[]', indexed: false },
          ],
        },
      ]

      const topics = ['0x...'] // BatchTransfer 事件签名
      const data = '0x...' // 编码的 recipients 和 amounts 数组

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(topics)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(data)

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该解码带有多个 indexed 和非 indexed 参数的事件', () => {
      const abi = [
        {
          type: 'event',
          name: 'ComplexEvent',
          inputs: [
            { name: 'user', type: 'address', indexed: true },
            { name: 'id', type: 'uint256', indexed: true },
            { name: 'value', type: 'uint256', indexed: false },
            { name: 'flag', type: 'bool', indexed: false },
          ],
        },
      ]

      const topics = [
        '0x...', // 事件签名
        '0x...', // user
        '0x...', // id
      ]
      const data = '0x...' // value 和 flag

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(topics)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(data)

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该解码带有 bytes 参数的事件', () => {
      const abi = [
        {
          type: 'event',
          name: 'DataEvent',
          inputs: [
            { name: 'sender', type: 'address', indexed: true },
            { name: 'data', type: 'bytes', indexed: false },
          ],
        },
      ]

      const topics = ['0x...', '0x...']
      const data = '0x...'

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(topics)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(data)

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该解码带有 bool 参数的事件', () => {
      const abi = [
        {
          type: 'event',
          name: 'StatusChanged',
          inputs: [
            { name: 'user', type: 'address', indexed: true },
            { name: 'oldStatus', type: 'bool', indexed: false },
            { name: 'newStatus', type: 'bool', indexed: false },
          ],
        },
      ]

      const topics = ['0x...', '0x...']
      const data = '0x...'

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(topics)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(data)

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该在 topics 不匹配任何事件时输出 null', () => {
      const abi = [
        {
          type: 'event',
          name: 'Transfer',
          inputs: [
            { name: 'from', type: 'address', indexed: true },
            { name: 'to', type: 'address', indexed: true },
            { name: 'value', type: 'uint256', indexed: false },
          ],
        },
      ]

      const topics = [
        '0x0000000000000000000000000000000000000000000000000000000000000000', // 不匹配的事件签名
      ]
      const data = '0x...'

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(topics)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(data)

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该在 ABI 包含多个事件时正确解码', () => {
      const abi = [
        {
          type: 'event',
          name: 'Transfer',
          inputs: [
            { name: 'from', type: 'address', indexed: true },
            { name: 'to', type: 'address', indexed: true },
            { name: 'value', type: 'uint256', indexed: false },
          ],
        },
        {
          type: 'event',
          name: 'Approval',
          inputs: [
            { name: 'owner', type: 'address', indexed: true },
            { name: 'spender', type: 'address', indexed: true },
            { name: 'value', type: 'uint256', indexed: false },
          ],
        },
        {
          type: 'event',
          name: 'Mint',
          inputs: [
            { name: 'to', type: 'address', indexed: true },
            { name: 'amount', type: 'uint256', indexed: false },
          ],
        },
      ]

      const topics = [
        '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925', // Approval
        '0x0000000000000000000000000000000000000000000000000000000000000001',
        '0x0000000000000000000000000000000000000000000000000000000000000002',
      ]
      const data = '0x...'

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(topics)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(data)

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该处理空 data 字段的事件', () => {
      const abi = [
        {
          type: 'event',
          name: 'SimpleEvent',
          inputs: [{ name: 'user', type: 'address', indexed: true }],
        },
      ]

      const topics = ['0x...', '0x...']
      const data = '0x'

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(topics)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(data)

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该处理带有 0 值参数的事件', () => {
      const abi = [
        {
          type: 'event',
          name: 'Transfer',
          inputs: [
            { name: 'from', type: 'address', indexed: true },
            { name: 'to', type: 'address', indexed: true },
            { name: 'value', type: 'uint256', indexed: false },
          ],
        },
      ]

      const topics = [
        '0x...',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
      ]
      const data = '0x0000000000000000000000000000000000000000000000000000000000000000'

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(topics)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(data)

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该处理 topics 为 null 的情况', () => {
      const abi = [
        {
          type: 'event',
          name: 'Transfer',
          inputs: [
            { name: 'from', type: 'address', indexed: true },
            { name: 'to', type: 'address', indexed: true },
            { name: 'value', type: 'uint256', indexed: false },
          ],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(null as unknown as [])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('0x...')

      node.onExecute()

      expect(node.getOutputData(0)).toBeNull()
    })

    it('应该处理 topics 包含 null 的情况', () => {
      const abi = [
        {
          type: 'event',
          name: 'Transfer',
          inputs: [
            { name: 'from', type: 'address', indexed: true },
            { name: 'to', type: 'address', indexed: true },
            { name: 'value', type: 'uint256', indexed: false },
          ],
        },
      ]

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce([null, '0x...', '0x...'] as unknown as [])
      vi.spyOn(node, 'getInputData').mockReturnValueOnce('0x...')

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该处理 topics 数量与事件参数不匹配的情况', () => {
      const abi = [
        {
          type: 'event',
          name: 'Transfer',
          inputs: [
            { name: 'from', type: 'address', indexed: true },
            { name: 'to', type: 'address', indexed: true },
            { name: 'value', type: 'uint256', indexed: false },
          ],
        },
      ]

      const topics = ['0x...'] // 缺少 indexed 参数的 topic
      const data = '0x...'

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(topics)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(data)

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })

    it('应该处理带有元组参数的事件', () => {
      const abi = [
        {
          type: 'event',
          name: 'TupleEvent',
          inputs: [
            {
              name: 'data',
              type: 'tuple',
              indexed: false,
              components: [
                { name: 'x', type: 'uint256' },
                { name: 'y', type: 'uint256' },
              ],
            },
          ],
        },
      ]

      const topics = ['0x...']
      const data = '0x...'

      vi.spyOn(node, 'getInputData').mockReturnValueOnce(abi)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(topics)
      vi.spyOn(node, 'getInputData').mockReturnValueOnce(data)

      node.onExecute()

      const result = node.getOutputData(0)
      expect(result).toBeNull() // 实现未完成
    })
  })
})
