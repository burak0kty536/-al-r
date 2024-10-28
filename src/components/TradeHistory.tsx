import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface TradeHistoryProps {
  chain: string;
}

export const TradeHistory: React.FC<TradeHistoryProps> = ({ chain }) => {
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    // Simulated trade history for demonstration
    setTrades([
      {
        id: '1',
        type: 'buy',
        token: 'SOL/USDC',
        amount: '100',
        price: '68.45',
        timestamp: new Date().toISOString(),
        status: 'completed',
        txHash: '0x123...abc'
      },
      {
        id: '2',
        type: 'sell',
        token: 'SOL/USDC',
        amount: '50',
        price: '69.20',
        timestamp: new Date().toISOString(),
        status: 'completed',
        txHash: '0x456...def'
      }
    ]);
  }, [chain]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-400">
            <th className="pb-4">Type</th>
            <th className="pb-4">Token</th>
            <th className="pb-4">Amount</th>
            <th className="pb-4">Price</th>
            <th className="pb-4">Time</th>
            <th className="pb-4">Status</th>
            <th className="pb-4">Tx Hash</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade) => (
            <tr key={trade.id} className="border-t border-gray-700">
              <td className="py-4">
                <div className="flex items-center gap-2">
                  {trade.type === 'buy' ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                  )}
                  {trade.type.toUpperCase()}
                </div>
              </td>
              <td className="py-4">{trade.token}</td>
              <td className="py-4">{trade.amount}</td>
              <td className="py-4">${trade.price}</td>
              <td className="py-4">
                {new Date(trade.timestamp).toLocaleTimeString()}
              </td>
              <td className="py-4">
                <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-500">
                  {trade.status}
                </span>
              </td>
              <td className="py-4">
                <a
                  href={`https://explorer.solana.com/tx/${trade.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-400"
                >
                  {`${trade.txHash.slice(0, 6)}...${trade.txHash.slice(-4)}`}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface Trade {
  id: string;
  type: 'buy' | 'sell';
  token: string;
  amount: string;
  price: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  txHash: string;
}