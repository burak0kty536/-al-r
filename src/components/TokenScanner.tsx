import React, { useState, useEffect } from 'react';
import { Search, AlertTriangle, CheckCircle } from 'lucide-react';
import { Input } from './ui/input';
import { SecurityChecker } from '../services/security/SecurityChecker';

interface TokenScannerProps {
  chain: string;
  onTokenSelect: (address: string) => void;
}

export const TokenScanner: React.FC<TokenScannerProps> = ({ chain, onTokenSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [securityResults, setSecurityResults] = useState<Record<string, SecurityResult>>({});

  useEffect(() => {
    if (!searchTerm) return;
    
    const searchTokens = async () => {
      setLoading(true);
      try {
        // Implement token search based on chain
        const results = await fetchTokens(chain, searchTerm);
        setTokens(results);
        
        // Run security checks for each token
        const security = new SecurityChecker();
        const securityPromises = results.map(async (token) => {
          const honeypot = await security.checkHoneypot(chain, token.address);
          const rugPull = await security.checkRugPullRisk(chain, token.address);
          
          return {
            [token.address]: {
              isHoneypot: !honeypot.safe,
              isRugPull: !rugPull.safe,
              verified: token.verified
            }
          };
        });
        
        const securityResults = await Promise.all(securityPromises);
        setSecurityResults(
          securityResults.reduce((acc, curr) => ({ ...acc, ...curr }), {})
        );
      } catch (error) {
        console.error('Token search error:', error);
      }
      setLoading(false);
    };

    const debounce = setTimeout(searchTokens, 500);
    return () => clearTimeout(debounce);
  }, [chain, searchTerm]);

  const getSecurityStatus = (token: TokenInfo) => {
    const security = securityResults[token.address];
    if (!security) return 'unknown';
    if (security.isHoneypot || security.isRugPull) return 'danger';
    if (security.verified) return 'safe';
    return 'warning';
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search tokens by name or address..."
          className="pl-10"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>

      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
        </div>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {tokens.map((token) => {
            const status = getSecurityStatus(token);
            return (
              <button
                key={token.address}
                onClick={() => onTokenSelect(token.address)}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={token.logo}
                    alt={token.symbol}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="text-left">
                    <div className="font-medium">{token.name}</div>
                    <div className="text-sm text-gray-400">{token.symbol}</div>
                  </div>
                </div>

                {status === 'safe' && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {status === 'warning' && (
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                )}
                {status === 'danger' && (
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Helper function to fetch tokens (implement based on chain)
const fetchTokens = async (chain: string, search: string): Promise<TokenInfo[]> => {
  // Implement token fetching logic based on chain
  return [];
};

interface TokenInfo {
  address: string;
  name: string;
  symbol: string;
  logo: string;
  verified: boolean;
}

interface SecurityResult {
  isHoneypot: boolean;
  isRugPull: boolean;
  verified: boolean;
}