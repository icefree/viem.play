import { LiteGraph } from 'litegraph.js'
import { PublicClientNode } from './PublicClientNode'
import { WalletClientNode } from './WalletClientNode'
import { TestClientNode } from './TestClientNode'
import { HttpTransportNode } from './HttpTransportNode'
import { WebSocketTransportNode } from './WebSocketTransportNode'
import { ClientPlaceholderNode } from './ClientPlaceholderNode'

export function registerClientNodes() {
  // --- Clients ---
  LiteGraph.registerNodeType('Clients & Transports/Clients/PublicClient', PublicClientNode)
  LiteGraph.registerNodeType('Clients & Transports/Clients/WalletClient', WalletClientNode)
  LiteGraph.registerNodeType('Clients & Transports/Clients/TestClient', TestClientNode)
  LiteGraph.registerNodeType('Clients & Transports/Clients/CustomClient', class extends ClientPlaceholderNode { constructor() { super('Custom Client', 'Create a custom client', '#276749', '#1c4532') } })

  // --- Transports ---
  LiteGraph.registerNodeType('Clients & Transports/Transports/http', HttpTransportNode)
  LiteGraph.registerNodeType('Clients & Transports/Transports/webSocket', WebSocketTransportNode)
  LiteGraph.registerNodeType('Clients & Transports/Transports/custom', class extends ClientPlaceholderNode { constructor() { super('custom', 'Custom (EIP-1193) transport', '#2d3748', '#1a202c') } })
  // LiteGraph.registerNodeType('Clients & Transports/Transports/fallback', class extends ClientPlaceholderNode { constructor() { super('fallback', 'Fallback transport', '#2d3748', '#1a202c') } })
}

export { 
  PublicClientNode, 
  WalletClientNode, 
  TestClientNode, 
  HttpTransportNode, 
  WebSocketTransportNode,
  ClientPlaceholderNode
}
