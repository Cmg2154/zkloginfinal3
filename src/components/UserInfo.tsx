import React, { useState, useEffect } from 'react';
import { useZkLogin } from './ZkLoginProvider';
import { User, Wallet, Copy, Check, RefreshCw } from 'lucide-react';

export function UserInfo() {
  const { isConnected, userAddress, userInfo, suiClient } = useZkLogin();
  const [copied, setCopied] = useState(false);
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  useEffect(() => {
    if (isConnected && userAddress) {
      fetchBalance();
    }
  }, [isConnected, userAddress]);

  const fetchBalance = async () => {
    if (!userAddress) return;
    
    setIsLoadingBalance(true);
    try {
      const balanceResponse = await suiClient.getBalance({
        owner: userAddress,
      });
      const suiBalance = (parseInt(balanceResponse.totalBalance) / 1_000_000_000).toFixed(4);
      setBalance(suiBalance);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      setBalance('0.0000');
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const copyAddress = async () => {
    if (userAddress) {
      await navigator.clipboard.writeText(userAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isConnected || !userInfo) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
          <User className="w-8 h-8 text-gray-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Connect with zkLogin</h3>
        <p className="text-gray-600">
          Sign in with your favorite OAuth provider to access your Sui account through zkLogin.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Profile Card */}
      <div className="glass-card p-6">
        <div className="flex items-center space-x-4 mb-6">
          <img
            src={userInfo.picture}
            alt={userInfo.name}
            className="w-16 h-16 rounded-full border-2 border-white/30"
          />
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{userInfo.name}</h3>
            <p className="text-gray-600">{userInfo.email}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs px-2 py-1 bg-blue-100/50 text-blue-700 rounded-full">
                {userInfo.provider}
              </span>
              <span className="text-xs px-2 py-1 bg-green-100/50 text-green-700 rounded-full">
                zkLogin
              </span>
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sui Address
            </label>
            <div className="flex items-center space-x-2">
              <div className="glass-input flex-1 px-3 py-2 text-sm font-mono text-gray-800">
                {userAddress ? `${userAddress.slice(0, 8)}...${userAddress.slice(-8)}` : 'Loading...'}
              </div>
              <button
                onClick={copyAddress}
                className="glass-button p-2 text-gray-700"
                title="Copy address"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Balance Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SUI Balance
            </label>
            <div className="flex items-center space-x-2">
              <div className="glass-input flex-1 px-3 py-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Wallet className="w-4 h-4 text-gray-500" />
                  <span className="font-mono text-gray-800">
                    {isLoadingBalance ? 'Loading...' : `${balance || '0.0000'} SUI`}
                  </span>
                </div>
              </div>
              <button
                onClick={fetchBalance}
                disabled={isLoadingBalance}
                className="glass-button p-2 text-gray-700 disabled:opacity-50"
                title="Refresh balance"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingBalance ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* zkLogin Info Card */}
      <div className="glass-card p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">zkLogin Authentication</h4>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <span>Authentication Method:</span>
            <span className="font-medium text-gray-800">Zero-Knowledge Login</span>
          </div>
          <div className="flex items-center justify-between">
            <span>OAuth Provider:</span>
            <span className="font-medium text-gray-800 capitalize">{userInfo.provider}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Network:</span>
            <span className="font-medium text-gray-800">Sui Testnet</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Privacy:</span>
            <span className="font-medium text-green-600">Enhanced</span>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-50/50 rounded-lg">
          <p className="text-xs text-blue-700">
            🔒 Your identity is verified through zero-knowledge proofs, ensuring privacy while maintaining security.
          </p>
        </div>
      </div>
    </div>
  );
}
