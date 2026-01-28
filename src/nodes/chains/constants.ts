import {
  mainnet,
  sepolia,
  holesky,
  polygon,
  polygonAmoy,
  arbitrum,
  arbitrumSepolia,
  optimism,
  optimismSepolia,
  base,
  baseSepolia,
  type Chain,
} from 'viem/chains'

// Define a local anvil chain
export const anvil: Chain = {
  id: 31337,
  name: 'Anvil',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
  },
}

// Available chains organized by network type
export const MAINNETS: Record<string, Chain> = {
  mainnet,
  polygon,
  arbitrum,
  optimism,
  base,
}

export const TESTNETS: Record<string, Chain> = {
  sepolia,
  holesky,
  polygonAmoy,
  arbitrumSepolia,
  optimismSepolia,
  baseSepolia,
  anvil,
}

export const ALL_CHAINS: Record<string, Chain> = {
  ...MAINNETS,
  ...TESTNETS,
}

export const CHAIN_NAMES = Object.keys(ALL_CHAINS)
