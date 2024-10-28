import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Check } from 'lucide-react';
import { SecurityChecker } from '../services/security/SecurityChecker';

interface SecurityChecksProps {
  chain: string;
  tokenAddress?: string;
}

export const SecurityChecks: React.FC<SecurityChecksProps> = ({ chain, tokenAddress }) => {
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>({
    honeypot: false,
    rugPullRisk: false,
    loading: false
  });

  useEffect(() => {
    if (!tokenAddress) return;

    const checker = new SecurityChecker();
    setSecurityStatus(prev => ({ ...prev, loading: true }));

    Promise.all([
      checker.checkHoneypot(chain, tokenAddress),
      checker.checkRugPullRisk(chain, tokenAddress)
    ]).then(([honeypot, rugPull]) => {
      setSecurityStatus({
        honeypot: honeypot.safe,
        rugPullRisk: rugPull.safe,
        loading: false
      });
    });
  }, [chain, tokenAddress]);

  return (
    <div className="rounded-lg bg-gray-800 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-semibold">Security Checks</h3>
      </div>

      <div className="space-y-2">
        <SecurityItem
          title="Honeypot Check"
          status={securityStatus.honeypot}
          loading={securityStatus.loading}
        />
        <SecurityItem
          title="Rug Pull Risk"
          status={securityStatus.rugPullRisk}
          loading={securityStatus.loading}
        />
      </div>
    </div>
  );
};

interface SecurityItemProps {
  title: string;
  status: boolean;
  loading: boolean;
}

const SecurityItem: React.FC<SecurityItemProps> = ({ title, status, loading }) => (
  <div className="flex items-center justify-between">
    <span>{title}</span>
    {loading ? (
      <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
    ) : status ? (
      <Check className="h-4 w-4 text-green-500" />
    ) : (
      <AlertTriangle className="h-4 w-4 text-red-500" />
    )}
  </div>
);

interface SecurityStatus {
  honeypot: boolean;
  rugPullRisk: boolean;
  loading: boolean;
}