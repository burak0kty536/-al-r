import React, { useState } from 'react';
import { ChainSelector } from './ChainSelector';
import { TokenInput } from './TokenInput';
import { TradingControls } from './TradingControls';
import { SecurityChecks } from './SecurityChecks';
import { PriceChart } from './PriceChart';

export const TradingInterface = () => {
  const [selectedChain, setSelectedChain] = useState('solana');
  const [tokenAddress, setTokenAddress] = useState('');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <ChainSelector value={selectedChain} onChange={setSelectedChain} />
          <TokenInput 
            chain={selectedChain} 
            value={tokenAddress}
            onChange={setTokenAddress}
          />
        </div>
        <PriceChart chain={selectedChain} tokenAddress={tokenAddress} />
      </div>
      
      <div className="space-y-6">
        <TradingControls chain={selectedChain} tokenAddress={tokenAddress} />
        <SecurityChecks chain={selectedChain} tokenAddress={tokenAddress} />
      </div>
    </div>
  );
};