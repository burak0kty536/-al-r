import React, { useState } from 'react';
import { Play, Pause, Settings } from 'lucide-react';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { TradingStrategy } from '../services/strategies/TradingStrategy';

interface AutoTraderProps {
  chain: string;
  tokenAddress?: string;
}

export const AutoTrader: React.FC<AutoTraderProps> = ({ chain, tokenAddress }) => {
  const [isActive, setIsActive] = useState(false);
  const [settings, setSettings] = useState({
    buyThreshold: 5, // Price drop percentage to trigger buy
    sellThreshold: 10, // Price increase percentage to trigger sell
    stopLoss: 5, // Stop loss percentage
    tradeSize: 0.1, // Trade size in chain native token
    maxSlippage: 1, // Maximum allowed slippage percentage
    gasBoost: 10, // Gas boost percentage for faster transactions
  });

  const handleStrategyToggle = async (enabled: boolean) => {
    if (enabled && tokenAddress) {
      const strategy = new TradingStrategy();
      await strategy.startAutoTrading({
        chain,
        tokenAddress,
        amount: settings.tradeSize,
        buyPrice: 0, // Current price - buyThreshold%
        sellPrice: 0, // Entry price + sellThreshold%
        stopLoss: settings.stopLoss,
        slippage: settings.maxSlippage,
        interval: 15000, // 15 seconds
        walletKey: '' // Get from secure storage
      });
    }
    setIsActive(enabled);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Auto Trading</h3>
        </div>
        <Switch
          checked={isActive}
          onCheckedChange={handleStrategyToggle}
        />
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Buy Threshold ({settings.buyThreshold}%)
          </label>
          <Slider
            value={[settings.buyThreshold]}
            onValueChange={([value]) => setSettings(prev => ({ ...prev, buyThreshold: value }))}
            min={1}
            max={20}
            step={1}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Sell Threshold ({settings.sellThreshold}%)
          </label>
          <Slider
            value={[settings.sellThreshold]}
            onValueChange={([value]) => setSettings(prev => ({ ...prev, sellThreshold: value }))}
            min={1}
            max={50}
            step={1}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Stop Loss ({settings.stopLoss}%)
          </label>
          <Slider
            value={[settings.stopLoss]}
            onValueChange={([value]) => setSettings(prev => ({ ...prev, stopLoss: value }))}
            min={1}
            max={20}
            step={1}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Trade Size ({settings.tradeSize} {chain.toUpperCase()})
          </label>
          <Slider
            value={[settings.tradeSize]}
            onValueChange={([value]) => setSettings(prev => ({ ...prev, tradeSize: value }))}
            min={0.1}
            max={10}
            step={0.1}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Max Slippage ({settings.maxSlippage}%)
          </label>
          <Slider
            value={[settings.maxSlippage]}
            onValueChange={([value]) => setSettings(prev => ({ ...prev, maxSlippage: value }))}
            min={0.1}
            max={5}
            step={0.1}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Gas Boost ({settings.gasBoost}%)
          </label>
          <Slider
            value={[settings.gasBoost]}
            onValueChange={([value]) => setSettings(prev => ({ ...prev, gasBoost: value }))}
            min={0}
            max={50}
            step={5}
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
        <div>
          <div className="font-medium">Strategy Status</div>
          <div className="text-sm text-gray-400">
            {isActive ? 'Running' : 'Stopped'}
          </div>
        </div>
        <button
          onClick={() => handleStrategyToggle(!isActive)}
          className={`p-2 rounded-lg ${
            isActive
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-green-500 hover:bg-green-600'
          } transition-colors`}
        >
          {isActive ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
};