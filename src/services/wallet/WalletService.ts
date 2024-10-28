import { ethers } from 'ethers';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';

export class WalletService {
  private solanaWallets: Map<string, Keypair>;
  private evmWallets: Map<string, ethers.Wallet>;

  constructor() {
    this.solanaWallets = new Map();
    this.evmWallets = new Map();
  }

  async connectMetaMask(): Promise<boolean> {
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask not installed');
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      return accounts && accounts.length > 0;
    } catch (error) {
      console.error('MetaMask connection error:', error);
      return false;
    }
  }

  addSolanaWallet(privateKey: string, label: string): void {
    try {
      const keypair = Keypair.fromSecretKey(
        Buffer.from(privateKey, 'base58')
      );
      this.solanaWallets.set(label, keypair);
    } catch (error) {
      console.error('Solana wallet error:', error);
      throw new Error('Invalid Solana private key');
    }
  }

  addEvmWallet(privateKey: string, label: string, provider: ethers.providers.Provider): void {
    try {
      const wallet = new ethers.Wallet(privateKey, provider);
      this.evmWallets.set(label, wallet);
    } catch (error) {
      console.error('EVM wallet error:', error);
      throw new Error('Invalid EVM private key');
    }
  }

  getSolanaWallet(label: string): Keypair | undefined {
    return this.solanaWallets.get(label);
  }

  getEvmWallet(label: string): ethers.Wallet | undefined {
    return this.evmWallets.get(label);
  }

  getAllSolanaWallets(): Map<string, Keypair> {
    return this.solanaWallets;
  }

  getAllEvmWallets(): Map<string, ethers.Wallet> {
    return this.evmWallets;
  }

  async getMetaMaskProvider(): Promise<any> {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask not installed');
    }
    
    if (!window.ethereum.isConnected()) {
      await this.connectMetaMask();
    }
    
    return window.ethereum;
  }

  removeWallet(label: string): void {
    this.solanaWallets.delete(label);
    this.evmWallets.delete(label);
  }

  async getSolanaTokenBalances(connection: Connection, wallet: Keypair): Promise<TokenBalance[]> {
    try {
      const publicKey = wallet.publicKey;
      
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        publicKey,
        { programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') }
      );

      return tokenAccounts.value.map(account => {
        const parsedInfo = account.account.data.parsed.info;
        return {
          symbol: parsedInfo.mint,
          name: parsedInfo.mint,
          balance: Number(parsedInfo.tokenAmount.amount) / Math.pow(10, parsedInfo.tokenAmount.decimals),
          usdValue: 0
        };
      });
    } catch (error) {
      console.error('Solana token balance error:', error);
      return [];
    }
  }

  async getEvmTokenBalances(wallet: ethers.Wallet, chain: string): Promise<TokenBalance[]> {
    try {
      // Implement ERC20 token balance fetching based on chain
      return [];
    } catch (error) {
      console.error('EVM token balance error:', error);
      return [];
    }
  }
}

interface TokenBalance {
  symbol: string;
  name: string;
  logo?: string;
  balance: number;
  usdValue: number;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}