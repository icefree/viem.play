import {
  LGraphNode,
  LiteGraph,
  INodeInputSlot,
  INodeOutputSlot,
  LGraphCanvas,
  LGraph,
} from "litegraph.js";

// Type declarations for viem
import { type PublicClient, type WalletClient, type Chain } from "viem";

export interface ViemNodeData {
  client?: PublicClient | WalletClient;
  chain?: Chain;
  address?: string;
  value?: bigint;
  hash?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// Base class for all viem-related nodes
export class ViemNode extends LGraphNode {
  static title = "Viem Node";
  static desc = "Base viem node";

  // Custom styling
  color = "#2a363b";
  bgcolor = "#1a2327";

  constructor() {
    super();
    this.size = [200, 60];
  }

  // Helper to format BigInt for display
  formatBigInt(value: bigint | undefined): string {
    if (value === undefined) return "undefined";
    return value.toString();
  }

  // Helper to truncate address
  truncateAddress(address: string): string {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
}

// Export LiteGraph types and utilities
export { LGraphNode, LiteGraph, LGraphCanvas, LGraph };
export type { INodeInputSlot, INodeOutputSlot };
