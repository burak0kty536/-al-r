import React, { useEffect, useState } from 'react';
import { Activity, AlertCircle } from 'lucide-react';
import { MempoolMonitor as MempoolService } from '../services/mempool/MempoolMonitor';

interface Transaction {
  chain: string;
  data: any;
  timestamp: number;
}

export const MempoolMonitor: React.FC<{ chain: string }> = ({ chain }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const monitor = new MempoolService();

    monitor.on('connected', (connectedChain) => {
      if (connectedChain === chain) {
        setStatus('connected');
        setError('');
      }
    });

    monitor.on('disconnected', (disconnectedChain) => {
      if (disconnectedChain === chain) {
        setStatus('disconnected');
      }
    });

    monitor.on('error', ({ chain: errorChain, error }) => {
      if (errorChain === chain) {
        setStatus('error');
        setError(error.message || 'Connection error');
      }
    });

    monitor.on('transaction', (tx) => {
      if (tx.chain === chain) {
        setTransactions(prev => [
          { ...tx, timestamp: Date.now() },
          ...prev.slice(0, 9) // Keep only last 10 transactions
        ]);
      }
    });

    monitor.startMonitoring(chain);

    return () => {
      monitor.stopMonitoring(chain);
    };
  }, [chain]);

  return (
    <div className="rounded-lg bg-gray-800 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Mempool Monitor</h3>
        </div>
        <div className="flex items-center gap-2">
          {status === 'connected' && (
            <span className="text-sm text-green-500">Connected</span>
          )}
          {status === 'disconnected' && (
            <span className="text-sm text-yellow-500">Disconnected</span>
          )}
          {status === 'error' && (
            <div className="flex items-center gap-1 text-red-500">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {transactions.map((tx, index) => (
          <div key={index} className="text-sm bg-gray-700 p-2 rounded">
            <div className="flex justify-between text-gray-400">
              <span>{new Date(tx.timestamp).toLocaleTimeString()}</span>
              <span>{tx.chain}</span>
            </div>
            <div className="font-mono text-xs truncate">
              {typeof tx.data === 'string' ? tx.data : JSON.stringify(tx.data)}
            </div>
          </div>
        ))}
        {transactions.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            No transactions yet
          </div>
        )}
      </div>
    </div>
  );
};