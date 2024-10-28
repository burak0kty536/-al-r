import { EventEmitter } from '../../utils/EventEmitter';
import { WalletService } from '../wallet/WalletService';
import { TradingEngine } from '../trading/TradingEngine';
import { SecurityChecker } from '../security/SecurityChecker';
import { PriceMonitor } from '../price/PriceMonitor';
import { ConfigType } from '../../config/config';

export class TradingBot extends EventEmitter {
  private walletService: WalletService;
  private tradingEngine: TradingEngine;
  private securityChecker: SecurityChecker;
  private priceMonitor: PriceMonitor;
  private config: ConfigType;
  private activePositions: Map<string, Position>;
  private isRunning: boolean;

  constructor(config: ConfigType) {
    super();
    this.config = config;
    this.walletService = new WalletService();
    this.tradingEngine = new TradingEngine();
    this.securityChecker = new SecurityChecker();
    this.priceMonitor = new PriceMonitor();
    this.activePositions = new Map();
    this.isRunning = false;
  }

  async start(): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;

    // Her zincir için ayrı izleme başlat
    this.startChainMonitoring('solana');
    this.startChainMonitoring('ethereum');
    this.startChainMonitoring('bsc');

    this.emit('started');
  }

  private async startChainMonitoring(chain: string): Promise<void> {
    const chainConfig = this.config[chain as keyof ConfigType];
    if (!chainConfig) return;

    setInterval(async () => {
      try {
        // Aktif pozisyonları kontrol et
        await this.checkPositions(chain);

        // Yeni fırsatları tara
        await this.scanOpportunities(chain);
      } catch (error) {
        this.emit('error', { chain, error });
      }
    }, chainConfig.checkInterval);
  }

  private async checkPositions(chain: string): Promise<void> {
    const positions = Array.from(this.activePositions.values())
      .filter(p => p.chain === chain);

    for (const position of positions) {
      const currentPrice = await this.priceMonitor.getCurrentPrice(
        chain,
        position.tokenAddress
      );

      // Kar/zarar kontrolü
      const pnl = ((currentPrice - position.entryPrice) / position.entryPrice) * 100;

      // Trailing stop kontrolü
      if (this.config.trading.useTrailingStop) {
        if (currentPrice > position.highestPrice) {
          position.highestPrice = currentPrice;
          position.stopPrice = currentPrice * (1 - this.config.trading.trailingStopPercent / 100);
        }

        if (currentPrice <= position.stopPrice) {
          await this.closePosition(position);
          continue;
        }
      }

      // Otomatik satış kontrolü
      if (this.config.trading.autoSell) {
        const chainConfig = this.config[chain as keyof ConfigType];
        if (pnl >= chainConfig.minProfit || pnl <= -chainConfig.maxLoss) {
          await this.closePosition(position);
        }
      }
    }
  }

  private async scanOpportunities(chain: string): Promise<void> {
    // Mevcut pozisyon sayısını kontrol et
    const chainPositions = Array.from(this.activePositions.values())
      .filter(p => p.chain === chain);

    if (chainPositions.length >= this.config.trading.maxPositionsPerChain) {
      return;
    }

    // Yeni fırsatları tara ve güvenlik kontrollerini yap
    // Bu kısım DEX'lerden gelen verilere göre implement edilecek
  }

  private async closePosition(position: Position): Promise<void> {
    try {
      const result = await this.tradingEngine.executeTrade({
        chain: position.chain,
        tokenAddress: position.tokenAddress,
        amount: position.amount,
        type: 'sell',
        wallet: position.wallet
      });

      if (result.success) {
        this.activePositions.delete(position.id);
        this.emit('positionClosed', {
          position,
          txHash: result.txHash,
          profit: ((result.price - position.entryPrice) / position.entryPrice) * 100
        });
      }
    } catch (error) {
      this.emit('error', {
        type: 'closePosition',
        position,
        error
      });
    }
  }

  async stop(): Promise<void> {
    this.isRunning = false;
    this.emit('stopped');
  }

  async addWallet(chain: string, privateKey: string, label: string): Promise<void> {
    if (chain === 'solana') {
      this.walletService.addSolanaWallet(privateKey, label);
    } else {
      const provider = new ethers.JsonRpcProvider(this.config[chain as keyof ConfigType].rpcUrl);
      this.walletService.addEvmWallet(privateKey, label, provider);
    }
  }

  getActivePositions(): Position[] {
    return Array.from(this.activePositions.values());
  }
}

interface Position {
  id: string;
  chain: string;
  tokenAddress: string;
  amount: number;
  entryPrice: number;
  highestPrice: number;
  stopPrice: number;
  wallet: any;
}