import { SolanaDEX } from '../dex/SolanaDEX';
import { BinanceDEX } from '../dex/BinanceDEX';
import { EthereumDEX } from '../dex/EthereumDEX';
import { ethers } from 'ethers';

export class TradingEngine {
  private solanaDEX: SolanaDEX;
  private binanceDEX: BinanceDEX;
  private ethereumDEX: EthereumDEX;

  constructor() {
    // Initialize DEX instances with appropriate providers
    this.solanaDEX = new SolanaDEX('https://api.mainnet-beta.solana.com');
    this.binanceDEX = new BinanceDEX(new ethers.JsonRpcProvider('https://bsc-dataseed.binance.org'));
    this.ethereumDEX = new EthereumDEX(
      new ethers.JsonRpcProvider('https://eth-mainnet.g.alchemy.com/v2/your-api-key'),
      'your-1inch-api-key'
    );
  }

  async getBestQuote(params: QuoteParams): Promise<QuoteResult> {
    const { chain, tokenIn, tokenOut, amount } = params;

    switch (chain) {
      case 'solana': {
        const [jupiterQuote, raydiumQuote] = await Promise.all([
          this.solanaDEX.getJupiterQuote({ inputMint: tokenIn, outputMint: tokenOut, amount }),
          this.solanaDEX.getRaydiumQuote({ inputMint: tokenIn, outputMint: tokenOut, amount })
        ]);

        return this.getBestSolanaQuote(jupiterQuote, raydiumQuote);
      }

      case 'bsc': {
        const [v2Quote, v3Quote] = await Promise.all([
          this.binanceDEX.getPancakeV2Quote({ tokenIn, tokenOut, amount }),
          this.binanceDEX.getPancakeV3Quote({ tokenIn, tokenOut, amount })
        ]);

        return this.getBestBscQuote(v2Quote, v3Quote);
      }

      case 'ethereum': {
        const [uniV2Quote, uniV3Quote, oneInchQuote] = await Promise.all([
          this.ethereumDEX.getUniswapV2Quote({ tokenIn, tokenOut, amount }),
          this.ethereumDEX.getUniswapV3Quote({ tokenIn, tokenOut, amount }),
          this.ethereumDEX.get1InchQuote({ tokenIn, tokenOut, amount })
        ]);

        return this.getBestEthereumQuote(uniV2Quote, uniV3Quote, oneInchQuote);
      }

      default:
        throw new Error('Unsupported chain');
    }
  }

  async executeTrade(params: TradeParams): Promise<TradeResult> {
    const { chain, quote, wallet, slippage } = params;

    try {
      let txHash;

      switch (chain) {
        case 'solana':
          if (quote.dex === 'jupiter') {
            txHash = await this.solanaDEX.executeJupiterSwap({ route: quote.route, wallet });
          } else {
            txHash = await this.solanaDEX.executeRaydiumSwap({ route: quote.route, wallet });
          }
          break;

        case 'bsc':
          if (quote.dex === 'pancakeswap_v2') {
            txHash = await this.binanceDEX.executePancakeV2Swap({ route: quote.route, wallet, slippage });
          } else {
            txHash = await this.binanceDEX.executePancakeV3Swap({ route: quote.route, wallet, slippage });
          }
          break;

        case 'ethereum':
          if (quote.dex === 'uniswap_v2') {
            txHash = await this.ethereumDEX.executeUniswapV2Swap({ route: quote.route, wallet, slippage });
          } else if (quote.dex === 'uniswap_v3') {
            txHash = await this.ethereumDEX.executeUniswapV3Swap({ route: quote.route, wallet, slippage });
          } else {
            txHash = await this.ethereumDEX.execute1InchSwap({ quote: quote.route, wallet, slippage });
          }
          break;

        default:
          throw new Error('Unsupported chain');
      }

      return {
        success: true,
        txHash,
        dex: quote.dex
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        dex: quote.dex
      };
    }
  }

  private getBestSolanaQuote(jupiterQuote: any, raydiumQuote: any) {
    // Compare quotes and return the best one
    if (!jupiterQuote) return { dex: 'raydium', route: raydiumQuote };
    if (!raydiumQuote) return { dex: 'jupiter', route: jupiterQuote };

    return jupiterQuote.outAmount > raydiumQuote.outAmount
      ? { dex: 'jupiter', route: jupiterQuote }
      : { dex: 'raydium', route: raydiumQuote };
  }

  private getBestBscQuote(v2Quote: any, v3Quote: any) {
    // Compare quotes and return the best one
    if (!v2Quote) return { dex: 'pancakeswap_v3', route: v3Quote };
    if (!v3Quote) return { dex: 'pancakeswap_v2', route: v2Quote };

    return v2Quote.executionPrice > v3Quote.executionPrice
      ? { dex: 'pancakeswap_v2', route: v2Quote }
      : { dex: 'pancakeswap_v3', route: v3Quote };
  }

  private getBestEthereumQuote(uniV2Quote: any, uniV3Quote: any, oneInchQuote: any) {
    // Compare all quotes and return the best one
    const quotes = [
      { dex: 'uniswap_v2', route: uniV2Quote },
      { dex: 'uniswap_v3', route: uniV3Quote },
      { dex: '1inch', route: oneInchQuote }
    ].filter(q => q.route);

    return quotes.reduce((best, current) => {
      if (!best.route) return current;
      return current.route.executionPrice > best.route.executionPrice ? current : best;
    });
  }
}

interface QuoteParams {
  chain: string;
  tokenIn: string;
  tokenOut: string;
  amount: number;
}

interface QuoteResult {
  dex: string;
  route: any;
}

interface TradeParams {
  chain: string;
  quote: QuoteResult;
  wallet: any;
  slippage: number;
}

interface TradeResult {
  success: boolean;
  txHash?: string;
  error?: string;
  dex: string;
}