import { LiteGraph } from 'litegraph.js'
import { PublicClientNode } from './PublicClientNode'
import { WalletClientNode } from './WalletClientNode'
import { TestClientNode } from './TestClientNode'
import { HttpTransportNode } from './HttpTransportNode'
import { WebSocketTransportNode } from './WebSocketTransportNode'
import { CustomClientNode } from './CustomClientNode'
import { CustomTransportNode } from './CustomTransportNode'
import { InjectedProviderNode } from './InjectedProviderNode'
import { InjectedWalletClientNode } from './InjectedWalletClientNode'

export function registerClientNodes() {
  // --- Clients ---
  LiteGraph.registerNodeType('Clients & Transports/Clients/PublicClient', PublicClientNode)
  LiteGraph.registerNodeType('Clients & Transports/Clients/WalletClient', WalletClientNode)
  LiteGraph.registerNodeType('Clients & Transports/Clients/TestClient', TestClientNode)
  LiteGraph.registerNodeType('Clients & Transports/Clients/CustomClient', CustomClientNode)
  LiteGraph.registerNodeType('Clients & Transports/Clients/InjectedWallet', InjectedWalletClientNode)

  // --- Transports ---
  LiteGraph.registerNodeType('Clients & Transports/Transports/http', HttpTransportNode)
  LiteGraph.registerNodeType('Clients & Transports/Transports/webSocket', WebSocketTransportNode)
  LiteGraph.registerNodeType('Clients & Transports/Transports/custom', CustomTransportNode)
  
  // --- Providers ---
  LiteGraph.registerNodeType('Clients & Transports/Providers/InjectedProvider', InjectedProviderNode)
}

export { 
  PublicClientNode, 
  WalletClientNode, 
  TestClientNode, 
  HttpTransportNode, 
  WebSocketTransportNode,
  CustomClientNode,
  CustomTransportNode,
  InjectedProviderNode,
  InjectedWalletClientNode
}
