import { ethers } from 'ethers';
import { Connection, PublicKey } from '@solana/web3.js';
import axios from 'axios';

export class PriceMonitor {
  private readonly PRICE_FEEDS = new Map<string, string>();
  private readonly DEXSCREENER_API = 'https://api.dexscreener.com/latest/dex/tokens/';

  constructor() {
    // Chainlink price feed addresses
    this.PRICE_FEEDS.set('ethereum', '0x...');
    this.PRICE_FEEDS.set('bsc', '0x...');
  }

  async getCurrentPrice(chain: string, tokenAddress: string): Promise<number> {
    try {
      // Get price from DexScreener API
      const response = await axios.get(`${this.DEXSCREENER_API}${tokenAddress}`);
      
      if (response.data.pairs && response.data.pairs.length > 0) {
        return parseFloat(response.data.pairs[0].priceUsd);
      }

      throw new Error('Price data not found');
    } catch (error) {
      console.error('Failed to fetch price:', error);
      throw error;
    }
  }

  async startPriceTracking(params: TrackingParams): Promise<void> {
    const checkPrice = async () => {
      try {
        const price = await this.getCurrentPrice(params.chain, params.tokenAddress);
        params.onPrice(price);
      } catch (error) {
        params.onError(error);
      }
    };

    setInterval(checkPrice, params.interval);
  }
}

interface TrackingParams {
  chain: string;
  tokenAddress: string;
  interval: number;
  onPrice: (price: number) => void;
  onError: (error: any) => void;
}