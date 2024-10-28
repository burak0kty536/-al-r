/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SOLANA_RPC_URL: string
  readonly VITE_ETH_RPC_URL: string
  readonly VITE_BSC_RPC_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}