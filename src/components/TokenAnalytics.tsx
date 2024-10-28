import React, { useEffect, useState } from 'react';
import { BarChart, Wallet as WalletIcon, Users, DollarSign } from 'lucide-react';
import { formatNumber } from '../utils/format';

interface TokenAnalyticsProps {
  chain: string;
  tokenAddress?: string;
}

export const TokenAnalytics: React.FC<TokenAnalyticsProps> = ({ chain, tokenAddress }) => {
  const [analytics, setAnalytics] = useState<TokenAnalytics | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!tokenAddress) return;

    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        // Implement analytics fetching based on chain
        const data = await getTokenAnalytics(chain, tokenAddress);
        setAnalytics(data);
      } catch (error) {
        console.error('Analytics fetch error:', error);
      }
      setLoading(false);
    };

    fetchAnalytics();
  }, [chain, tokenAddress]);

  if (!tokenAddress || loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-800/50 rounded-lg p-4 animate-pulse"
          >
            <div className="h-4 w-20 bg-gray-700 rounded mb-2" />
            <div className="h-6 w-32 bg-gray-700 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!analytics) return null;

  const metrics = [
    {
      icon: DollarSign,
      label: 'Market Cap',
      value: formatNumber(analytics.marketCap, 'currency'),
      change: analytics.marketCapChange24h
    },
    {
      icon: BarChart,
      label: 'Volume 24h',
      value: formatNumber(analytics.volume24h, 'currency'),
      change: analytics.volumeChange24h
    },
    {
      icon: WalletIcon,
      label: 'Holders',
      value: formatNumber(analytics.holders, 'number'),
      change: analytics.holdersChange24h
    },
    {
      icon: Users,
      label: 'Transactions 24h',
      value: formatNumber(analytics.transactions24h, 'number'),
      change: analytics.transactionsChange24h
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <div
            key={metric.label}
            className="bg-gray-800/50 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Icon className="h-4 w-4" />
              <span className="text-sm">{metric.label}</span>
            </div>
            <div className="text-lg font-semibold">{metric.value}</div>
            {metric.change !== undefined && (
              <div className={`text-sm ${metric.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {metric.change >= 0 ? '+' : ''}{metric.change.toFixed(2)}%
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Helper function to fetch token analytics (implement based on chain)
const getTokenAnalytics = async (chain: string, address: string): Promise<TokenAnalytics> => {
  // Implement analytics fetching logic based on chain
  return {
    marketCap: 0,
    marketCapChange24h: 0,
    volume24h: 0,
    volumeChange24h: 0,
    holders: 0,
    holdersChange24h: 0,
    transactions24h: 0,
    transactionsChange24h: 0
  };
};

interface TokenAnalytics {
  marketCap: number;
  marketCapChange24h: number;
  volume24h: number;
  volumeChange24h: number;
  holders: number;
  holdersChange24h: number;
  transactions24h: number;
  transactionsChange24h: number;
}