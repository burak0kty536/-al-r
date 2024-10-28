import { z } from 'zod';

export const ChainConfig = z.object({
  rpcUrl: z.string(),
  wsUrl: z.string(),
  privateKey: z.string().optional(),
  minProfit: z.number(),
  maxLoss: z.number(),
  checkInterval: z.number(),
  routerAddresses: z.object({
    v2: z.string().optional(),
    v3: z.string().optional()
  }).optional()
});

export const SecurityConfig = z.object({
  checkInterval: z.number(),
  minLiquidityUsd: z.number(),
  maxCreatorTokensPercent: z.number(),
  minHolders: z.number(),
  checkContractVerification: z.boolean(),
  checkHoneypot: z.boolean(),
  checkMintFunction: z.boolean(),
  checkBlacklist: z.boolean()
});

export const TradingConfig = z.object({
  maxPositionsPerChain: z.number(),
  autoSell: z.boolean(),
  useTrailingStop: z.boolean(),
  trailingStopPercent: z.number(),
  gasBoostMultiplier: z.number()
});

export const Config = z.object({
  solana: ChainConfig,
  ethereum: ChainConfig,
  bsc: ChainConfig,
  security: SecurityConfig,
  trading: TradingConfig
});

export type ChainConfigType = z.infer<typeof ChainConfig>;
export type SecurityConfigType = z.infer<typeof SecurityConfig>;
export type TradingConfigType = z.infer<typeof TradingConfig>;
export type ConfigType = z.infer<typeof Config>;

export const defaultConfig: ConfigType = {
  solana: {
    rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
    wsUrl: process.env.SOLANA_WS_URL || 'wss://api.mainnet-beta.solana.com',
    privateKey: process.env.SOLANA_PRIVATE_KEY,
    minProfit: Number(process.env.SOLANA_MIN_PROFIT) || 2.5,
    maxLoss: Number(process.env.SOLANA_MAX_LOSS) || 1.0,
    checkInterval: Number(process.env.SOLANA_CHECK_INTERVAL) || 5000
  },
  ethereum: {
    rpcUrl: process.env.ETH_RPC_URL || '',
    wsUrl: process.env.ETH_WS_URL || '',
    privateKey: process.env.ETH_PRIVATE_KEY,
    minProfit: Number(process.env.ETH_MIN_PROFIT) || 1.5,
    maxLoss: Number(process.env.ETH_MAX_LOSS) || 0.8,
    checkInterval: Number(process.env.ETH_CHECK_INTERVAL) || 3000,
    routerAddresses: {
      v2: process.env.UNISWAP_V2_ROUTER || '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
      v3: process.env.UNISWAP_V3_ROUTER || '0xE592427A0AEce92De3Edee1F18E0157C05861564'
    }
  },
  bsc: {
    rpcUrl: process.env.BSC_RPC_URL || '',
    wsUrl: process.env.BSC_WS_URL || '',
    privateKey: process.env.BSC_PRIVATE_KEY,
    minProfit: Number(process.env.BSC_MIN_PROFIT) || 2.0,
    maxLoss: Number(process.env.BSC_MAX_LOSS) || 1.2,
    checkInterval: Number(process.env.BSC_CHECK_INTERVAL) || 4000,
    routerAddresses: {
      v2: process.env.PANCAKE_V2_ROUTER || '0x10ED43C718714eb63d5aA57B78B54704E256024E',
      v3: process.env.PANCAKE_V3_ROUTER || '0x13f4EA83D0bd40E75C8222255bc855a974568Dd4'
    }
  },
  security: {
    checkInterval: Number(process.env.SECURITY_CHECK_INTERVAL) || 2000,
    minLiquidityUsd: Number(process.env.MIN_LIQUIDITY_USD) || 10000,
    maxCreatorTokensPercent: Number(process.env.MAX_CREATOR_TOKENS_PERCENT) || 20,
    minHolders: Number(process.env.MIN_HOLDERS) || 50,
    checkContractVerification: process.env.CHECK_CONTRACT_VERIFICATION === 'true',
    checkHoneypot: process.env.CHECK_HONEYPOT === 'true',
    checkMintFunction: process.env.CHECK_MINT_FUNCTION === 'true',
    checkBlacklist: process.env.CHECK_BLACKLIST === 'true'
  },
  trading: {
    maxPositionsPerChain: Number(process.env.MAX_POSITIONS_PER_CHAIN) || 5,
    autoSell: process.env.AUTO_SELL === 'true',
    useTrailingStop: process.env.USE_TRAILING_STOP === 'true',
    trailingStopPercent: Number(process.env.TRAILING_STOP_PERCENT) || 1.5,
    gasBoostMultiplier: Number(process.env.GAS_BOOST_MULTIPLIER) || 1.2
  }
};