import React, { useState } from 'react';
import { Settings2, AlertTriangle, Shield, Wallet } from 'lucide-react';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Input } from './ui/input';

interface TradingControlsProps {
  chain: string;
  tokenAddress?: string;
}

export const TradingControls: React.FC<TradingControlsProps> = ({ chain, tokenAddress }) => {
  const [settings, setSettings] = useState({
    buyAmount: '0.1',
    slippage: 1,
    maxGas: 50,
    autoSell: true,
    profitTarget: 50,
    stopLoss: 20,
    antiRugEnabled: true,
    frontRunProtection: true,
    multiWallet: false
  });

  const [wallets, setWallets] = useState<WalletConfig[]>([
    { chain: 'ethereum', key: '', enabled: true },
    { chain: 'bsc', key: '', enabled: true },
    { chain: 'solana', key: '', enabled: true }
  ]);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleWalletChange = (index: number, field: string, value: any) => {
    const newWallets = [...wallets];
    newWallets[index] = { ...newWallets[index], [field]: value };
    setWallets(newWallets);
  };

  return (
    <div className="space-y-6">
      {/* Trading Settings */}
      <div className="bg-gray-800/50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Settings2 className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Trading Settings</h3>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Buy Amount ({chain === 'solana' ? 'SOL' : 'ETH/BNB'})</label>
              <Input
                type="number"
                value={settings.buyAmount}
                onChange={(e) => handleSettingChange('buyAmount', e.target.value)}
                className="w-full bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Slippage (%)</label>
              <Slider
                value={[settings.slippage]}
                onValueChange={([value]) => handleSettingChange('slippage', value)}
                min={0.1}
                max={100}
                step={0.1}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Profit Target (%)</label>
              <Slider
                value={[settings.profitTarget]}
                onValueChange={([value]) => handleSettingChange('profitTarget', value)}
                min={1}
                max={1000}
                step={1}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Stop Loss (%)</label>
              <Slider
                value={[settings.stopLoss]}
                onValueChange={([value]) => handleSettingChange('stopLoss', value)}
                min={1}
                max={100}
                step={1}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-gray-800/50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Security Settings</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium">Anti-Rug Protection</label>
              <p className="text-sm text-gray-400">Detect and prevent rug pulls</p>
            </div>
            <Switch
              checked={settings.antiRugEnabled}
              onCheckedChange={(value) => handleSettingChange('antiRugEnabled', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium">MEV Protection</label>
              <p className="text-sm text-gray-400">Prevent front-running attacks</p>
            </div>
            <Switch
              checked={settings.frontRunProtection}
              onCheckedChange={(value) => handleSettingChange('frontRunProtection', value)}
            />
          </div>
        </div>
      </div>

      {/* Wallet Management */}
      <div className="bg-gray-800/50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Wallet Management</h3>
        </div>

        <div className="space-y-4">
          {wallets.map((wallet, index) => (
            <div key={wallet.chain} className="flex items-center gap-4">
              <div className="w-24">
                <span className="text-sm font-medium capitalize">{wallet.chain}</span>
              </div>
              <Input
                type="password"
                placeholder="Private Key"
                value={wallet.key}
                onChange={(e) => handleWalletChange(index, 'key', e.target.value)}
                className="flex-1 bg-gray-700"
              />
              <Switch
                checked={wallet.enabled}
                onCheckedChange={(value) => handleWalletChange(index, 'enabled', value)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          onClick={() => {/* Start trading logic */}}
        >
          Start Trading
        </button>
        <button
          className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          onClick={() => {/* Stop trading logic */}}
        >
          Stop Trading
        </button>
      </div>
    </div>
  );
};

interface WalletConfig {
  chain: string;
  key: string;
  enabled: boolean;
}