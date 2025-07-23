import React, { useState } from "react";
import { Check, Clock, FileText, Printer, ArrowLeft, ChevronDown, X, Send } from "lucide-react";
import { useAccount } from "../../context/AccountContext";

const BillPayment = () => {
  const { accounts, refreshAccounts } = useAccount();
  const [step, setStep] = useState(1);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [billType, setBillType] = useState("electricity");
  const [provider, setProvider] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionResult, setTransactionResult] = useState(null);

  const billTypes = [
    { id: "electricity", name: "Electricity", providers: ["CEB", "LECO"] },
    { id: "water", name: "Water", providers: ["Water Board", "Private Suppliers"] },
    { id: "telecom", name: "Telecom", providers: ["Dialog", "Mobitel", "Hutch"] },
    { id: "tv", name: "TV Subscription", providers: ["PeoTV", "Dialog TV", "SLT PEO"] }
  ];

  const currentAccount = accounts.find(acc => acc.account_id === selectedAccount);
  const currentBillType = billTypes.find(type => type.id === billType);

  const resetForm = () => {
    setSelectedAccount("");
    setBillType("electricity");
    setProvider("");
    setAccountNumber("");
    setAmount("");
    setReferenceNumber("");
    setStep(1);
    setTransactionResult(null);
    refreshAccounts();
  };

  const printReceipt = () => {
    const printContent = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h2 style="text-align: center; margin-bottom: 20px;">Bill Payment Receipt</h2>
        <div style="margin-bottom: 15px;">
          <strong>Status:</strong> ${transactionResult.success ? 'Completed' : 'Failed'}
        </div>
        <div style="margin-bottom: 15px;">
          <strong>Transaction ID:</strong> ${transactionResult.transactionId || 'N/A'}
        </div>
        <div style="margin-bottom: 15px;">
          <strong>From Account:</strong> ${currentAccount?.account_number || 'N/A'}
        </div>
        <div style="margin-bottom: 15px;">
          <strong>Bill Type:</strong> ${currentBillType?.name || billType}
        </div>
        <div style="margin-bottom: 15px;">
          <strong>Provider:</strong> ${provider}
        </div>
        <div style="margin-bottom: 15px;">
          <strong>Account Number:</strong> ${accountNumber}
        </div>
        <div style="margin-bottom: 15px;">
          <strong>Reference Number:</strong> ${referenceNumber || 'N/A'}
        </div>
        <div style="margin-bottom: 15px;">
          <strong>Amount:</strong> Rs ${amount}
        </div>
        <div style="margin-bottom: 15px;">
          <strong>Date:</strong> ${new Date().toLocaleString()}
        </div>
        <div style="margin-top: 30px; text-align: center; font-size: 12px;">
          Thank you for using Wealth-COOP
        </div>
      </div>
    `;
    
    const printWindow = window.open('', '', 'width=600,height=600');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handlePayment = async () => {
    if (!currentAccount) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:3000/api/bills/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          account_id: selectedAccount,
          bill_type: billType,
          provider,
          account_number: accountNumber,
          amount: Number(amount),
          reference_number: referenceNumber
        })
      });

      const data = await response.json();
      
      if (response.status === 201) {
        setTransactionResult({
          success: true,
          message: data.message,
          transactionId: data.transaction_id,
          billType: data.bill_details.type,
          amount: amount,
          newBalance: data.new_balance
        });
      } else {
        throw new Error(data.error || "Payment failed");
      }
    } catch (error) {
      setTransactionResult({
        success: false,
        message: error.message || "An error occurred during payment"
      });
    } finally {
      setIsSubmitting(false);
      setStep(3);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between mb-8 relative">
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step === stepNumber ? 'bg-blue-600 text-white' : 
              step > stepNumber ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-400'
            }`}>
              {step > stepNumber ? <Check size={18} /> : stepNumber}
            </div>
            <span className={`mt-2 text-sm ${
              step >= stepNumber ? 'text-gray-800 font-medium' : 'text-gray-400'
            }`}>
              {stepNumber === 1 ? 'Bill Details' : stepNumber === 2 ? 'Confirm' : 'Receipt'}
            </span>
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Send className="mr-2 text-green-500" size={24} />
            Pay Bill</h2>
          
          <div className="space-y-4">
            {/* Account Selection */}
            <div>
              <label className="block text-gray-700 mb-2">From Account</label>
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Account</option>
                {accounts.map((account) => (
                  <option key={account.account_id} value={account.account_id}>
                    {account.account_number} - Rs {account.balance?.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            {/* Bill Type */}
            <div>
              <label className="block text-gray-700 mb-2">Bill Type</label>
              <select
                value={billType}
                onChange={(e) => {
                  setBillType(e.target.value);
                  setProvider("");
                }}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                {billTypes.map((type) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>

            {/* Provider */}
            <div>
              <label className="block text-gray-700 mb-2">Provider</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
                disabled={!billType}
              >
                <option value="">Select Provider</option>
                {currentBillType?.providers.map((provider) => (
                  <option key={provider} value={provider}>{provider}</option>
                ))}
              </select>
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-gray-700 mb-2">Account Number</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your account number with provider"
                required
              />
            </div>

            {/* Reference Number */}
            <div>
              <label className="block text-gray-700 mb-2">Reference Number (Optional)</label>
              <input
                type="text"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter reference number if any"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-gray-700 mb-2">Amount (LKR)</label>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter amount"
                required
              />
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!selectedAccount || !billType || !provider || !accountNumber || !amount}
              className={`w-full py-3 rounded-lg font-medium mt-4 ${
                !selectedAccount || !billType || !provider || !accountNumber || !amount
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Confirm Payment</h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">From Account:</span>
              <span className="font-medium">{currentAccount?.account_number}</span>
            </div>
            
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Bill Type:</span>
              <span className="font-medium">{currentBillType?.name}</span>
            </div>
            
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Provider:</span>
              <span className="font-medium">{provider}</span>
            </div>
            
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Account Number:</span>
              <span className="font-medium">{accountNumber}</span>
            </div>
            
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Reference Number:</span>
              <span className="font-medium">{referenceNumber || 'N/A'}</span>
            </div>
            
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium text-blue-600">Rs {amount}</span>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center"
            >
              <ArrowLeft size={18} className="mr-2" /> Back
            </button>
            
            <button
              onClick={handlePayment}
              disabled={isSubmitting}
              className={`flex-1 py-3 rounded-lg text-white flex items-center justify-center ${
                isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Confirm Payment"
              )}
            </button>
          </div>
        </div>
      )}

      {step === 3 && transactionResult && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className={`p-4 mb-6 rounded-lg ${
            transactionResult.success 
              ? "bg-green-50 text-green-800" 
              : "bg-red-50 text-red-800"
          }`}>
            <h2 className="text-xl font-bold mb-2 flex items-center">
              {transactionResult.success ? (
                <Check className="mr-2 text-green-500" size={24} />
              ) : (
                <X className="mr-2 text-red-500" size={24} />
              )}
              {transactionResult.success ? "Payment Successful!" : "Payment Failed"}
            </h2>
            <p>{transactionResult.message}</p>
            {transactionResult.transactionId && (
              <p className="mt-2">Transaction ID: {transactionResult.transactionId}</p>
            )}
            {transactionResult.success && transactionResult.newBalance && (
              <p className="mt-2">New Balance: Rs {transactionResult.newBalance.toLocaleString()}</p>
            )}
          </div>
          
          {transactionResult.success ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600">Bill Type</span>
                  <p className="font-medium">{currentBillType?.name}</p>
                </div>
                <div>
                  <span className="text-gray-600">Provider</span>
                  <p className="font-medium">{provider}</p>
                </div>
                <div>
                  <span className="text-gray-600">Account Number</span>
                  <p className="font-medium">{accountNumber}</p>
                </div>
                <div>
                  <span className="text-gray-600">Amount</span>
                  <p className="font-medium text-blue-600">Rs {amount}</p>
                </div>
              </div>
              
              <div className="pt-6 flex space-x-4">
                <button
                  onClick={resetForm}
                  className="flex-1 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  New Payment
                </button>
                
                <button
                  onClick={printReceipt}
                  className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
                >
                  <Printer size={18} className="mr-2" /> Print Receipt
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setStep(1)}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
            >
              Try Again
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BillPayment;