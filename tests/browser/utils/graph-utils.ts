import { Page, expect } from '@playwright/test'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    LiteGraph: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    graph: any
  }
}

/**
 * Controller for interacting with the LiteGraph instance in the browser
 */
export class GraphController {
  constructor(private page: Page) {}

  /**
   * Create a node by type name
   */
  async createNode(type: string, options: { x?: number; y?: number } = {}) {
    const { x = 100, y = 100 } = options
    const nodeId = await this.page.evaluate(
      ({ type, x, y }) => {
        if (!window.LiteGraph || !window.graph) {
          throw new Error('LiteGraph or graph instance not found on window')
        }
        const node = window.LiteGraph.createNode(type)
        if (!node) {
          throw new Error(`Node type "${type}" not registered`)
        }
        node.pos = [x, y]
        window.graph.add(node)
        return node.id as number
      },
      { type, x, y }
    )
    return nodeId
  }

  /**
   * Connect two nodes
   */
  async connectNodes(
    sourceId: number,
    outputIndex: number,
    targetId: number,
    inputIndex: number
  ) {
    await this.page.evaluate(
      ({ sourceId, outputIndex, targetId, inputIndex }) => {
        const sourceNode = window.graph.getNodeById(sourceId)
        const targetNode = window.graph.getNodeById(targetId)
        
        if (!sourceNode) throw new Error(`Source node ${sourceId} not found`)
        if (!targetNode) throw new Error(`Target node ${targetId} not found`)
        
        sourceNode.connect(outputIndex, targetNode, inputIndex)
      },
      { sourceId, outputIndex, targetId, inputIndex }
    )
  }

  /**
   * Set value for a widget on a node
   * Note: This assumes the widget index is known. 
   * Many nodes use widgets for input configuration.
   */
  async setWidgetValue(nodeId: number, widgetIndex: number, value: unknown) {
    await this.page.evaluate(
      ({ nodeId, widgetIndex, value }) => {
        const node = window.graph.getNodeById(nodeId)
        if (!node) throw new Error(`Node ${nodeId} not found`)
        if (!node.widgets || !node.widgets[widgetIndex]) {
           throw new Error(`Widget at index ${widgetIndex} not found for node ${nodeId}`)
        }
        const widget = node.widgets[widgetIndex]
        widget.value = value
        if (widget.callback) {
            widget.callback(value, window.graph.canvas, node, [0,0], null)
        }
        node.setDirtyCanvas(true, true)
      },
      { nodeId, widgetIndex, value }
    )
  }

  /**
   * Set a property value on a node directly
   */
  async setNodeProperty(nodeId: number, property: string, value: any) {
    await this.page.evaluate(
      ({ nodeId, property, value }) => {
        const node = window.graph.getNodeById(nodeId)
        if (node) {
          node.properties[property] = value
          // Force update widgets if property is linked
          if (node.widgets) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const widget = node.widgets.find((w: any) => w.name === property || w.label === property)
            if (widget) {
              widget.value = value
              if (widget.callback) widget.callback(value)
            }
          }
        }
      },
      { nodeId, property, value }
    )
  }

  /**
   * Get the display value from a Display node
   */
  async getDisplayValue(nodeId: number): Promise<string> {
    return await this.page.evaluate(
      ({ nodeId }) => {
        const node = window.graph.getNodeById(nodeId)
        if (!node) throw new Error(`Node ${nodeId} not found`)
        // Access private property or through public getter if available
        // DisplayNode stores it in 'displayValue' property
        return (node as any).displayValue
      },
      { nodeId }
    )
  }
  
  /**
   * Wait for a node to have a specific display value
   */
  async waitForDisplayValue(nodeId: number, expectedPayload: string | RegExp, timeout = 5000) {
      await expect(async () => {
          const val = await this.getDisplayValue(nodeId)
          if (typeof expectedPayload === 'string') {
             expect(val).toContain(expectedPayload)
          } else {
             expect(val).toMatch(expectedPayload)
          }
      }).toPass({ timeout })
  }

  /**
   * Get the data from a specific output slot of a node
   */
  async getNodeOutput(nodeId: number, outputIndex: number): Promise<unknown> {
    return await this.page.evaluate(
      ({ nodeId, outputIndex }) => {
        const node = window.graph.getNodeById(nodeId)
        if (!node) throw new Error(`Node ${nodeId} not found`)
        return node.getOutputData(outputIndex)
      },
      { nodeId, outputIndex }
    )
  }

  /**
   * Trigger a node's output slot (simulates action trigger)
   */
  async triggerNode(nodeId: number, slotIndex = 0) {
    await this.page.evaluate(
      ({ nodeId, slotIndex }) => {
        const node = window.graph.getNodeById(nodeId)
        if (!node) throw new Error(`Node ${nodeId} not found`)
        node.triggerSlot(slotIndex, null)
      },
      { nodeId, slotIndex }
    )
  }

  /**
   * Wait for graph engine to run a few frames
   */
  async wait(ms: number) {
    await this.page.waitForTimeout(ms)
  }

  /**
   * Trigger a node's action (e.g., for a button-like action)
   */
  async triggerNodeAction(nodeId: number, action: string = 'trigger') {
    await this.page.evaluate(({ nodeId, action }) => {
      const node = window.graph.getNodeById(nodeId)
      if (node && node.onAction) node.onAction(action)
    }, { nodeId, action })
  }

  /**
   * Click a widget on a node
   */
  async clickWidget(nodeId: number, widgetIndex: number) {
    await this.page.evaluate(
      ({ nodeId, widgetIndex }) => {
        const node = window.graph.getNodeById(nodeId)
        if (!node) throw new Error(`Node ${nodeId} not found`)
        if (!node.widgets || !node.widgets[widgetIndex]) {
            throw new Error(`Widget ${widgetIndex} not found`)
        }
        const widget = node.widgets[widgetIndex]
        if (widget.callback) {
             widget.callback(widget.value, window.graph.canvas, node, [0,0], null)
        }
        node.setDirtyCanvas(true, true)
      },
      { nodeId, widgetIndex }
    )
  }
}
