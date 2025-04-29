import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle } from 'lucide-react';

const AccountCreationPopup = ({ isOpen, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    account_type: 'Savings',
    balance: 5000,
    currency: 'LKR'
  });

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
        onSuccess && onSuccess();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [success, onSuccess]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'balance' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Check for user_id from the user object structure in your AuthContext
      if (!user || !user.user_id) {
        throw new Error('User information not found. Please try again.');
      }
      
      const response = await fetch('http://localhost:3000/api/accounts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.user_id,
          account_type: formData.account_type,
          balance: formData.balance,
          currency: formData.currency
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account');
      }
      
      setSuccess(true);
    } catch (err) {
      console.error('Account creation error:', err);
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative overflow-hidden">
        {/* Header */}
        <div className="bg-blue-700 p-6 text-white">
          <h2 className="text-xl font-bold">Create Your Bank Account</h2>
          <p className="mt-1 text-blue-100">Complete this step to access your dashboard</p>
        </div>
        
        {/* Success message */}
        {success ? (
          <div className="p-6">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
              <span className="block sm:inline">Account created successfully!</span>
            </div>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
            </div>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            
            {/* Required Notice */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    You must create a bank account to access the dashboard.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Account Type */}
              <div>
                <label htmlFor="account_type" className="block mb-2 text-sm font-medium text-gray-700">
                  Account Type
                </label>
                <select
                  id="account_type"
                  name="account_type"
                  value={formData.account_type}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Savings">Savings Account</option>
                  <option value="Current">Current Account</option>
                </select>
              </div>
              
              {/* Initial Deposit */}
              <div>
                <label htmlFor="balance" className="block mb-2 text-sm font-medium text-gray-700">
                  Initial Deposit (LKR)
                </label>
                <input
                  type="number"
                  id="balance"
                  name="balance"
                  value={formData.balance}
                  onChange={handleChange}
                  min="1000"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">Minimum deposit: LKR 1,000</p>
              </div>
              
              {/* Currency (Read-only) */}
              <div>
                <label htmlFor="currency" className="block mb-2 text-sm font-medium text-gray-700">
                  Currency
                </label>
                <input
                  type="text"
                  id="currency"
                  value="LKR (Sri Lankan Rupee)"
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-100"
                  disabled
                />
              </div>
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3 px-4 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <span className="animate-spin h-5 w-5 mr-3 border-b-2 border-white rounded-full"></span>
                  Creating...
                </>
              ) : 'Create Account'}
            </button>
          </form>
        )}
        
        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg">
          <p className="text-xs text-gray-500">
            By creating an account, you agree to our terms and conditions regarding banking services.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountCreationPopup;