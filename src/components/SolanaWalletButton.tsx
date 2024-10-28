import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Wallet } from 'lucide-react';

export const SolanaWalletButton: FC = () => {
  const { connected, publicKey } = useWallet();

  return (
    <div className="flex items-center gap-2">
      {connected && publicKey ? (
        <div className="flex items-center gap-2 bg-green-500/20 text-green-500 px-3 py-1.5 rounded-lg">
          <Wallet className="h-4 w-4" />
          <span className="text-sm">
            {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
          </span>
        </div>
      ) : (
        <WalletMultiButton className="phantom-button" />
      )}
    </div>
  );
};