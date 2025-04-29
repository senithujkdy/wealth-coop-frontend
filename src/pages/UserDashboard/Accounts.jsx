import React from 'react';
import { CreditCard, ArrowUpRight, Smartphone, User } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useAccount } from '../../context/AccountContext';
import { useAuth } from '../../context/AuthContext'; // Optional, if you want to show user name

const Accounts = () => {
  // Sample data for the spending chart
  // const data = [
  //   { name: 'Housing', value: 1200 },
  //   { name: 'Food', value: 800 },
  //   { name: 'Transport', value: 600 },
  //   { name: 'Entertainment', value: 500 },
  //   { name: 'Others', value: 360 },
  // ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a569bd'];

  const transactions = [
    {
      id: 1,
      name: 'Spotify Subscription',
      date: '25 Jan 2021',
      category: 'Shopping',
      cardLast4: '1234',
      status: 'Pending',
      amount: -150,
      icon: <CreditCard className="text-teal-500" size={20} />,
      iconBg: 'bg-teal-100',
    },
    {
      id: 2,
      name: 'Mobile Service',
      date: '25 Jan 2021',
      category: 'Service',
      cardLast4: '1234',
      status: 'Completed',
      amount: -340,
      icon: <Smartphone className="text-blue-500" size={20} />,
      iconBg: 'bg-blue-100',
    },
    {
      id: 3,
      name: 'Emilly Wilson',
      date: '25 Jan 2021',
      category: 'Transfer',
      cardLast4: '1234',
      status: 'Completed',
      amount: 780,
      icon: <User className="text-pink-500" size={20} />,
      iconBg: 'bg-pink-100',
    },
  ];
  const { accounts, loading } = useAccount();
  const { user } = useAuth(); // Optional
  
  const account = accounts[0]; // Only showing first account

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Account Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 flex items-center justify-center bg-yellow-100 rounded-full mr-3">
                <span className="text-yellow-500 text-lg">Rs</span>
              </div>
              <span className="text-gray-500">My Balance</span>
            </div>
            <div className="text-2xl font-bold"> {account ? `${account.currency} ${account.balance.toLocaleString()}` : '--'}</div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full mr-3">
                <ArrowUpRight className="text-blue-500" size={20} />
              </div>
              <span className="text-gray-500">Income</span>
            </div>
            <div className="text-2xl font-bold">Rs 5,600</div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 flex items-center justify-center bg-pink-100 rounded-full mr-3">
                <CreditCard className="text-pink-500" size={20} />
              </div>
              <span className="text-gray-500">Expense</span>
            </div>
            <div className="text-2xl font-bold">Rs 3,460</div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 flex items-center justify-center bg-teal-100 rounded-full mr-3">
                <span className="text-teal-500 text-lg">💰</span>
              </div>
              <span className="text-gray-500">Total Saving</span>
            </div>
            <div className="text-2xl font-bold">Rs 7,920</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Transaction History */}
          <div className="md:col-span-2 bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Last Transaction</h2>
              <button className="text-blue-600 font-medium">See All</button>
            </div>

            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 ${transaction.iconBg} rounded-full flex items-center justify-center mr-4`}>
                      {transaction.icon}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{transaction.name}</p>
                      <p className="text-sm text-gray-500">{transaction.date}</p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-gray-600">{transaction.category}</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-gray-600">{transaction.cardLast4.slice(0, 4)} ****</p>
                  </div>
                  
                  <div className="text-center">
                    <p className={`${transaction.status === 'Pending' ? 'text-yellow-500' : 'text-green-500'}`}>
                      {transaction.status}
                    </p>
                  </div>
                  
                  <div>
                    <p className={`font-medium ${transaction.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {transaction.amount > 0 ? `+Rs ${transaction.amount}` : `-Rs ${Math.abs(transaction.amount)}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card Details and Spending */}
          <div className="space-y-6">
            {/* Card Component */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">My Card</h2>
                <button className="text-blue-600 font-medium">See All</button>
              </div>
              
              <div className="bg-blue-600 rounded-xl p-5 text-white relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-blue-200 text-sm mb-1">Balance</p>
                    <p className="text-2xl font-bold">Rs 5,756</p>
                  </div>
                  <div className="text-right">
                    <div className="w-10 h-6 bg-white/20 rounded"></div>
                  </div>
                </div>
                
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-blue-200 text-xs mb-1">CARD HOLDER</p>
                    <p className="font-medium">{user?.full_name || 'Account Holder'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-200 text-xs mb-1">VALID THRU</p>
                    <p className="font-medium">12/22</p>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center">
                  <p className="text-xl tracking-widest">3778 **** **** 1234</p>
                  {/* <p className="text-xl tracking-widest">
  {account ? `${account.account_number.slice(0, 4)} **** **** ${account.account_number.slice(-4)}` : '****'}
</p> */}

                  <div className="ml-auto flex space-x-1">
                    <div className="w-6 h-6 bg-white/30 rounded-full"></div>
                    <div className="w-6 h-6 bg-white/20 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accounts;