import React, { useEffect, useState } from 'react';
import { CreditCard, ArrowUpRight, Smartphone, User, ArrowDown, ArrowUp, PieChart, Lightbulb, TrendingUp, Shield, PiggyBank } from 'lucide-react';
import { useAccount } from '../../context/AccountContext';
import { useAuth } from '../../context/AuthContext';

const Accounts = () => {
  const { accounts, loading } = useAccount();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [spendingByCategory, setSpendingByCategory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (accounts.length > 0) {
      fetchTransactions();
    }
  }, [accounts]);

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/transactions/account/${accounts[0].account_id}`);
      const data = await res.json();
      setTransactions(data.slice(0, 3));
      
      const incomeTotal = data
        .filter(tx => tx.transaction_type === 'Deposit')
        .reduce((sum, tx) => sum + tx.amount, 0);
      
      const expenseTotal = data
        .filter(tx => tx.transaction_type === 'Withdrawal')
        .reduce((sum, tx) => sum + tx.amount, 0);
      
      setIncome(incomeTotal);
      setExpense(expenseTotal);

      const categorySpending = data
        .filter(tx => tx.transaction_type === 'Withdrawal')
        .reduce((acc, tx) => {
          const category = tx.purpose || 'Other';
          acc[category] = (acc[category] || 0) + tx.amount;
          return acc;
        }, {});

      const formattedCategories = Object.entries(categorySpending)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 3);

      setSpendingByCategory(formattedCategories);
      generateSuggestions(incomeTotal, expenseTotal, formattedCategories);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    }
  };

  const generateSuggestions = (income, expenses, categories) => {
    const savingsRate = ((income - expenses) / income) * 100;
    const topCategory = categories[0]?.name || 'spending';
    const topCategoryAmount = categories[0]?.value || 0;

    const generatedSuggestions = [];

    if (savingsRate < 20) {
      generatedSuggestions.push({
        icon: <PiggyBank className="text-blue-500" size={20} />,
        title: "Increase Your Savings",
        description: `Your savings rate is ${savingsRate.toFixed(1)}%. Try to save at least 20% of your income.`,
        action: "Set up auto-savings"
      });
    } else {
      generatedSuggestions.push({
        icon: <TrendingUp className="text-green-500" size={20} />,
        title: "Great Savings Habits",
        description: `You're saving ${savingsRate.toFixed(1)}% of your income. Consider investing your savings.`,
        action: "Explore investment options"
      });
    }

    if (topCategoryAmount > (income * 0.3)) {
      generatedSuggestions.push({
        icon: <CreditCard className="text-orange-500" size={20} />,
        title: "Reduce Spending",
        description: `Your ${topCategory} spending is high (Rs ${topCategoryAmount.toLocaleString()}). Look for ways to cut back.`,
        action: "Create budget for this category"
      });
    }

    if ((income - expenses) * 3 < expenses) {
      generatedSuggestions.push({
        icon: <Shield className="text-purple-500" size={20} />,
        title: "Build Emergency Fund",
        description: "Aim to save 3-6 months of expenses for emergencies.",
        action: "Start emergency fund"
      });
    }

    if (generatedSuggestions.length === 0) {
      generatedSuggestions.push({
        icon: <Lightbulb className="text-yellow-500" size={20} />,
        title: "Financial Health Check",
        description: "Your finances look balanced. Consider meeting with a financial advisor.",
        action: "Schedule consultation"
      });
    }

    setSuggestions(generatedSuggestions.slice(0, 3));
  };

  const account = accounts[0];

  const formatTransaction = (tx) => {
    const isDeposit = tx.transaction_type === 'Deposit';
    const categories = {
      'Deposit': 'Deposit',
      'Withdrawal': tx.purpose || 'Payment',
      'Bill Payment': 'Utility'
    };
    
    return {
      id: tx._id || tx.transaction_id,
      name: isDeposit ? 'Deposit' : tx.beneficiary_name || tx.description || 'Payment',
      date: new Date(tx.transaction_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      category: categories[tx.transaction_type] || 'Other',
      cardLast4: account ? account.account_number.slice(-4) : '****',
      status: tx.status || 'Completed',
      amount: isDeposit ? tx.amount : -tx.amount,
      icon: isDeposit ? 
        <ArrowDown className="text-green-500" size={20} /> : 
        <ArrowUp className="text-red-500" size={20} />,
      iconBg: isDeposit ? 'bg-green-100' : 'bg-red-100'
    };
  };

  const categoryColors = {
    'Personal': '#0088FE',
    'Business': '#00C49F',
    'Family Support': '#FFBB28',
    'Other': '#a569bd',
    'Utility': '#FF8042'
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 flex items-center justify-center bg-yellow-100 rounded-full mr-3">
                <span className="text-yellow-500 text-lg">Rs</span>
              </div>
              <span className="text-gray-500">My Balance</span>
            </div>
            <div className="text-2xl font-bold"> 
              {account ? `Rs ${account.balance.toLocaleString()}` : '--'}
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full mr-3">
                <ArrowUpRight className="text-blue-500" size={20} />
              </div>
              <span className="text-gray-500">Income</span>
            </div>
            <div className="text-2xl font-bold">Rs {income.toLocaleString()}</div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 flex items-center justify-center bg-pink-100 rounded-full mr-3">
                <CreditCard className="text-pink-500" size={20} />
              </div>
              <span className="text-gray-500">Expense</span>
            </div>
            <div className="text-2xl font-bold">Rs {expense.toLocaleString()}</div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 flex items-center justify-center bg-teal-100 rounded-full mr-3">
                <PieChart className="text-teal-500" size={20} />
              </div>
              <span className="text-gray-500">Expenditure Breakdown</span>
            </div>
            <div className="space-y-2">
              {spendingByCategory.length > 0 ? (
                spendingByCategory.map((category) => (
                  <div key={category.name} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: categoryColors[category.name] || '#a569bd' }}
                      />
                      <span className="text-sm text-gray-600">
                        {category.name}
                      </span>
                    </div>
                    <span className="text-sm font-medium">
                      Rs {category.value.toLocaleString()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">
                  {loading ? 'Loading...' : 'No spending data'}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Transaction History */}
          <div className="md:col-span-2 bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Last Transaction</h2>
              <button className="text-blue-600 font-medium">See All</button>
            </div>

            <div className="space-y-4">
              {transactions.length > 0 ? (
                transactions.map((tx) => {
                  const formattedTx = formatTransaction(tx);
                  return (
                    <div key={formattedTx.id} className="flex items-center justify-between pb-4 border-b border-gray-100">
                      <div className="flex items-center">
                        <div className={`w-12 h-12 ${formattedTx.iconBg} rounded-full flex items-center justify-center mr-4`}>
                          {formattedTx.icon}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{formattedTx.name}</p>
                          <p className="text-sm text-gray-500">{formattedTx.date}</p>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-gray-600">{formattedTx.category}</p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-gray-600">**** {formattedTx.cardLast4}</p>
                      </div>
                      
                      <div className="text-center">
                        <p className={`${formattedTx.status === 'Pending' ? 'text-yellow-500' : 'text-green-500'}`}>
                          {formattedTx.status}
                        </p>
                      </div>
                      
                      <div>
                        <p className={`font-medium ${formattedTx.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {formattedTx.amount > 0 ? 
                            `+Rs ${formattedTx.amount.toLocaleString()}` : 
                            `-Rs ${Math.abs(formattedTx.amount).toLocaleString()}`
                          }
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {loading ? 'Loading transactions...' : 'No transactions found'}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <Lightbulb className="text-yellow-500 mr-2" size={24} />
                Financial Suggestions
              </h2>
            </div>

            <div className="space-y-4">
              {suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                  <div key={index} className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-start mb-3">
                      <div className="w-10 h-10 flex items-center justify-center bg-opacity-20 rounded-full mr-3" 
                        style={{ backgroundColor: `${suggestion.icon.props.className.match(/text-(.*?)-500/)[1]}20` }}>
                        {suggestion.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{suggestion.title}</h3>
                        <p className="text-sm text-gray-600">{suggestion.description}</p>
                      </div>
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                      {suggestion.action} →
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {loading ? 'Analyzing your finances...' : 'No suggestions available'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accounts;