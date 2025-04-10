import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const UDashboard = () => {
  // Sample data for the weekly activity chart
  const weeklyData = [
    { name: 'Sat', deposit: 230, withdraw: 480 },
    { name: 'Sun', deposit: 110, withdraw: 330 },
    { name: 'Mon', deposit: 250, withdraw: 310 },
    { name: 'Tue', deposit: 360, withdraw: 480 },
    { name: 'Wed', deposit: 230, withdraw: 140 },
    { name: 'Thu', deposit: 230, withdraw: 380 },
    { name: 'Fri', deposit: 320, withdraw: 380 },
  ];
  
  // Sample data for recent transactions
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

  // Custom tooltip for the chart
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl text-blue-400 mb-2">Balance</h3>
                <p className="text-3xl font-bold text-gray-800">$2,356</p>
              </div>
              <div>
                <h3 className="text-xl text-blue-400 mb-2">Account Name</h3>
                <p className="text-3xl font-bold text-gray-800">Daniel Anderson</p>
              </div>
            </div>
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
        <div className="mt-4">
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
              <div className="flex justify-end space-x-8">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-teal-400 mr-2"></div>
                  <span className="text-gray-600">Diposit</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-pink-400 mr-2"></div>
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