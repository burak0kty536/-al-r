import React, { useState, useEffect } from 'react';
import { Wallet, Plus, Trash2, RefreshCw, ChevronDown, Shield, Coins } from 'lucide-react';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { WalletService } from '../services/wallet/WalletService';
import { formatNumber, formatAddress } from '../utils/format';

export const WalletManager = () => {
  const [wallets, setWallets] = useState<WalletInfo[]>([]);
  const [balances, setBalances] = useState<Record<string, TokenBalance[]>>({});
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [newWallet, setNewWallet] = useState({
    name: '',
    privateKey: '',
    type: 'ethereum' as WalletType
  });

  const walletService = new WalletService();

  useEffect(() => {
    loadWallets();
  }, []);

  useEffect(() => {
    // Her cüzdan için bakiyeleri yükle
    wallets.forEach(wallet => {
      fetchBalances(wallet);
    });

    // Her 30 saniyede bir bakiyeleri güncelle
    const interval = setInterval(() => {
      wallets.forEach(wallet => {
        fetchBalances(wallet);
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [wallets]);

  const loadWallets = async () => {
    const savedWallets = localStorage.getItem('wallets');
    if (savedWallets) {
      setWallets(JSON.parse(savedWallets));
    }
  };

  const saveWallets = (updatedWallets: WalletInfo[]) => {
    localStorage.setItem('wallets', JSON.stringify(updatedWallets));
    setWallets(updatedWallets);
  };

  const addWallet = async () => {
    if (!newWallet.privateKey) {
      alert('Lütfen private key girin');
      return;
    }

    try {
      const walletId = Date.now().toString();
      const address = await walletService.getAddressFromPrivateKey(newWallet.privateKey, newWallet.type);
      
      const wallet: WalletInfo = {
        id: walletId,
        name: newWallet.name || `${newWallet.type.toUpperCase()} Cüzdan ${wallets.length + 1}`,
        address,
        type: newWallet.type,
        privateKey: newWallet.privateKey
      };

      const updatedWallets = [...wallets, wallet];
      saveWallets(updatedWallets);
      fetchBalances(wallet);
      setNewWallet({ name: '', privateKey: '', type: 'ethereum' });
      setShowAddWallet(false);
    } catch (error) {
      alert('Geçersiz private key');
      console.error('Cüzdan ekleme hatası:', error);
    }
  };

  const removeWallet = (id: string) => {
    const updatedWallets = wallets.filter(wallet => wallet.id !== id);
    saveWallets(updatedWallets);
    setBalances(prev => {
      const newBalances = { ...prev };
      delete newBalances[id];
      return newBalances;
    });
  };

  const fetchBalances = async (wallet: WalletInfo) => {
    setIsLoading(prev => ({ ...prev, [wallet.id]: true }));
    try {
      const tokenBalances = await walletService.getTokenBalances(wallet);
      setBalances(prev => ({
        ...prev,
        [wallet.id]: tokenBalances
      }));
    } catch (error) {
      console.error('Bakiye yükleme hatası:', error);
    }
    setIsLoading(prev => ({ ...prev, [wallet.id]: false }));
  };

  const getWalletIcon = (type: WalletType) => {
    switch (type) {
      case 'ethereum':
        return '🌐';
      case 'bsc':
        return '💎';
      case 'solana':
        return '☀️';
      default:
        return '👛';
    }
  };

  return (
    <div className="space-y-6">
      {/* Toplam Bakiye */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Toplam Portföy Değeri</h2>
            <p className="text-3xl font-bold text-white mt-2">
              {formatNumber(totalBalance, 'currency')}
            </p>
          </div>
          <Coins className="h-12 w-12 text-white opacity-50" />
        </div>
      </div>

      {/* Cüzdan Ekleme */}
      <Dialog open={showAddWallet} onOpenChange={setShowAddWallet}>
        <DialogTrigger asChild>
          <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
            <Plus className="h-5 w-5" />
            Yeni Cüzdan Ekle
          </button>
        </DialogTrigger>
        <DialogContent className="bg-gray-900 border border-gray-800">
          <DialogHeader>
            <DialogTitle>Yeni Cüzdan Ekle</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Blockchain Ağı</label>
              <select
                value={newWallet.type}
                onChange={(e) => setNewWallet({ ...newWallet, type: e.target.value as WalletType })}
                className="w-full rounded-lg bg-gray-800 border-gray-700 text-white px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="ethereum">Ethereum (ETH)</option>
                <option value="bsc">Binance Smart Chain (BSC)</option>
                <option value="solana">Solana (SOL)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Cüzdan İsmi (Opsiyonel)</label>
              <Input
                placeholder="Örn: Ana Cüzdan"
                value={newWallet.name}
                onChange={(e) => setNewWallet({ ...newWallet, name: e.target.value })}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Private Key</label>
              <Input
                type="password"
                placeholder="Private key girin"
                value={newWallet.privateKey}
                onChange={(e) => setNewWallet({ ...newWallet, privateKey: e.target.value })}
                className="bg-gray-800 border-gray-700"
              />
              <p className="text-xs text-gray-500 mt-1">
                Private key'iniz güvenli bir şekilde saklanacaktır
              </p>
            </div>
            <button
              onClick={addWallet}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Cüzdan Ekle
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cüzdan Listesi */}
      <div className="grid gap-4">
        {wallets.map((wallet) => (
          <div
            key={wallet.id}
            className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-gray-700 transition-colors"
          >
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getWalletIcon(wallet.type)}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{wallet.name}</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-400">
                        {wallet.type.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      {formatAddress(wallet.address)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => fetchBalances(wallet)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    disabled={isLoading[wallet.id]}
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoading[wallet.id] ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={() => removeWallet(wallet.id)}
                    className="p-2 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Token Listesi */}
              <div className="mt-4 space-y-2">
                {balances[wallet.id]?.map((token, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {token.logo && (
                        <img
                          src={token.logo}
                          alt={token.symbol}
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <div>
                        <div className="font-medium">{token.symbol}</div>
                        <div className="text-sm text-gray-400">
                          {formatNumber(token.balance, 'number')}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {formatNumber(token.usdValue, 'currency')}
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading[wallet.id] && (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
                  </div>
                )}

                {!isLoading[wallet.id] && (!balances[wallet.id] || balances[wallet.id].length === 0) && (
                  <div className="text-center text-gray-500 py-4">
                    Token bulunamadı
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {wallets.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            Henüz cüzdan eklenmemiş
          </div>
        )}
      </div>
    </div>
  );
};

type WalletType = 'ethereum' | 'bsc' | 'solana';

interface WalletInfo {
  id: string;
  name: string;
  address: string;
  type: WalletType;
  privateKey: string;
}

interface TokenBalance {
  symbol: string;
  name: string;
  logo?: string;
  balance: number;
  usdValue: number;
}