import React from 'react';
import { useWallet } from '@mysten/wallet-adapter-react';
import { Coins, Activity, Shield, Zap, ExternalLink, AlertTriangle } from 'lucide-react';

export function WalletInfo() {
  const { connected, account, wallet } = useWallet();

  if (!connected || !account) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-gray-300 to-gray-400 flex items-center justify-center">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Sui Wallet Not Connected</h3>
        <p className="text-gray-600 mb-6">Connect your Sui wallet to view your account information and interact with the Sui blockchain.</p>
        
        <div className="space-y-4">
          <div className="text-sm text-gray-500">
            <p className="font-medium mb-2">Supported wallets:</p>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Sui Wallet</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">Suiet</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">Ethos</span>
            </div>
          </div>
          
          <div className="glass-card p-4 bg-blue-50/80 border-blue-200/50">
            <div className="flex items-start space-x-2 text-blue-700">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-left">
                <p className="font-medium">Installation Required</p>
                <p className="text-blue-600 mt-1">
                  If you don't have a Sui wallet, install one from your browser's extension store first.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: Coins,
      title: 'SUI Balance',
      description: 'View your SUI token balance and assets',
      color: 'from-yellow-400 to-orange-400'
    },
    {
      icon: Activity,
      title: 'Transactions',
      description: 'Track your Sui blockchain transactions',
      color: 'from-green-400 to-emerald-400'
    },
    {
      icon: Zap,
      title: 'Fast & Secure',
      description: 'Lightning-fast transactions on Sui network',
      color: 'from-purple-400 to-pink-400'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <h3 className="text-xl font-semibold text-gray-800">Sui Account Information</h3>
            {wallet && (
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                {wallet.name}
              </span>
            )}
          </div>
          <a
            href={`https://suiexplorer.com/address/${account.address}?network=mainnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-button p-2 text-blue-600 hover:text-blue-700 transition-colors"
            title="View on Sui Explorer"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Wallet Address</label>
            <div className="glass-input p-3 mt-1">
              <code className="text-sm text-gray-800 break-all font-mono">{account.address}</code>
            </div>
          </div>
          
          {account.publicKey && (
            <div>
              <label className="text-sm font-medium text-gray-600">Public Key</label>
              <div className="glass-input p-3 mt-1">
                <code className="text-sm text-gray-800 break-all font-mono">
                  {Array.from(account.publicKey).map(b => b.toString(16).padStart(2, '0')).join('')}
                </code>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2 text-sm text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Connected to Sui Mainnet</span>
            </div>
            <div className="text-xs text-gray-500">
              Network: Mainnet
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {features.map((feature, index) => (
          <div key={index} className="glass-card p-6 text-center hover:scale-105 transition-transform duration-300">
            <div className={`w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
              <feature.icon className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h4>
            <p className="text-sm text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
