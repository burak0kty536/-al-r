import React from 'react';
import { Search } from 'lucide-react';

interface TokenInputProps {
  chain: string;
  value: string;
  onChange: (value: string) => void;
}

export const TokenInput: React.FC<TokenInputProps> = ({ chain, value, onChange }) => {
  return (
    <div className="relative mt-4">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Token adresi girin..."
        className="w-full rounded-lg bg-gray-700 pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
    </div>
  );
};