import React, { useState, useEffect } from 'react';
import { useZkLogin } from './ZkLoginProvider';
import { 
  Send, 
  Coins, 
  FileText, 
  Users, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle, 
  XCircle,
  Loader2,
  Copy,
  ExternalLink
} from 'lucide-react';

interface Transaction {
  id: string;
  type: 'transfer' | 'mint' | 'contract' | 'stake';
  amount?: string;
  recipient?: string;
  status: 'pending' | 'success' | 'failed';
  timestamp: number;
  hash?: string;
}

export function TransactionMode() {
  const { userAddress, suiClient, userInfo } = useZkLogin();
  const [activeTab, setActiveTab] = useState<'send' | 'receive' | 'history'>('send');
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<string>('0.0000');

  // Send transaction form state
  const [sendForm, setSendForm] = useState({
    recipient: '',
    amount: '',
    message: ''
  });

  useEffect(() => {
    if (userAddress) {
      fetchBalance();
      loadTransactionHistory();
    }
  }, [userAddress]);

  const fetchBalance = async () => {
    if (!userAddress) return;
    
    try {
      const balanceResponse = await suiClient.getBalance({
        owner: userAddress,
      });
      const suiBalance = (parseInt(balanceResponse.totalBalance) / 1_000_000_000).toFixed(4);
      setBalance(suiBalance);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      setBalance('0.0000');
    }
  };

  const loadTransactionHistory = () => {
    // Load from localStorage (in production, fetch from blockchain)
    const saved = localStorage.getItem(`transactions_${userAddress}`);
    if (saved) {
      setTransactions(JSON.parse(saved));
    }
  };

  const saveTransaction = (transaction: Transaction) => {
    const updated = [transaction, ...transactions].slice(0, 10); // Keep last 10
    setTransactions(updated);
    localStorage.setItem(`transactions_${userAddress}`, JSON.stringify(updated));
  };

  const handleSendTransaction = async () => {
    if (!sendForm.recipient || !sendForm.amount) return;

    setIsLoading(true);
    console.log('🔄 Initiating transaction...', sendForm);

    try {
      // Simulate transaction (in production, use actual Sui transaction)
      const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const newTransaction: Transaction = {
        id: transactionId,
        type: 'transfer',
        amount: sendForm.amount,
        recipient: sendForm.recipient,
        status: 'pending',
        timestamp: Date.now(),
        hash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
      };

      saveTransaction(newTransaction);
      console.log('✅ Transaction created:', newTransaction);

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update transaction status
      const updatedTransaction = { ...newTransaction, status: 'success' as const };
      const updatedTransactions = transactions.map(tx => 
        tx.id === transactionId ? updatedTransaction : tx
      );
      setTransactions(updatedTransactions);
      localStorage.setItem(`transactions_${userAddress}`, JSON.stringify(updatedTransactions));

      console.log('✅ Transaction confirmed:', updatedTransaction);

      // Reset form
      setSendForm({ recipient: '', amount: '', message: '' });
      
      // Refresh balance
      await fetchBalance();

    } catch (error: any) {
      console.error('❌ Transaction failed:', error);
      
      // Update transaction status to failed
      const failedTransaction = transactions.find(tx => tx.status === 'pending');
      if (failedTransaction) {
        const updatedTransactions = transactions.map(tx => 
          tx.id === failedTransaction.id ? { ...tx, status: 'failed' as const } : tx
        );
        setTransactions(updatedTransactions);
        localStorage.setItem(`transactions_${userAddress}`, JSON.stringify(updatedTransactions));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100/50';
      case 'success':
        return 'text-green-600 bg-green-100/50';
      case 'failed':
        return 'text-red-600 bg-red-100/50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Transaction Mode</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Coins className="w-4 h-4" />
            <span className="font-mono">{balance} SUI</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img src={userInfo?.picture} alt="User" className="w-full h-full object-cover" />
            </div>
            <span>{userInfo?.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-mono">{formatAddress(userAddress || '')}</span>
            <button
              onClick={() => copyToClipboard(userAddress || '')}
              className="p-1 hover:bg-gray-100/50 rounded"
            >
              <Copy className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="glass-card p-1">
        <div className="flex space-x-1">
          {[
            { id: 'send', label: 'Send', icon: ArrowUpRight },
            { id: 'receive', label: 'Receive', icon: ArrowDownLeft },
            { id: 'history', label: 'History', icon: Clock }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white/80 text-gray-800 shadow-sm'
                  : 'text-gray-600 hover:bg-white/40'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'send' && (
        <div className="glass-card p-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-800">Send SUI</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipient Address
              </label>
              <input
                type="text"
                value={sendForm.recipient}
                onChange={(e) => setSendForm({ ...sendForm, recipient: e.target.value })}
                placeholder="0x..."
                className="glass-input w-full px-4 py-3 text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (SUI)
              </label>
              <input
                type="number"
                value={sendForm.amount}
                onChange={(e) => setSendForm({ ...sendForm, amount: e.target.value })}
                placeholder="0.0000"
                step="0.0001"
                min="0"
                className="glass-input w-full px-4 py-3 text-sm"
              />
              <div className="text-xs text-gray-500 mt-1">
                Available: {balance} SUI
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message (Optional)
              </label>
              <textarea
                value={sendForm.message}
                onChange={(e) => setSendForm({ ...sendForm, message: e.target.value })}
                placeholder="Add a note..."
                rows={3}
                className="glass-input w-full px-4 py-3 text-sm resize-none"
              />
            </div>

            <button
              onClick={handleSendTransaction}
              disabled={isLoading || !sendForm.recipient || !sendForm.amount}
              className="w-full glass-button px-6 py-3 text-gray-800 font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Transaction</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'receive' && (
        <div className="glass-card p-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-800">Receive SUI</h3>
          
          <div className="text-center space-y-4">
            <div className="w-48 h-48 mx-auto bg-white p-4 rounded-lg shadow-sm">
              {/* QR Code placeholder */}
              <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <ArrowDownLeft className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-xs text-gray-500">QR Code</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">Your Sui Address</div>
              <div className="glass-input px-4 py-3 font-mono text-sm text-center">
                {userAddress}
              </div>
              <button
                onClick={() => copyToClipboard(userAddress || '')}
                className="glass-button px-4 py-2 text-sm font-medium flex items-center space-x-2 mx-auto"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Address</span>
              </button>
            </div>

            <div className="text-xs text-gray-500 max-w-md mx-auto">
              Share this address to receive SUI tokens. Always verify the address before sharing.
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="glass-card p-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-800">Transaction History</h3>
          
          {transactions.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <FileText className="w-12 h-12 mx-auto text-gray-400" />
              <div className="text-gray-600">No transactions yet</div>
              <div className="text-sm text-gray-500">Your transaction history will appear here</div>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="glass-card p-4 hover:bg-white/60 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                        {tx.type === 'transfer' ? (
                          <ArrowUpRight className="w-5 h-5 text-white" />
                        ) : (
                          <Coins className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 capitalize">{tx.type}</div>
                        <div className="text-sm text-gray-600">
                          {tx.recipient && `To: ${formatAddress(tx.recipient)}`}
                        </div>
                        <div className="text-xs text-gray-500">{formatTimestamp(tx.timestamp)}</div>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-1">
                      <div className="font-mono text-gray-800">
                        {tx.amount && `-${tx.amount} SUI`}
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full flex items-center space-x-1 ${getStatusColor(tx.status)}`}>
                        {getStatusIcon(tx.status)}
                        <span className="capitalize">{tx.status}</span>
                      </div>
                    </div>
                  </div>
                  
                  {tx.hash && (
                    <div className="mt-3 pt-3 border-t border-gray-200/50">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Transaction Hash:</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono">{formatAddress(tx.hash)}</span>
                          <button
                            onClick={() => copyToClipboard(tx.hash || '')}
                            className="p-1 hover:bg-gray-100/50 rounded"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          <button className="p-1 hover:bg-gray-100/50 rounded">
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="glass-card p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Users, label: 'Stake SUI', color: 'from-purple-500 to-pink-500' },
            { icon: FileText, label: 'Smart Contract', color: 'from-green-500 to-teal-500' },
            { icon: Coins, label: 'Mint NFT', color: 'from-orange-500 to-red-500' },
            { icon: Send, label: 'Batch Send', color: 'from-blue-500 to-cyan-500' }
          ].map((action, index) => (
            <button
              key={index}
              className="glass-button p-4 text-center space-y-2 hover:scale-105 transition-transform"
            >
              <div className={`w-10 h-10 mx-auto rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-sm font-medium text-gray-800">{action.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
