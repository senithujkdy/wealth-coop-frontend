import React, { useState } from "react";
import { Listbox, Transition } from '@headlessui/react';
import { Send, ArrowLeft, Check, Printer, ChevronDown, ChevronUp, Clock, FileText, User, X } from "lucide-react";
import { useAccount } from "../../context/AccountContext";

const OneTimeTransfer = () => {
  const { accounts, refreshAccounts } = useAccount();
  const [selectedBank, setSelectedBank] = useState(null);
  const [isBankOpen, setIsBankOpen] = useState(false);
  
  // Form state
  const [step, setStep] = useState(1);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [receiverAccountNo, setReceiverAccountNo] = useState("");
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("Personal");
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionResult, setTransactionResult] = useState(null);

  // Bank options
  const bankOptions = [
     {
    name: "Wealth-COOP",
    logo: "../../src/assets/Logo.png",
    displayName: "Wealth Cooperative Bank"
  },
  {
    name: "Commercial Bank",
    logo: "../../src/assets/logos/commercial.png",
    displayName: "Commercial Bank of Ceylon"
  },
  {
    name: "Hatton National Bank",
    logo: "../../src/assets/logos/HNB.jpg",
    displayName: "Hatton National Bank"
  },
  {
    name: "Bank of Ceylon",
    logo: "../../src/assets/logos/BOC.png",
    displayName: "Bank of Ceylon"
  },
  {
    name: "People's Bank",
    logo: "../../src/assets/logos/Peoples.jpg",
    displayName: "People's Bank"
  },
  {
    name: "Sampath Bank",
    logo: "../../src/assets/logos/Sampath.jpg",
    displayName: "Sampath Bank"
  }
  ];

  // Get selected account details
  const currentAccount = accounts.find(acc => acc.account_id === selectedAccount);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR'
    }).format(amount || 0);
  };

  const handleTransfer = async () => {
    if (!currentAccount) return;
    
    setIsSubmitting(true);
    try {
      const isInternalTransfer = selectedBank.name === "Wealth-COOP";
      
      const endpoint = isInternalTransfer 
        ? `http://localhost:3000/api/transactions/transfer`
        : `http://localhost:3000/api/transactions/withdraw/${receiverAccountNo}`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          account_id: selectedAccount,
          amount: Number(amount),
          purpose,
          beneficiary_name: beneficiaryName,
          description,
          beneficiary_bank: selectedBank.name,
          ...(isInternalTransfer && { receiver_account: receiverAccountNo })
        })
      });

      const data = await response.json();
      
      if (response.status === 201) {
        await refreshAccounts();
        setTransactionResult({
          success: true,
          message: data.message,
          transactionId: data.transaction_id,
          amount: amount,
          receiverAccount: receiverAccountNo,
          newBalance: data.new_balance,
          date: new Date().toISOString(),
          isInternalTransfer
        });
      } else {
        throw new Error(data.error || "Transfer failed");
      }
    } catch (error) {
      setTransactionResult({
        success: false,
        message: error.message || "An error occurred during transfer"
      });
    } finally {
      setIsSubmitting(false);
      setStep(3);
    }
  };
    
  const printReceipt = () => {

  const logoUrl = '../../src/assets/Logo.png';

    const printContent = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 15px;">
          <img src="${logoUrl}" alt="Wealth-COOP Logo" style="height: 50px; margin-bottom: 10px;">
          <h1 style="margin: 0; color: #2c3e50; font-size: 24px;">Wealth Cooperative Bank</h1>
        </div>
        <h2 style="text-align: center; margin-bottom: 20px; border-top: 1px solid #eee; padding-top: 20px;">Transaction Receipt</h2>
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
          <strong>From Bank:</strong> Wealth-COOP
        </div>
        <div style="margin-bottom: 15px;">
          <strong>To Account:</strong> ${receiverAccountNo}
        </div>
        <div style="margin-bottom: 15px;">
          <strong>To Bank:</strong> ${selectedBank?.displayName || 'N/A'}
        </div>
        <div style="margin-bottom: 15px;">
          <strong>Beneficiary:</strong> ${beneficiaryName}
        </div>
        <div style="margin-bottom: 15px;">
          <strong>Purpose:</strong> ${purpose}
        </div>
        <div style="margin-bottom: 15px;">
          <strong>Description:</strong> ${description || 'N/A'}
        </div>
        <div style="margin-bottom: 15px;">
          <strong>Amount:</strong> ${formatCurrency(amount)}
        </div>
        <div style="margin-bottom: 15px;">
          <strong>Date:</strong> ${new Date().toLocaleString()}
        </div>
        <div style="margin-bottom: 15px;">
          <strong>New Balance:</strong> ${formatCurrency(transactionResult.newBalance)}
        </div>
        <div style="margin-top: 30px; text-align: center; font-size: 12px; border-top: 1px solid #eee; padding-top: 15px;">
          Thank you for using Wealth-COOP
        </div>
      </div>
    `;
    
    const printWindow = window.open('', 'WealthCOOP_Receipt', 'width=600,height=600');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Wealth-COOP Transaction Receipt</title>
          <style>
            @media print {
              body { -webkit-print-color-adjust: exact; }
              @page { size: auto; margin: 5mm; }
            }
          </style>
        </head>
        <body>
          ${printContent}
          <script>
            // Set the default filename when saving as PDF
            document.title = "WealthCOOP_Receipt_${transactionResult.transactionId || Date.now()}";
            window.print();
            setTimeout(() => window.close(), 1000);
          </script>
        </body>
      </html>
    `);
    
  };

  const resetForm = () => {
    setSelectedAccount("");
    setReceiverAccountNo("");
    setAmount("");
    setPurpose("Personal");
    setBeneficiaryName("");
    setDescription("");
    setSelectedBank(null);
    setStep(1);
    setTransactionResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -z-10"></div>
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex flex-col items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
              step === stepNumber 
                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white border-2 border-blue-600 shadow-lg' 
                : step > stepNumber 
                  ? 'bg-green-50 text-green-600 border-2 border-green-300' 
                  : 'bg-white text-gray-400 border-2 border-gray-200'
            }`}>
              {step > stepNumber ? <Check size={20} /> : stepNumber}
            </div>
            <span className={`mt-3 text-sm font-medium transition-colors ${
              step >= stepNumber ? 'text-gray-800 font-semibold' : 'text-gray-400'
            }`}>
              {stepNumber === 1 ? 'Transfer Details' : stepNumber === 2 ? 'Confirmation' : 'Receipt'}
            </span>
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="bg-white rounded-2xl shadow-md p-6 transition-all duration-300 transform hover:shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Send className="mr-2 text-blue-500" size={24} />
            New Transfer
          </h2>
          
          <div className="space-y-6">
            {/* Account Selection */}
            <div className="space-y-1">
              <label className="block text-gray-700 text-lg font-medium">Your Account</label>
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
                required
              >
                <option value="">Select Account</option>
                {accounts.map((account) => (
                  <option key={account.account_id} value={account.account_id}>
                    {account.account_number} - {formatCurrency(account.balance)}
                  </option>
                ))}
              </select>
            </div>

            {/* Beneficiary Account Number */}
            <div className="space-y-1">
              <label className="block text-gray-700 text-lg font-medium">Beneficiary Account</label>
              <input
                type="text"
                value={receiverAccountNo}
                onChange={(e) => setReceiverAccountNo(e.target.value)}
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
                placeholder="Enter account number"
                required
              />
            </div>

            {/* Beneficiary Bank Selector */}
            <div className="space-y-1">
              <label className="block text-gray-700 text-lg font-medium">Beneficiary Bank</label>
              <Listbox 
                value={selectedBank} 
                onChange={setSelectedBank}
              >
                {({ open }) => (
                  <div className="relative">
                    <Listbox.Button 
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-left flex items-center bg-white hover:bg-gray-50 transition-all"
                      onClick={() => setIsBankOpen(!isBankOpen)}
                    >
                      {selectedBank ? (
                        <div className="flex items-center space-x-4">
                          <img 
                            src={selectedBank.logo} 
                            alt={selectedBank.name}
                            className="w-10 h-10 object-contain rounded-full border border-gray-200"
                          />
                          <span className="text-lg font-medium">{selectedBank.displayName}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">Select your bank</span>
                      )}
                      <span className="ml-auto text-gray-400">
                        {open ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                      </span>
                    </Listbox.Button>
                    
                    <Transition
                      show={open}
                      enter="transition duration-100 ease-out"
                      enterFrom="transform scale-95 opacity-0"
                      enterTo="transform scale-100 opacity-100"
                      leave="transition duration-75 ease-out"
                      leaveFrom="transform scale-100 opacity-100"
                      leaveTo="transform scale-95 opacity-0"
                    >
                      <Listbox.Options 
                        static
                        className="absolute z-20 mt-2 w-full bg-white shadow-lg rounded-xl py-2 max-h-80 overflow-auto border border-gray-200"
                      >
                        {bankOptions.map((bank) => (
                          <Listbox.Option
                            key={bank.name}
                            value={bank}
                            className={({ active }) => 
                              `cursor-pointer py-3 px-5 ${active ? 'bg-blue-50' : 'bg-white'} transition-colors`
                            }
                          >
                            <div className="flex items-center space-x-4">
                              <img 
                                src={bank.logo} 
                                alt={bank.name}
                                className="w-10 h-10 object-contain rounded-full border border-gray-200"
                              />
                              <div>
                                <div className="text-lg font-medium">{bank.displayName}</div>
                                <div className="text-gray-500">{bank.name}</div>
                              </div>
                            </div>
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                )}
              </Listbox>
            </div>

            {/* Beneficiary Name */}
            <div className="space-y-1">
              <label className="block text-gray-700 text-lg font-medium flex items-center">
                <User className="mr-2" size={18} />
                Beneficiary Name
              </label>
              <input
                type="text"
                value={beneficiaryName}
                onChange={(e) => setBeneficiaryName(e.target.value)}
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
                placeholder="Full name of recipient"
                required
              />
            </div>

            {/* Amount */}
            <div className="space-y-1">
              <label className="block text-gray-700 text-lg font-medium">Amount (LKR)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">Rs</span>
                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-12 pr-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* Purpose */}
            <div className="space-y-1">
              <label className="block text-gray-700 text-lg font-medium">Purpose</label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
              >
                <option value="Personal">Personal Transfer</option>
                <option value="Business">Business Payment</option>
                <option value="Family Support">Family Support</option>
                <option value="Investment">Investment</option>
                <option value="Loan Repayment">Loan Repayment</option>
              </select>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="block text-gray-700 text-lg font-medium flex items-center">
                <FileText className="mr-2" size={18} />
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
                placeholder="Add any notes about this transfer"
                rows="3"
              />
            </div>

            <div className="pt-4">
              <button
                onClick={() => setStep(2)}
                disabled={
                  !selectedAccount || 
                  !receiverAccountNo || 
                  !selectedBank ||
                  !beneficiaryName || 
                  !amount
                }
                className={`w-full py-4 rounded-xl font-medium flex items-center justify-center transition-all duration-300 ${
                  !selectedAccount || !receiverAccountNo || !selectedBank || !beneficiaryName || !amount
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl"
                }`}
              >
                <span className="mr-2">Continue</span>
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-2xl shadow-md p-6 transition-all duration-300 transform hover:shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Check className="mr-2 text-green-500" size={24} />
            Confirm Transfer
          </h2>
          
          <div className="space-y-4 mb-6 bg-gray-50 p-5 rounded-xl">
            <div className="flex justify-between py-3">
              <span className="text-gray-600">From Account:</span>
              <span className="font-medium text-right">
                {currentAccount?.account_number}<br />
                <span className="text-blue-600">{formatCurrency(currentAccount?.balance)}</span>
              </span>
            </div>
            
            <div className="border-t border-gray-200 my-2"></div>
            
            <div className="flex justify-between py-3">
              <span className="text-gray-600">To Account:</span>
              <span className="font-medium text-right">
                {receiverAccountNo}<br />
                <span className="text-gray-500">{selectedBank?.displayName}</span>
              </span>
            </div>
            
            <div className="flex justify-between py-3">
              <span className="text-gray-600">Beneficiary:</span>
              <span className="font-medium">{beneficiaryName}</span>
            </div>
            
            <div className="flex justify-between py-3">
              <span className="text-gray-600">Amount:</span>
              <span className="text-2xl font-bold text-blue-600">{formatCurrency(amount)}</span>
            </div>
            
            <div className="flex justify-between py-3">
              <span className="text-gray-600">Purpose:</span>
              <span className="font-medium capitalize">{purpose.toLowerCase()}</span>
            </div>
            
            {description && (
              <>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between py-3">
                  <span className="text-gray-600">Description:</span>
                  <span className="font-medium text-gray-700 max-w-xs text-right">{description}</span>
                </div>
              </>
            )}
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-3 rounded-xl font-medium border-2 border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center justify-center transition-all"
            >
              <ArrowLeft className="mr-2" size={18} />
              Edit Details
            </button>
            
            <button
              onClick={handleTransfer}
              disabled={isSubmitting}
              className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center transition-all ${
                isSubmitting
                  ? "bg-blue-300 text-white cursor-wait"
                  : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl"
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
                <>
                  <Check className="mr-2" size={18} />
                  Confirm Transfer
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {step === 3 && transactionResult && (
        <div className="bg-white rounded-2xl shadow-md p-6 transition-all duration-300 transform hover:shadow-lg">
          <div className={`p-5 mb-6 rounded-xl ${
            transactionResult.success 
              ? "bg-gradient-to-r from-green-50 to-green-100 border border-green-200" 
              : "bg-gradient-to-r from-red-50 to-red-100 border border-red-200"
          }`}>
            <h2 className="text-2xl font-bold mb-3 flex items-center">
              {transactionResult.success ? (
                <Check className="mr-2 text-green-500" size={24} />
              ) : (
                <X className="mr-2 text-red-500" size={24} />
              )}
              {transactionResult.success ? "Transfer Successful!" : "Transfer Failed"}
            </h2>
            <p className="text-lg">{transactionResult.message}</p>
            {transactionResult.transactionId && (
              <p className="mt-3 text-gray-700">
                <span className="font-medium">Transaction ID:</span> {transactionResult.transactionId}
              </p>
            )}
            {transactionResult.success && transactionResult.newBalance && (
              <p className="mt-2 text-gray-700">
                <span className="font-medium">New Balance:</span> {formatCurrency(transactionResult.newBalance)}
              </p>
            )}
          </div>
          
          {transactionResult.success ? (
            <div className="space-y-4 bg-gray-50 p-5 rounded-xl">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600">From Account</span>
                  <p className="font-medium">{currentAccount?.account_number}</p>
                </div>
                <div>
                  <span className="text-gray-600">To Account</span>
                  <p className="font-medium">{receiverAccountNo}</p>
                </div>
                <div>
                  <span className="text-gray-600">Amount</span>
                  <p className="font-medium text-blue-600">{formatCurrency(amount)}</p>
                </div>
                <div>
                  <span className="text-gray-600">Date</span>
                  <p className="font-medium">{new Date().toLocaleString()}</p>
                </div>
              </div>
              
              <div className="pt-6 flex space-x-4">
                <button
                  onClick={resetForm}
                  className="flex-1 py-3 rounded-xl font-medium border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
                >
                  New Transfer
                </button>
                
                <button
                  onClick={printReceipt}
                  className="flex-1 py-3 rounded-xl font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all"
                >
                  <Printer className="mr-2" size={18} />
                  Print Receipt
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4">
              <button
                onClick={() => setStep(1)}
                className="w-full py-3 rounded-xl font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OneTimeTransfer;