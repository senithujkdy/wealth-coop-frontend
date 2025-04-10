import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowUp, ArrowDown, Plus } from 'lucide-react';

const Transaction = () => {
  const [activeTab, setActiveTab] = useState('All Transactions');
  const [currentPage, setCurrentPage] = useState(1);

  // Card data
  const cards = [
    {
      id: 1,
      balance: '$5,756',
      cardHolder: 'Peter Hans',
      validThru: '12/22',
      cardNumber: '3778 **** **** 1234',
      isActive: true,
    },
    {
      id: 2,
      balance: '$5,756',
      cardHolder: 'Peter Hans',
      validThru: '12/22',
      cardNumber: '3778 **** **** 1234',
      isActive: false,
    },
  ];

  // Transaction data
  const transactions = [
    {
      id: '#12548796',
      description: 'Spotify Subscription',
      type: 'Shopping',
      card: '1234 ****',
      date: '28 Jan, 12:30 AM',
      amount: -2500,
      direction: 'up',
    },
    {
      id: '#12548796',
      description: 'Freepik Sales',
      type: 'Transfer',
      card: '1234 ****',
      date: '25 Jan, 10:40 PM',
      amount: 750,
      direction: 'down',
    },
    {
      id: '#12548796',
      description: 'Mobile Service',
      type: 'Service',
      card: '1234 ****',
      date: '20 Jan, 10:40 PM',
      amount: -150,
      direction: 'up',
    },
    {
      id: '#12548796',
      description: 'Wilson',
      type: 'Transfer',
      card: '1234 ****',
      date: '15 Jan, 03:29 PM',
      amount: -1050,
      direction: 'up',
    },
    {
      id: '#12548796',
      description: 'Emilly',
      type: 'Transfer',
      card: '1234 ****',
      date: '14 Jan, 10:40 PM',
      amount: 840,
      direction: 'down',
    },
  ];

  // Filter tabs
  const tabs = ['All Transactions', 'Income', 'Expense'];

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Cards Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">My Cards</h2>
          <button className="flex items-center text-blue-600 font-medium">
            <Plus size={18} className="mr-1" /> Add Card
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {cards.map((card) => (
            <div 
              key={card.id} 
              className={`${
                card.isActive ? 'bg-blue-600' : 'bg-white'
              } rounded-xl p-5 shadow-sm relative overflow-hidden`}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className={`${card.isActive ? 'text-blue-200' : 'text-gray-400'} text-sm mb-1`}>Balance</p>
                  <p className={`text-2xl font-bold ${card.isActive ? 'text-white' : 'text-gray-900'}`}>{card.balance}</p>
                </div>
                <div className="text-right">
                  <div className={`w-10 h-6 ${card.isActive ? 'bg-white/20' : 'bg-gray-200'} rounded`}></div>
                </div>
              </div>
              
              <div className="flex justify-between items-end">
                <div>
                  <p className={`${card.isActive ? 'text-blue-200' : 'text-gray-400'} text-xs mb-1`}>CARD HOLDER</p>
                  <p className={`font-medium ${card.isActive ? 'text-white' : 'text-gray-900'}`}>{card.cardHolder}</p>
                </div>
                <div className="text-right">
                  <p className={`${card.isActive ? 'text-blue-200' : 'text-gray-400'} text-xs mb-1`}>VALID THRU</p>
                  <p className={`font-medium ${card.isActive ? 'text-white' : 'text-gray-900'}`}>{card.validThru}</p>
                </div>
              </div>
              
              <div className="mt-4 flex items-center">
                <p className={`text-xl tracking-widest ${card.isActive ? 'text-white' : 'text-gray-900'}`}>{card.cardNumber}</p>
                <div className="ml-auto flex space-x-1">
                  <div className={`w-6 h-6 ${card.isActive ? 'bg-white/30' : 'bg-gray-200'} rounded-full`}></div>
                  <div className={`w-6 h-6 ${card.isActive ? 'bg-white/20' : 'bg-gray-300'} rounded-full`}></div>
                </div>
              </div>
            </div>
          ))}
        </div>

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
                  onClick={() => setActiveTab(tab)}
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
                    <th className="px-6 py-3 font-medium">Card</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Amount</th>
                    <th className="px-6 py-3 font-medium">Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                            {transaction.direction === 'up' ? (
                              <ArrowUp size={16} className="text-gray-500" />
                            ) : (
                              <ArrowDown size={16} className="text-gray-500" />
                            )}
                          </div>
                          {transaction.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{transaction.id}</td>
                      <td className="px-6 py-4 text-gray-500">{transaction.type}</td>
                      <td className="px-6 py-4 text-gray-500">{transaction.card}</td>
                      <td className="px-6 py-4 text-gray-500">{transaction.date}</td>
                      <td className={`px-6 py-4 font-medium ${transaction.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {transaction.amount > 0 ? `+$${transaction.amount}` : `-$${Math.abs(transaction.amount)}`}
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-blue-600 border border-blue-600 rounded-full px-4 py-1 text-sm">
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Pagination */}
          <div className="flex justify-end items-center">
            <button 
              className="flex items-center text-blue-600 mr-4"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            >
              <ChevronLeft size={16} className="mr-1" /> Previous
            </button>
            
            {[1, 2, 3, 4].map((page) => (
              <button
                key={page}
                className={`w-8 h-8 flex items-center justify-center rounded-full mx-1 ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'text-blue-600'
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            
            <button 
              className="flex items-center text-blue-600 ml-4"
              onClick={() => setCurrentPage(Math.min(4, currentPage + 1))}
            >
              Next <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transaction;