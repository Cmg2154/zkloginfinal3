import React from 'react';
import { useZkLogin } from './ZkLoginProvider';
import { LogIn, LogOut, Loader2, TestTube, AlertCircle } from 'lucide-react';

export function ZkLoginButton() {
  const { isConnected, isLoading, userInfo, login, logout, error, testConnection } = useZkLogin();

  // Check if we're in demo mode
  const isDemoMode = !import.meta.env.VITE_GOOGLE_CLIENT_ID || 
                     import.meta.env.VITE_GOOGLE_CLIENT_ID.includes('demo') ||
                     import.meta.env.VITE_GOOGLE_CLIENT_ID.length < 20;

  if (isLoading) {
    return (
      <button
        disabled
        className="glass-button px-6 py-2 text-gray-700 font-medium flex items-center space-x-2 cursor-not-allowed"
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Connecting...</span>
      </button>
    );
  }

  if (isConnected && userInfo) {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 glass-card px-4 py-2">
          <img
            src={userInfo.picture}
            alt={userInfo.name}
            className="w-6 h-6 rounded-full"
          />
          <div className="hidden sm:block">
            <div className="text-sm font-medium text-gray-700">
              {userInfo.name}
            </div>
            {isDemoMode && (
              <div className="text-xs text-orange-600">Demo Mode</div>
            )}
          </div>
        </div>
        <button
          onClick={logout}
          className="glass-button px-4 py-2 text-gray-700 font-medium flex items-center space-x-2 hover:bg-red-100/20"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:block">Logout</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {error && (
        <div className="text-red-600 text-sm bg-red-100/20 px-3 py-1 rounded-lg max-w-xs truncate flex items-center space-x-1">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {isDemoMode && (
        <div className="text-orange-600 text-sm bg-orange-100/20 px-3 py-1 rounded-lg flex items-center space-x-1">
          <AlertCircle className="w-3 h-3" />
          <span className="hidden lg:block">Demo Mode - Setup OAuth for real login</span>
          <span className="lg:hidden">Demo</span>
        </div>
      )}
      
      <div className="flex space-x-2">
        <button
          onClick={testConnection}
          className="glass-button px-3 py-2 text-gray-700 font-medium flex items-center space-x-1"
          title="Test Connection"
        >
          <TestTube className="w-4 h-4" />
          <span className="hidden lg:block">Test</span>
        </button>
        <button
          onClick={() => login('google')}
          className="glass-button px-4 py-2 text-gray-700 font-medium flex items-center space-x-2"
        >
          <LogIn className="w-4 h-4" />
          <span>Google</span>
        </button>
        <button
          onClick={() => login('facebook')}
          className="glass-button px-4 py-2 text-gray-700 font-medium flex items-center space-x-2"
        >
          <LogIn className="w-4 h-4" />
          <span className="hidden sm:block">Facebook</span>
        </button>
        <button
          onClick={() => login('twitch')}
          className="glass-button px-4 py-2 text-gray-700 font-medium flex items-center space-x-2"
        >
          <LogIn className="w-4 h-4" />
          <span className="hidden sm:block">Twitch</span>
        </button>
      </div>
    </div>
  );
}
