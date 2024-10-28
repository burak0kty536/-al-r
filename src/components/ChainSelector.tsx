import React from 'react';
import { ChevronDown } from 'lucide-react';

interface ChainSelectorProps {
  value: string;
  onChange: (chain: string) => void;
}

export const ChainSelector: React.FC<ChainSelectorProps> = ({ value, onChange }) => {
  const chains = [
    { id: 'ethereum', name: 'Ethereum' },
    { id: 'bsc', name: 'BSC' },
    { id: 'solana', name: 'Solana' }
  ];

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-lg bg-gray-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {chains.map((chain) => (
          <option key={chain.id} value={chain.id}>
            {chain.name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
    </div>
  );
};