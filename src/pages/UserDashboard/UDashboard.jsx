import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import _ from "lodash";
import { Outlet, Link } from "react-router-dom";
import Card from "../../components/layout/Card/Card";
import { useAccount } from "../../context/AccountContext";

const UDashboard = () => {
  const { user } = useAuth();
  const { account } = useAccount();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/accounts/user/${user.user_id}`
        );
        const data = await res.json();
        console.log("📦 Accounts Data:", data);
        setAccounts(data.accounts || []);
        setLoading(false);
      } catch (error) {
        console.error("🚨 Failed to fetch accounts:", error);
        setLoading(false);
      }
    };

    if (user) {
      fetchAccounts();
    }
  }, [user]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (accounts.length === 0) return;

      try {
        setTransactionsLoading(true);
        // Get the first account's ID to fetch transactions
        const accountId = accounts[0].account_id;
        const res = await fetch(
          `http://localhost:3000/api/transactions/account/${accountId}`
        );
        const data = await res.json();
        console.log("📦 Transactions Data:", data);
        setTransactions(data);
        processWeeklyData(data);
        setTransactionsLoading(false);
      } catch (error) {
        console.error("🚨 Failed to fetch transactions:", error);
        setTransactionsLoading(false);
      }
    };

    if (accounts.length > 0) {
      fetchTransactions();
    }
  }, [accounts]);

  const processWeeklyData = (transactionsData) => {
    // Get start and end of current week
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 is Sunday, 6 is Saturday
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // Filter transactions for current week
    const weekTransactions = transactionsData.filter((tx) => {
      const txDate = new Date(tx.transaction_date);
      return txDate >= startOfWeek && txDate <= endOfWeek;
    });

    // Group by day of week and transaction type
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const grouped = _.groupBy(weekTransactions, (tx) => {
      const txDate = new Date(tx.transaction_date);
      return days[txDate.getDay()];
    });

    // Create data for chart
    const chartData = days.map((day) => {
      const dayTransactions = grouped[day] || [];

      // Calculate deposits and withdrawals
      const deposits = dayTransactions
        .filter((tx) => tx.transaction_type === "Deposit")
        .reduce((sum, tx) => sum + tx.amount, 0);

      const withdrawals = dayTransactions
        .filter((tx) => tx.transaction_type === "Withdrawal")
        .reduce((sum, tx) => sum + tx.amount, 0);

      return {
        name: day,
        deposit: deposits,
        withdraw: withdrawals,
      };
    });

    setWeeklyData(chartData);
  };

  // Process recent transactions from the API data
  const getRecentTransactions = () => {
    if (!transactions || transactions.length === 0) return [];

    // Sort transactions by date (newest first)
    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(b.transaction_date) - new Date(a.transaction_date)
    );

    // Get the 5 most recent transactions
    return sortedTransactions.slice(0, 5).map((tx) => {
      // Determine icon based on transaction type
      let icon;
      let bgColorClass = "bg-blue-100";
      let iconColorClass = "text-blue-500";

      if (tx.transaction_type === "Deposit") {
        bgColorClass = "bg-green-100";
        iconColorClass = "text-green-500";
        icon = (
          <div
            className={`w-10 h-10 ${bgColorClass} rounded-full flex items-center justify-center`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 ${iconColorClass}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
      } else {
        // Withdrawal
        bgColorClass = "bg-yellow-100";
        iconColorClass = "text-yellow-500";
        icon = (
          <div
            className={`w-10 h-10 ${bgColorClass} rounded-full flex items-center justify-center`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 ${iconColorClass}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
        );
      }

      // Format date
      const txDate = new Date(tx.transaction_date);
      const formattedDate = txDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      return {
        id: tx.transaction_id,
        type: tx.transaction_type.toLowerCase(),
        title: `${tx.transaction_type} - ${tx.transaction_id}`,
        date: formattedDate,
        amount: tx.transaction_type === "Deposit" ? tx.amount : -tx.amount,
        status: tx.status,
        icon: icon,
      };
    });
  };

  const recentTransactions = getRecentTransactions();

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded-md">
          <p className="text-sm font-medium">{payload[0].payload.name}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm">
              <span className="font-medium">{entry.name}: </span>
              <span
                className={
                  entry.name === "deposit" ? "text-green-500" : "text-blue-500"
                }
              >
                {entry.value.toLocaleString()}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto mt-[-10px]">
        {/* Account Summary Section */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Account Summary</h2>
          <a
            href="#"
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            See All
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Balance and Account Info */}
          <div className="bg-white rounded-xl shadow p-6 flex-1">
            <div className="flex items-center justify-between mb-6">
              {/* <h2 className="text-xl font-bold text-gray-800">Account Details</h2> */}
              <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                Active
              </span>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-pulse flex space-x-4">
                  <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : accounts.length > 0 ? (
              <div className="space-y-4">
                {accounts.map((acc) => (
                  <div
                    key={acc.account_id}
                    className="py-6 px-10 border-b-4 border-blue-500 bg-white rounded-md hover:bg-blue-50 transition-all"
                  >
                    <ul className="space-y-4 text-[17px] text-gray-800">
                      <li className="flex justify-between">
                        <span className="text-gray-500">Account Type:</span>
                        <span className="font-semibold flex items-center">
                          {acc.account_type}
                          {acc.account_type === "Savings" && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 ml-1 text-blue-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-500">Account Number:</span>
                        <span className="font-semibold">
                          {acc.account_number}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-500">
                          Available Balance:
                        </span>
                        <span className="font-bold">
                          {typeof acc.balance === "number"
                            ? new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: acc.currency,
                              }).format(acc.balance)
                            : `${acc.balance} ${acc.currency}`}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-500">Created On:</span>
                        <span className="font-semibold">
                          {new Date(acc.createdAt).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </li>
                    </ul>

                    <div className="flex justify-end mt-3">
                      <Link
                        to="/transaction"
                        className="text-blue-600 hover:text-blue-800 text-base font-medium inline-flex items-center"
                      >
                        View transactions
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-gray-300 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                <p className="text-gray-500 mb-4">No accounts found.</p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Add New Account
                </button>
              </div>
            )}
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-sm p-6 lg:w-2/5">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Recent Transaction
            </h3>
            {transactionsLoading ? (
              <div className="flex justify-center items-center h-48">
                <p className="text-gray-400">Loading transactions...</p>
              </div>
            ) : recentTransactions.length > 0 ? (
              <div className="space-y-4">
                {recentTransactions.slice(0,3).map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      {transaction.icon}
                      <div className="ml-3">
                        <p className="font-medium text-gray-800">
                          {transaction.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {transaction.date}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            transaction.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : transaction.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`font-medium ${
                        transaction.amount > 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {transaction.amount > 0
                        ? `+${Math.abs(transaction.amount).toLocaleString()}`
                        : `-${Math.abs(transaction.amount).toLocaleString()}`}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center h-48">
                <p className="text-gray-400">No recent transactions found.</p>
              </div>
            )}
          </div>
        </div>

        <Card cards={accounts} />

        {/* Weekly Activity Section */}
        {/* <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Weekly Activity</h2>
          <div className="bg-white rounded-xl shadow-sm p-6">
            {transactionsLoading ? (
              <div className="flex justify-center items-center h-80">
                <p className="text-gray-400">Loading transaction data...</p>
              </div>
            ) : weeklyData.length > 0 ? (
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
            ) : (
              <div className="flex justify-center items-center h-80">
                <p className="text-gray-400">No transaction data available for this week.</p>
              </div>
            )}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default UDashboard;
