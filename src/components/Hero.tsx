import React from 'react';
import { Shield, Zap, Lock, Eye } from 'lucide-react';

export function Hero() {
  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800">
          Sui <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">zkLogin</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Experience seamless Web3 authentication with zero-knowledge proofs. 
          Login with your favorite OAuth provider while maintaining complete privacy.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
        <div className="glass-card p-4 text-center">
          <Shield className="w-8 h-8 mx-auto mb-2 text-blue-600" />
          <div className="text-sm font-medium text-gray-800">Secure</div>
        </div>
        <div className="glass-card p-4 text-center">
          <Zap className="w-8 h-8 mx-auto mb-2 text-cyan-600" />
          <div className="text-sm font-medium text-gray-800">Fast</div>
        </div>
        <div className="glass-card p-4 text-center">
          <Lock className="w-8 h-8 mx-auto mb-2 text-teal-600" />
          <div className="text-sm font-medium text-gray-800">Private</div>
        </div>
        <div className="glass-card p-4 text-center">
          <Eye className="w-8 h-8 mx-auto mb-2 text-blue-500" />
          <div className="text-sm font-medium text-gray-800">Transparent</div>
        </div>
      </div>

      <div className="glass-card p-6 max-w-3xl mx-auto">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">How it works</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mx-auto">1</div>
            <div className="font-medium text-gray-800">OAuth Login</div>
            <div>Sign in with Google, Facebook, or Twitch</div>
          </div>
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 font-bold mx-auto">2</div>
            <div className="font-medium text-gray-800">ZK Proof</div>
            <div>Generate zero-knowledge proof of identity</div>
          </div>
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold mx-auto">3</div>
            <div className="font-medium text-gray-800">Sui Access</div>
            <div>Access your Sui wallet with privacy</div>
          </div>
        </div>
      </div>
    </div>
  );
}
