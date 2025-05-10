import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowUp, ArrowDown, Plus } from 'lucide-react';
import { useAccount } from '../../context/AccountContext';
import TransactionPortal from './TransactionPortal';
import TransactionDetails from '../../components/layout/TransactionDetails/TransactionDetails';

const PAGE_SIZE = 10; // Number of transactions per page

const Transaction = () => {
  const [activeTab, setActiveTab] = useState('All Transactions');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const { accounts, loading: accountsLoading } = useAccount();
  const accountId = accounts?.[0]?.account_id;
  const balance = accounts?.[0]?.balance;

  // Dummy cards data (replace with API if needed)
  const cards = [
    {
      id: 1,
      balance: `Rs ${balance}.00`,
      cardHolder: 'Peter Hans',
      bankName: 'Wealth-COOP',
      cardType: 'VISA',
      validThru: '12/29',
      cardNumber: '3778 **** **** 1234',
      isActive: true,
    },
    // {
    //   id: 2,
    //   balance: 'Rs 5,756',
    //   cardHolder: 'Peter Hans',
    //   validThru: '12/22',
    //   cardNumber: '3778 **** **** 1234',
    //   isActive: false,
    // },
  ];

  // Fetch transactions from API (with polling for real-time updates)
  useEffect(() => {
    if (!accountId) return;
  
    let isMounted = true;
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/api/transactions/account/${accountId}`);
        const data = await res.json();
        if (isMounted) setTransactions(data);
      } catch (e) {
        console.error('🚨 Failed to fetch transactions:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
  
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 10000); // Poll every 10s
  
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
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

        <TransactionPortal/>

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