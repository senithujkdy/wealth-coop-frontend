// import React from 'react'

// function Loan() {
//   return (
//     <div>Loan</div>
//   )
// }

// export default Loan
import React from 'react';
import { User, Briefcase, BarChart2, Wrench } from 'lucide-react';

const Loan = () => {
  // Loan category data
  const loanCategories = [
    { 
      title: 'Personal Loans', 
      amount: '$50,000', 
      icon: <User className="text-blue-500" size={24} />,
      bgColor: 'bg-blue-100'
    },
    { 
      title: 'Corporate Loans', 
      amount: '$100,000', 
      icon: <Briefcase className="text-yellow-500" size={24} />,
      bgColor: 'bg-yellow-100'
    },
    { 
      title: 'Business Loans', 
      amount: '$500,000', 
      icon: <BarChart2 className="text-pink-500" size={24} />,
      bgColor: 'bg-pink-100'
    },
    { 
      title: 'Custom Loans', 
      amount: 'Choose Money', 
      icon: <Wrench className="text-teal-500" size={24} />,
      bgColor: 'bg-teal-100'
    },
  ];

  // Active loans data
  const activeLoans = [
    { id: '01', amount: '$100,000', leftToRepay: '$40,500', duration: '8 Months', interestRate: '12%', installment: '$2,000 / month' },
    { id: '02', amount: '$500,000', leftToRepay: '$250,000', duration: '36 Months', interestRate: '10%', installment: '$8,000 / month' },
    { id: '03', amount: '$900,000', leftToRepay: '$40,500', duration: '12 Months', interestRate: '12%', installment: '$5,000 / month' },
    { id: '04', amount: '$50,000', leftToRepay: '$40,500', duration: '25 Months', interestRate: '5%', installment: '$2,000 / month' },
    { id: '05', amount: '$50,000', leftToRepay: '$40,500', duration: '5 Months', interestRate: '16%', installment: '$10,000 / month' },
    { id: '06', amount: '$80,000', leftToRepay: '$25,500', duration: '14 Months', interestRate: '8%', installment: '$2,000 / month' },
    { id: '07', amount: '$12,000', leftToRepay: '$5,500', duration: '9 Months', interestRate: '13%', installment: '$500 / month' },
    { id: '08', amount: '$160,000', leftToRepay: '$100,800', duration: '3 Months', interestRate: '12%', installment: '$900 / month' },
  ];

  // Calculate totals
  const totalAmount = '$1,250,000';
  const totalLeftToRepay = '$750,000';
  const totalInstallment = '$50,000 / month';

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Loan Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {loanCategories.map((category, index) => (
            <div key={index} className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-center mb-2">
                <div className={`w-12 h-12 flex items-center justify-center ${category.bgColor} rounded-full mr-3`}>
                  {category.icon}
                </div>
                <span className="text-gray-500">{category.title}</span>
              </div>
              <div className="text-2xl font-bold">{category.amount}</div>
            </div>
          ))}
        </div>

        {/* Active Loans Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <h2 className="text-xl font-bold text-gray-800 p-6 pb-4">Active Loans Overview</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="px-6 py-3 font-medium">SL No</th>
                  <th className="px-6 py-3 font-medium">Loan Money</th>
                  <th className="px-6 py-3 font-medium">Left to repay</th>
                  <th className="px-6 py-3 font-medium">Duration</th>
                  <th className="px-6 py-3 font-medium">Interest rate</th>
                  <th className="px-6 py-3 font-medium">Installment</th>
                  <th className="px-6 py-3 font-medium">Repay</th>
                </tr>
              </thead>
              <tbody>
                {activeLoans.map((loan, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="px-6 py-4">{loan.id}.</td>
                    <td className="px-6 py-4 font-medium">{loan.amount}</td>
                    <td className="px-6 py-4">{loan.leftToRepay}</td>
                    <td className="px-6 py-4">{loan.duration}</td>
                    <td className="px-6 py-4">{loan.interestRate}</td>
                    <td className="px-6 py-4">{loan.installment}</td>
                    <td className="px-6 py-4">
                      <button
                        className={`rounded-full px-6 py-1 border border-blue-500 ${
                          index === 0 ? 'bg-blue-500 text-white' : 'text-blue-500 bg-white'
                        }`}
                      >
                        Repay
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-red-500 font-medium">Total</td>
                  <td className="px-6 py-4 text-red-500 font-medium">{totalAmount}</td>
                  <td className="px-6 py-4 text-red-500 font-medium">{totalLeftToRepay}</td>
                  <td className="px-6 py-4"></td>
                  <td className="px-6 py-4"></td>
                  <td className="px-6 py-4 text-red-500 font-medium">{totalInstallment}</td>
                  <td className="px-6 py-4"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loan;