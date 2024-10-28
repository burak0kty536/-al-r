import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { PriceMonitor } from '../services/price/PriceMonitor';

interface PriceChartProps {
  chain: string;
  tokenAddress?: string;
}

export const PriceChart: React.FC<PriceChartProps> = ({ chain, tokenAddress }) => {
  const [priceData, setPriceData] = useState<PricePoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!tokenAddress) return;

    const priceMonitor = new PriceMonitor();
    setIsLoading(true);

    const startTracking = async () => {
      await priceMonitor.startPriceTracking({
        chain,
        tokenAddress,
        interval: 15000, // 15 seconds
        onPrice: (price) => {
          setPriceData(prev => [...prev, {
            timestamp: new Date().toLocaleTimeString(),
            price
          }].slice(-50)); // Keep last 50 points
        },
        onError: (error) => {
          console.error('Price tracking error:', error);
        }
      });
      setIsLoading(false);
    };

    startTracking();
  }, [chain, tokenAddress]);

  if (!tokenAddress) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        Select a token to view price chart
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={priceData}>
          <XAxis 
            dataKey="timestamp"
            stroke="#6B7280"
            tick={{ fill: '#6B7280' }}
          />
          <YAxis 
            stroke="#6B7280"
            tick={{ fill: '#6B7280' }}
            domain={['auto', 'auto']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: 'none',
              borderRadius: '0.375rem',
              color: '#F3F4F6'
            }}
          />
          <Line 
            type="monotone"
            dataKey="price"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

interface PricePoint {
  timestamp: string;
  price: number;
}