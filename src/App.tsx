import React from 'react';
import { ZkLoginProvider } from './components/ZkLoginProvider';
import { ZkLoginButton } from './components/ZkLoginButton';
import { UserInfo } from './components/UserInfo';
import { TransactionMode } from './components/TransactionMode';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { useZkLogin } from './components/ZkLoginProvider';

function AppContent() {
  const { isConnected } = useZkLogin();

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="glass border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-gray-800">Sui zkLogin</span>
            </div>
            <ZkLoginButton />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {isConnected ? (
          <>
            {/* User Info Section */}
            <section>
              <UserInfo />
            </section>

            {/* Transaction Mode Section */}
            <section>
              <TransactionMode />
            </section>
          </>
        ) : (
          <>
            {/* Hero Section */}
            <Hero />

            {/* Features Section */}
            <section>
              <Features />
            </section>
          </>
        )}

        {/* Footer */}
        <footer className="glass-card p-8 text-center">
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-800 transition-colors">Documentation</a>
              <a href="#" className="hover:text-gray-800 transition-colors">GitHub</a>
              <a href="#" className="hover:text-gray-800 transition-colors">Support</a>
            </div>
            <div className="text-sm text-gray-500">
              Built with ❤️ using React, TypeScript, and Sui zkLogin
            </div>
          </div>
        </footer>
      </main>

      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-blue-200/30 to-cyan-200/30 blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-teal-200/30 to-blue-200/30 blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ZkLoginProvider>
      <AppContent />
    </ZkLoginProvider>
  );
}

export default App;
