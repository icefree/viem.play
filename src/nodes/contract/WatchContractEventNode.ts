import { LGraphNode } from 'litegraph.js'
import { type PublicClient, type Address, type Abi, type WatchContractEventOnLogsParameter } from 'viem'

/**
 * watchContractEvent 节点 - 监听合约事件
 */
export class WatchContractEventNode extends LGraphNode {
  static title = 'watchContractEvent'
  static desc = 'Watch for contract events'

  color = '#3182ce'
  bgcolor = '#2a4365'

  private unwatch: (() => void) | null = null
  private latestLogs: any[] = []

  constructor() {
    super()
    this.title = 'watchContractEvent'
    this.addInput('client', 'publicClient')
    this.addInput('address', 'address')
    this.addInput('abi', 'abi')
    this.addInput('eventName', 'string')
    this.addInput('trigger', -1)
    this.addOutput('logs', 'array')
    this.addOutput('latestLog', 'object')
    this.size = [200, 120]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      // 如果已有监听，先停止
      if (this.unwatch) {
        this.unwatch()
        this.unwatch = null
      }

      const client = this.getInputData(0) as PublicClient | undefined
      const address = this.getInputData(1) as Address | undefined
      const abi = this.getInputData(2) as Abi | undefined
      const eventName = this.getInputData(3) as string | undefined

      if (!client || !address || !abi) return

      try {
        this.unwatch = client.watchContractEvent({
          address,
          abi,
          ...(eventName && { eventName }),
          onLogs: (logs: WatchContractEventOnLogsParameter<Abi>) => {
            this.latestLogs = logs as any[]
          }
        })
      } catch (err) {
        console.error(err)
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.latestLogs)
    this.setOutputData(1, this.latestLogs[this.latestLogs.length - 1] || null)
  }

  onRemoved() {
    if (this.unwatch) {
      this.unwatch()
      this.unwatch = null
    }
  }
}
