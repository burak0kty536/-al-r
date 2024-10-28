import { ethers } from 'ethers';
import { Connection } from '@solana/web3.js';

export class MEVProtection {
  private readonly GWEI_BOOST = 2; // Sandwich saldırılarını önlemek için gwei artışı

  async protectTransaction(params: MEVProtectionParams): Promise<Protected> {
    switch (params.chain) {
      case 'ethereum':
      case 'bsc':
        return this.protectEVMTransaction(params);
      case 'solana':
        return this.protectSolanaTransaction(params);
      default:
        throw new Error('Desteklenmeyen zincir');
    }
  }

  private async protectEVMTransaction(params: MEVProtectionParams): Promise<Protected> {
    const provider = new ethers.JsonRpcProvider(params.rpcUrl);
    const gasPrice = await provider.getFeeData();
    
    return {
      maxFeePerGas: gasPrice.maxFeePerGas! * BigInt(this.GWEI_BOOST),
      maxPriorityFeePerGas: gasPrice.maxPriorityFeePerGas! * BigInt(this.GWEI_BOOST),
      flashbotEnabled: true
    };
  }

  private async protectSolanaTransaction(params: MEVProtectionParams): Promise<Protected> {
    const connection = new Connection(params.rpcUrl);
    const slot = await connection.getSlot();
    
    return {
      computeUnitPrice: 1000, // Jito MEV koruması için
      computeUnitLimit: 1_400_000,
      skipPreflight: true
    };
  }
}

interface MEVProtectionParams {
  chain: string;
  rpcUrl: string;
  transaction: any;
}

interface Protected {
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
  flashbotEnabled?: boolean;
  computeUnitPrice?: number;
  computeUnitLimit?: number;
  skipPreflight?: boolean;
}