
import React, { useEffect, useState } from 'react';
import { Send, FileText, Clock, ChevronLeft, ChevronRight, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';
import { useAccount } from '../../context/AccountContext';
import TransactionDetails from '../../components/layout/TransactionDetails/TransactionDetails';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 10;

const Transaction = () => {
  const [activeTab, setActiveTab] = useState('All Transactions');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const { accounts, loading: accountsLoading, refreshAccounts } = useAccount();
  const accountId = accounts?.[0]?.account_id;
  const balance = accounts?.[0]?.balance;

  // Fetch transactions function
const fetchTransactions = async () => {
  if (!accountId) return;
  
  try {
    setLoading(true);
    // Fetch both withdrawals and deposits in one call
    const res = await fetch(`http://localhost:3000/api/transactions/account/${accountId}`);
    const data = await res.json();
    
    const formattedTransactions = data.map(tx => {
      const isDeposit = tx.transaction_type === 'Deposit' || 
                       (tx.sender_account !== accountId && tx.receiver_account === accountId);
      
      return {
        ...tx,
        transaction_type: isDeposit ? 'Deposit' : 'Withdrawal',
        formatted: formatTransaction({
          ...tx,
          transaction_type: isDeposit ? 'Deposit' : 'Withdrawal'
        })
      };
    });
    
    setTransactions(formattedTransactions);
  } catch (err) {
    console.error('Failed to fetch transactions:', err);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

  const formatTransaction = (tx) => {
    const isDeposit = tx.transaction_type === 'Deposit';
    const categories = {
      'Deposit': 'Deposit',
      'Withdrawal': tx.purpose || 'Payment',
      'Bill Payment': 'Utility',
      'Transfer': 'Transfer'
    };
    
    return {
      id: tx._id || tx.transaction_id,
      name: isDeposit 
        ? (tx.sender_name || 'Deposit') 
        : (tx.beneficiary_name || tx.description || 'Payment'),
      date: new Date(tx.transaction_date).toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      category: categories[tx.transaction_type] || 'Other',
      cardLast4: tx.account_number ? tx.account_number.slice(-4) : (accounts[0]?.account_number.slice(-4) || '****'),
      status: tx.status || 'Completed',
      amount: isDeposit ? tx.amount : -tx.amount,
      icon: isDeposit ? 
        <ArrowDown className="text-green-500" size={20} /> : 
        <ArrowUp className="text-red-500" size={20} />,
      iconBg: isDeposit ? 'bg-green-100' : 'bg-red-100',
      type: tx.transaction_type
    };
  };

  // Manual refresh function
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      refreshAccounts(),
      fetchTransactions()
    ]);
  };

  // Initial fetch and polling
  useEffect(() => {
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, [accountId]);

  // Tabs for filtering
  const tabs = ['All Transactions', 'Income', 'Expense'];

  // Filter transactions by tab
  const filteredTransactions = transactions.filter((tx) => {
    if (activeTab === 'Income') return tx.transaction_type === 'Deposit';
    if (activeTab === 'Expense') return tx.transaction_type === 'Withdrawal';
    return true;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredTransactions.length / PAGE_SIZE);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Format helpers
  const formatAmount = (tx) =>
    tx.transaction_type === 'Deposit'
      ? `+Rs ${tx.amount.toLocaleString()}`
      : `-Rs ${tx.amount.toLocaleString()}`;
      
  const amountClass = (tx) =>
    tx.transaction_type === 'Deposit' ? 'text-green-500' : 'text-red-500';
    
  const directionIcon = (tx) =>
    tx.transaction_type === 'Deposit' ? (
      <ArrowDown size={16} className="text-green-500" />
    ) : (
      <ArrowUp size={16} className="text-yellow-500" />
    );

  // Handle transaction click
  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
  };

  // Close transaction details modal
  const closeTransactionDetails = () => {
    setSelectedTransaction(null);
  };
  
return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Current Balance</h2>
              <p className="text-3xl font-bold text-gray-900">
                Rs {balance?.toLocaleString() || '0'}.00
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Refresh balance"
            >
              <RefreshCw 
                size={20} 
                className={`text-gray-500 ${refreshing ? 'animate-spin' : ''}`} 
              />
            </button>
          </div>
          
          {/* Transfer Options */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => navigate('/transaction/transactionportal')}
              className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg transition-colors flex flex-col items-center"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-full mb-2">
                <Send size={24} className="text-white" />
              </div>
              <span className="font-medium text-2xl">One-Time Transfer</span>
              <span className="text-sm text-blue-100 mt-1">Send money instantly</span>
            </button>
            
            <button 
              onClick={() => navigate('/transaction/bill-payment')}
              className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg transition-colors flex flex-col items-center"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-full mb-2">
                <FileText size={24} className="text-white" />
              </div>
              <span className="font-medium text-2xl">Bill Payment</span>
              <span className="text-sm text-green-100 mt-1">
                Pay utilities, save billers, and schedule payments
              </span>
            </button>
            
            <button 
              onClick={() => navigate('/transaction/recurring')}
              className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg transition-colors flex flex-col items-center"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-full mb-2">
                <Clock size={24} className="text-white" />
              </div>
              <span className="font-medium text-2xl">Recurring Transfer</span>
              <span className="text-sm text-purple-100 mt-1">Set up automatic payments</span>
            </button>
          </div>
        </div>

        {/* Transactions Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Transactions</h2>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`pb-2 ${
                    activeTab === tab
                      ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                      : 'text-gray-500'
                  }`}
                  onClick={() => {
                    setActiveTab(tab);
                    setCurrentPage(1);
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100">
                    <th className="px-6 py-3 font-medium">Description</th>
                    <th className="px-6 py-3 font-medium">Transaction ID</th>
                    <th className="px-6 py-3 font-medium">Type</th>
                    <th className="px-6 py-3 font-medium">Account</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Amount</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                        Loading transactions...
                      </td>
                    </tr>
                  ) : paginatedTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                        No transactions found.
                      </td>
                    </tr>
                  ) : (
                    paginatedTransactions.map((tx, index) => (
                      <tr 
                        key={tx._id || index} 
                        className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleTransactionClick(tx)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                              {directionIcon(tx)}
                            </div>
                            {tx.transaction_type}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{tx.transaction_id}</td>
                        <td className="px-6 py-4 text-gray-500">{tx.transaction_type}</td>
                        <td className="px-6 py-4 text-gray-500">{tx.account_id}</td>
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(tx.transaction_date).toLocaleString()}
                        </td>
                        <td className={`px-6 py-4 font-medium ${amountClass(tx)}`}>
                          {formatAmount(tx)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              tx.status === 'Completed'
                                ? 'bg-green-100 text-green-800'
                                : tx.status === 'Pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-end items-center">
            <button
              className="flex items-center text-blue-600 mr-4"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} className="mr-1" /> Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`w-8 h-8 flex items-center justify-center rounded-full mx-1 ${
                  currentPage === page ? 'bg-blue-600 text-white' : 'text-blue-600'
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="flex items-center text-blue-600 ml-4"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <TransactionDetails 
          transaction={selectedTransaction} 
          onClose={closeTransactionDetails} 
        />
      )}
    </div>
  );
};

export default Transaction;