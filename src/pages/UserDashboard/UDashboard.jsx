import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // make sure correct path
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const UDashboard = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/accounts/user/${user.user_id}`);
        const data = await res.json();
        console.log('📦 Accounts Data:', data);
        setAccounts(data.accounts || []);
        setLoading(false);
      } catch (error) {
        console.error('🚨 Failed to fetch accounts:', error);
        setLoading(false);
      }
    };

    if (user) {
      fetchAccounts();
    }
  }, [user]);

  // Sample weekly data
  const weeklyData = [
    { name: 'Sat', deposit: 230, withdraw: 480 },
    { name: 'Sun', deposit: 110, withdraw: 330 },
    { name: 'Mon', deposit: 250, withdraw: 310 },
    { name: 'Tue', deposit: 360, withdraw: 480 },
    { name: 'Wed', deposit: 230, withdraw: 140 },
    { name: 'Thu', deposit: 230, withdraw: 380 },
    { name: 'Fri', deposit: 320, withdraw: 380 },
  ];

  // Sample recent transactions
  const recentTransactions = [
    {
      id: 1,
      type: 'card',
      title: 'Deposit from my Card',
      date: '28 January 2021',
      amount: -850,
      icon: (
        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
      ),
    },
    {
      id: 2,
      type: 'paypal',
      title: 'Deposit Paypal',
      date: '25 January 2021',
      amount: 2500,
      icon: (
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
        </div>
      ),
    },
    {
      id: 3,
      type: 'user',
      title: 'Jemi Wilson',
      date: '21 January 2021',
      amount: 5400,
      icon: (
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      ),
    },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded-md">
          <p className="text-sm">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Account Summary Section */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-700">Account Summary</h2>
          <a href="#" className="text-blue-700 hover:text-blue-900">See All</a>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Balance and Account Info */}
          <div className="bg-white rounded-xl shadow-sm p-6 flex-1">
            <h2 className="text-2xl font-bold text-gray-700 mb-6">Account Details</h2>

            {loading ? (
              <p className="text-gray-400">Loading accounts...</p>
            ) : accounts.length > 0 ? (
              <div className="space-y-6">
                {accounts.map((acc) => (
                  <div key={acc.account_id} className="p-4 border border-gray-100 rounded-lg shadow-sm">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500">Account Number:</span>
                      <span className="font-semibold">{acc.account_number}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500">Balance:</span>
                      <span className="font-semibold">{acc.balance} {acc.currency}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500">Account Type:</span>
                      <span className="font-semibold">{acc.account_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Created At:</span>
                      <span className="font-semibold">{new Date(acc.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No accounts found.</p>
            )}
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-sm p-6 lg:w-2/5">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Recent Transaction</h3>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    {transaction.icon}
                    <div className="ml-3">
                      <p className="font-medium text-gray-800">{transaction.title}</p>
                      <p className="text-sm text-gray-500">{transaction.date}</p>
                    </div>
                  </div>
                  <div className={`font-medium ${transaction.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {transaction.amount > 0 ? `+$${transaction.amount.toLocaleString()}` : `-$${Math.abs(transaction.amount).toLocaleString()}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Activity Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Weekly Activity</h2>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={weeklyData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                  barGap={20}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="withdraw" fill="#2563EB" radius={[10, 10, 0, 0]} />
                  <Bar dataKey="deposit" fill="#4FD1C5" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>

              <div className="flex justify-end space-x-8 mt-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-teal-400 mr-2"></div>
                  <span className="text-gray-600">Deposit</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-blue-400 mr-2"></div>
                  <span className="text-gray-600">Withdraw</span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UDashboard;
