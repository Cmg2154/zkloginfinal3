import React from 'react';
import { useWallet } from '@mysten/wallet-adapter-react';
import { Wallet, LogOut, Copy, Check, AlertCircle, Loader2 } from 'lucide-react';

export function WalletButton() {
  const { connected, connecting, disconnect, select, wallets, account } = useWallet();
  const [copied, setCopied] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isConnecting, setIsConnecting] = React.useState(false);

  // Debug: Log available wallets
  React.useEffect(() => {
    console.log('Available wallets:', wallets.map(w => ({
      name: w.name,
      readyState: w.readyState,
      icon: w.icon
    })));
  }, [wallets]);

  const handleConnect = async () => {
    try {
      setError(null);
      setIsConnecting(true);
      
      console.log('Attempting to connect wallet...');
      
      // Find available wallets
      const availableWallets = wallets.filter(wallet => 
        wallet.readyState === 'Installed' || wallet.readyState === 'Loadable'
      );
      
      console.log('Available wallets for connection:', availableWallets.map(w => w.name));
      
      if (availableWallets.length === 0) {
        throw new Error('No Sui wallets detected. Please install Sui Wallet, Suiet, or Ethos Wallet from your browser\'s extension store.');
      }
      
      // Try to connect to the first available wallet
      const walletToConnect = availableWallets[0];
      console.log('Connecting to wallet:', walletToConnect.name);
      
      await select(walletToConnect.name);
      
    } catch (err: any) {
      console.error('Wallet connection error:', err);
      setError(err.message || 'Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      setError(null);
    } catch (err) {
      console.error('Disconnect error:', err);
    }
  };

  const handleCopyAddress = async () => {
    if (account?.address) {
      try {
        await navigator.clipboard.writeText(account.address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Copy failed:', err);
      }
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Clear error when connection state changes
  React.useEffect(() => {
    if (connected) {
      setError(null);
    }
  }, [connected]);

  if (connected && account) {
    return (
      <div className="glass-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Connected</p>
              <p className="text-xs text-gray-600">{formatAddress(account.address)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyAddress}
              className="glass-button p-2 text-gray-700 hover:text-gray-900 transition-colors"
              title="Copy address"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={handleDisconnect}
              className="glass-button p-2 text-red-600 hover:text-red-700 transition-colors"
              title="Disconnect"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isLoading = connecting || isConnecting;

  return (
    <div className="space-y-2">
      <button
        onClick={handleConnect}
        disabled={isLoading}
        className="glass-button px-6 py-3 text-gray-800 font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Wallet className="w-5 h-5" />
        )}
        <span>
          {isLoading ? 'Connecting...' : 'Connect Sui Wallet'}
        </span>
      </button>
      
      {error && (
        <div className="glass-card p-3 bg-red-50/80 border-red-200/50 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-start space-x-2 text-red-700">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium">Connection Failed</p>
              <p className="text-red-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {wallets.length === 0 && (
        <div className="glass-card p-3 bg-yellow-50/80 border-yellow-200/50">
          <div className="flex items-start space-x-2 text-yellow-700">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium">No Wallets Detected</p>
              <p className="text-yellow-600 mt-1">
                Please install a Sui wallet extension to continue.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
