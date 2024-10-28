import React, { useState, useEffect } from 'react';
import { PieChart, Briefcase, TrendingUp, TrendingDown } from 'lucide-react';
import { formatNumber } from '../utils/format';

interface PortfolioManagerProps {
  chain: string;
  walletAddress?: string;
}

export const PortfolioManager: React.FC<PortfolioManagerProps> = ({ chain, walletAddress }) => {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!walletAddress) return;

    const fetchPortfolio = async () => {
      setLoading(true);
      try {
        // Implement portfolio fetching based on chain and wallet
        const data = await getPortfolioData(chain, walletAddress);
        setPortfolio(data);
      } catch (error) {
        console.error('Portfolio fetch error:', error);
      }
      setLoading(false);
    };

    fetchPortfolio();
    const interval = setInterval(fetchPortfolio, 30000); // Update every 30s

    return () => clearInterval(interval);
  }, [chain, walletAddress]);

  if (!walletAddress || loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-32 bg-gray-700 rounded" />
          <div className="h-40 bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  if (!portfolio) return null;

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Portfolio Overview</h3>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">
            {formatNumber(portfolio.totalValue, 'currency')}
          </div>
          <div className={`text-sm ${
            portfolio.totalChange >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {portfolio.totalChange >= 0 ? '+' : ''}
            {portfolio.totalChange.toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {portfolio.assets.map((asset) => (
          <div
            key={asset.symbol}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50"
          >
            <div className="flex items-center gap-3">
              <img
                src={asset.logo}
                alt={asset.symbol}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <div className="font-medium">{asset.symbol}</div>
                <div className="text-sm text-gray-400">
                  {formatNumber(asset.amount, 'number')} tokens
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium">
                {formatNumber(asset.value, 'currency')}
              </div>
              <div className={`text-sm flex items-center gap-1 ${
                asset.change >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {asset.change >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {asset.change >= 0 ? '+' : ''}
                {asset.change.toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <div className="flex items-center gap-2 mb-4">
          <PieChart className="h-5 w-5 text-blue-500" />
          <h4 className="font-medium">Asset Allocation</h4>
        </div>
        <div className="h-40 flex items-center justify-center">
          {/* Implement pie chart visualization */}
          <div className="text-gray-400">Chart visualization here</div>
        </div>
      </div>
    </div>
  );
};

// Helper function to fetch portfolio data
const getPortfolioData = async (chain: string, address: string): Promise<PortfolioData> => {
  // Implement portfolio data fetching
  return {
    totalValue: 0,
    totalChange: 0,
    assets: []
  };
};

interface PortfolioData {
  totalValue: number;
  totalChange: number;
  assets: {
    symbol: string;
    name: string;
    logo: string;
    amount: number;
    value: number;
    change: number;
  }[];
}