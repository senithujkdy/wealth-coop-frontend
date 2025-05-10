import React from 'react';
import { X, Calendar, CreditCard, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const TransactionDetails = ({ transaction, onClose }) => {
  if (!transaction) return null;

  // Helper functions
  const formatAmount = (tx) =>
    tx.transaction_type === 'Deposit'
      ? `+Rs ${tx.amount.toLocaleString()}`
      : `-Rs ${tx.amount.toLocaleString()}`;
    
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle size={18} className="text-green-500" />;
      case 'Pending':
        return <Clock size={18} className="text-yellow-500" />;
      default:
        return <AlertCircle size={18} className="text-gray-500" />;
    }
  };

  const amountClass = (tx) =>
    tx.transaction_type === 'Deposit' ? 'text-green-500' : 'text-red-500';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Transaction Details</h2>
          <p className="text-gray-500">Full information about this transaction</p>
        </div>
        
        {/* Transaction summary */}
        <div className="flex items-center justify-between mb-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
              <CreditCard size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{transaction.transaction_type}</h3>
              <p className="text-sm text-gray-500">{transaction.transaction_id}</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-xl font-bold ${amountClass(transaction)}`}>
              {formatAmount(transaction)}
            </p>
            <div className="flex items-center text-sm">
              {getStatusIcon(transaction.status)}
              <span className="ml-1">{transaction.status}</span>
            </div>
          </div>
        </div>
        
        {/* Transaction details */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Date & Time</p>
              <div className="flex items-center mt-1">
                <Calendar size={16} className="text-gray-400 mr-2" />
                <p className="font-medium">{new Date(transaction.transaction_date).toLocaleString()}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Transaction Type</p>
              <p className="font-medium mt-1">{transaction.transaction_type}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Account</p>
              <p className="font-medium mt-1">{transaction.account_id}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Amount</p>
              <p className={`font-medium mt-1 ${amountClass(transaction)}`}>
                {formatAmount(transaction)}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Transaction ID</p>
              <p className="font-medium mt-1">{transaction.transaction_id}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <div className="flex items-center mt-1">
                {getStatusIcon(transaction.status)}
                <span className="ml-1 font-medium">{transaction.status}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Description section - conditionally rendered if there's a description */}
        {transaction.description && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-2">Description</p>
            <p className="text-gray-700">{transaction.description}</p>
          </div>
        )}
        
        {/* Action button */}
        <div className="mt-8 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;