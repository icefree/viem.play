import { LiteGraph } from 'litegraph.js'
import { ButtonNode } from './ButtonNode'
import { TimerNode } from './TimerNode'

export function registerControlNodes() {
  LiteGraph.registerNodeType('Control/Button', ButtonNode)
  LiteGraph.registerNodeType('Control/Timer', TimerNode)
}

export { ButtonNode, TimerNode }
