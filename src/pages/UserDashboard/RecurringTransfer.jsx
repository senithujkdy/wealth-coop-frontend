import React, { useState } from 'react';
import { Clock, Check, ArrowLeft, ChevronDown, User, Send } from 'lucide-react';
import { useAccount } from '../../context/AccountContext';

const RecurringTransfer = () => {
  const { accounts } = useAccount();
  const [step, setStep] = useState(1);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [recipientAccount, setRecipientAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('weekly');
  const [startDate, setStartDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scheduledPayments, setScheduledPayments] = useState([]);

  const frequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ];

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const newPayment = {
        id: Date.now(),
        fromAccount: selectedAccount,
        toAccount: recipientAccount,
        amount,
        frequency,
        startDate,
        status: 'Scheduled'
      };
      setScheduledPayments([...scheduledPayments, newPayment]);
      setIsSubmitting(false);
      setStep(3);
    }, 1500);
  };

  const resetForm = () => {
    setSelectedAccount('');
    setRecipientAccount('');
    setAmount('');
    setFrequency('weekly');
    setStartDate('');
    setStep(1);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Steps */}
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
              {stepNumber === 1 ? 'Details' : stepNumber === 2 ? 'Schedule' : 'Confirmation'}
            </span>
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Send className="mr-2 text-purple-500" size={24} />
            New Recurring Transfer
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">From Account</label>
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
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

            <div>
              <label className="block text-gray-700 mb-2">Recipient Account Number</label>
              <input
                type="text"
                value={recipientAccount}
                onChange={(e) => setRecipientAccount(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Enter account number"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Amount (LKR)</label>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Enter amount"
                required
              />
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!selectedAccount || !recipientAccount || !amount}
              className={`w-full py-3 rounded-lg font-medium mt-4 ${
                !selectedAccount || !recipientAccount || !amount
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Clock className="mr-2 text-purple-500" size={24} />
            Schedule Settings
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              >
                {frequencies.map((freq) => (
                  <option key={freq.value} value={freq.value}>{freq.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center"
              >
                <ArrowLeft size={18} className="mr-2" /> Back
              </button>
              
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !startDate}
                className={`flex-1 py-3 rounded-lg text-white flex items-center justify-center ${
                  isSubmitting ? "bg-purple-400" : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                {isSubmitting ? "Scheduling..." : "Schedule Transfer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="p-4 mb-6 rounded-lg bg-green-50 text-green-800">
            <h2 className="text-xl font-bold mb-2 flex items-center">
              <Check className="mr-2 text-green-500" size={24} />
              Recurring Transfer Scheduled!
            </h2>
            <p>Your automatic payments have been set up successfully.</p>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">From Account</span>
                <p className="font-medium">{selectedAccount}</p>
              </div>
              <div>
                <span className="text-gray-600">To Account</span>
                <p className="font-medium">{recipientAccount}</p>
              </div>
              <div>
                <span className="text-gray-600">Amount</span>
                <p className="font-medium text-purple-600">Rs {amount}</p>
              </div>
              <div>
                <span className="text-gray-600">Frequency</span>
                <p className="font-medium">
                  {frequencies.find(f => f.value === frequency)?.label}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Start Date</span>
                <p className="font-medium">
                  {new Date(startDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="pt-6">
              <button
                onClick={resetForm}
                className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white"
              >
                Create Another Recurring Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecurringTransfer;