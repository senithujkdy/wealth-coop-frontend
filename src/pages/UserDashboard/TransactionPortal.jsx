import React, { useState, useEffect } from "react";
import { ArrowDownCircle, ArrowUpCircle, RefreshCw, DollarSign, Send } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useAccount } from "../../context/AccountContext";

const TransactionPortal = () => {
  // Context hooks
  const { user } = useAuth();
  const { accounts, refreshAccounts } = useAccount();

  // State management
  const [activeTab, setActiveTab] = useState("withdraw");
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [receiverAccountId, setReceiverAccountId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionMessage, setTransactionMessage] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  
  // Get the current user's default account
  const currentAccount = accounts && accounts.length > 0 ? accounts[0] : null;

  // Fetch recent transactions on component mount and after new transactions
  useEffect(() => {
    if (!currentAccount) return;
    
    const fetchTransactions = async () => {
      setIsLoadingTransactions(true);
      try {
        const response = await fetch(`http://localhost:3000/api/transactions/account/${currentAccount.account_id}`);
        if (response.ok) {
          const data = await response.json();
          setRecentTransactions(data.slice(0, 5)); // Get latest 5 transactions
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setIsLoadingTransactions(false);
      }
    };

    fetchTransactions();
  }, [currentAccount, transactionMessage]);

  // Handle deposit submission
  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!currentAccount) {
      setTransactionMessage({
        type: "error",
        text: "No account found for deposit"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/transactions/deposit/${currentAccount.account_id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: Number(depositAmount) })
        }
      );

      const data = await response.json();
      
      if (response.ok) {
        setTransactionMessage({
          type: "success",
          text: `Deposit successful! Transaction ID: ${data.transaction_id}`
        });
        setDepositAmount("");
        // refreshAccounts(); // Refresh account balance
      } else {
        setTransactionMessage({
          type: "error",
          text: data.error || "Deposit failed"
        });
      }
    } catch (error) {
      setTransactionMessage({
        type: "error",
        text: "An error occurred during deposit"
      });
      console.error("Deposit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle withdrawal/transfer submission
  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!currentAccount) {
      setTransactionMessage({
        type: "error",
        text: "No account found for withdrawal"
      });
      return;
    }

    if (!receiverAccountId) {
      setTransactionMessage({
        type: "error",
        text: "Please enter a receiver account number"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (receiverAccountId === currentAccount.account_number) {
        setTransactionMessage({
          type: "error",
          text: "You cannot transfer to your own account"
        });
        return;
      }
      const response = await fetch(
        `http://localhost:3000/api/transactions/withdraw/${receiverAccountId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            account_id: currentAccount.account_id,
            amount: Number(withdrawAmount) 
          })
        }
      );

      const data = await response.json();
      
      if (response.ok) {
        setTransactionMessage({
          type: "success",
          text: `Transfer successful! Transaction ID: ${data.transaction_id}`
        });
        setWithdrawAmount("");
        setReceiverAccountId("");
        // refreshAccounts(); // Refresh account balance
      } else {
        setTransactionMessage({
          type: "error",
          text: data.error || "Transfer failed"
        });
      }
    } catch (error) {
      setTransactionMessage({
        type: "error",
        text: "An error occurred during transfer"
      });
      console.error("Withdrawal error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR'
    }).format(amount);
  };

  // Format transaction date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    
      <div className="max-w-4xl mx-auto">
        {/* Account Balance Card */}
        {currentAccount && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-gray-500">Current Balance</h2>
                <div className="text-3xl font-bold mt-1">
                  {formatCurrency(currentAccount.balance)}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Your Account No: {currentAccount.account_number}
                </div>
              </div>
              <button 
                onClick={refreshAccounts}
                className="p-2 rounded-full hover:bg-gray-100"
                title="Refresh balance"
              >
                <RefreshCw size={20} className="text-gray-500" />
              </button>
            </div>
          </div>
        )}

        {/* Transaction Form Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            
            <button
              className={`flex-1 py-4 text-center font-medium ${
                activeTab === "withdraw"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => {
                setActiveTab("withdraw");
                setTransactionMessage(null);
              }}
            >
              <div className="flex items-center justify-center">
                <Send size={18} className="mr-2" />
                Transfer
              </div>
            </button>
          </div>

          {/* Transaction Status Message */}
          {transactionMessage && (
            <div 
              className={`p-4 ${
                transactionMessage.type === "success" 
                  ? "bg-green-50 text-green-800" 
                  : "bg-red-50 text-red-800"
              }`}
            >
              {transactionMessage.text}
            </div>
          )}

          {/* Deposit Form */}
          

          {/* Withdraw/Transfer Form */}
          {activeTab === "withdraw" && (
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Recipient Account Number</label>
                <input
                  type="text"
                  value={receiverAccountId}
                  onChange={(e) => setReceiverAccountId(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter recipient's account number"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Amount to Transfer</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {/* <DollarSign size={18} className="text-gray-400" /> */}
                  </div>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full pl-3 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter amount"
                    required
                  />
                </div>
              </div>
              <button
                onClick={(e) => handleWithdraw(e)}
                disabled={isSubmitting || !withdrawAmount || !receiverAccountId}
                className={`w-full py-3 rounded-lg font-medium ${
                  isSubmitting || !withdrawAmount || !receiverAccountId
                    ? "bg-blue-300 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {isSubmitting ? "Processing..." : "Transfer Funds"}
              </button>
            </div>
          )}
        </div>

        {/* Recent Transactions */}
      </div>
  );
};

export default TransactionPortal;