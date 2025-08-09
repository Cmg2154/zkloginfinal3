import React from 'react';
import { WalletProvider as SuiWalletProvider } from '@mysten/wallet-adapter-react';
import { WalletStandardAdapterProvider } from '@mysten/wallet-adapter-wallet-standard';
import { SuiWalletAdapter } from '@mysten/wallet-adapter-sui-wallet';

interface WalletProviderProps {
  children: React.ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  // Initialize wallet adapters
  const wallets = React.useMemo(() => [
    new WalletStandardAdapterProvider(),
    new SuiWalletAdapter(),
  ], []);

  return (
    <SuiWalletProvider wallets={wallets} autoConnect={false}>
      {children}
    </SuiWalletProvider>
  );
}
