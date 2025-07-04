import React, { useEffect, useState } from "react";
import {
  User,
  Briefcase,
  BarChart2,
  Wrench,
  DollarSign,
  Calendar,
  Percent,
  CreditCard,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useAccount } from "../../context/AccountContext";
import ActiveLoanTable from "./ActiveLoansTable";

const Loan = () => {
  
const [showRepayModal, setShowRepayModal] = useState(false);
const [repayLoan, setRepayLoan] = useState(null);
const [repayAmount, setRepayAmount] = useState("");
const [repayStatus, setRepayStatus] = useState({ type: '', message: '' });

const handleRepay = (loan) => {
  setRepayLoan(loan);
  setRepayAmount("");
  setRepayStatus({ type: '', message: '' });
  setShowRepayModal(true);
};

  
  // Form state for loan application
  const [loanForm, setLoanForm] = useState({
    loan_amount: "",
    interest_rate: "",
    credit_score: "",
    income: "",
    loan_limit: "",
  });

  // State for form submission
  const { user } = useAuth();
  const { accounts } = useAccount();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const [notification, setNotification] = useState({ type: '', message: '', show: false });

  const account_id = accounts && accounts[0]?.account_id;
  const user_id = accounts && accounts[0]?.user_id;

  // State for active loans fetched from API
  const [activeLoans, setActiveLoans] = useState([]);
  const [loadingLoans, setLoadingLoans] = useState(true);
  const [errorLoans, setErrorLoans] = useState(null);

  // Notification system
  const showNotification = (type, message) => {
    setNotification({ type, message, show: true });
    setTimeout(() => {
      setNotification({ type: '', message: '', show: false });
    }, 5000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoanForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear form error when user starts typing
    if (formError) setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!user || accounts.length === 0) {
      setFormError("User or account information is missing. Please ensure you're logged in and have an active account.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:3000/api/loans/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.user_id,
          account_id: accounts[0].account_id,
          loan_amount: Number(loanForm.loan_amount),
          interest_rate: Number(loanForm.interest_rate),
          credit_score: Number(loanForm.credit_score),
          income: Number(loanForm.income),
          loan_limit: loanForm.loan_limit,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setFormSubmitted(true);
        showNotification('success', 'Loan application submitted successfully!');
        console.log("✅ Loan submitted:", data);
      } else {
        setFormError(data.error || "Loan application failed. Please check your information and try again.");
      }
    } catch (err) {
      console.error("🚨 Loan submission error:", err);
      setFormError("Network error occurred. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loan category data
  const loanCategories = [
    {
      title: "Personal Loans",
      amount: "Rs 50,000",
      icon: <User className="text-blue-500" size={24} />,
      bgColor: "bg-blue-100",
    },
    {
      title: "Corporate Loans",
      amount: "Rs 100,000",
      icon: <Briefcase className="text-yellow-500" size={24} />,
      bgColor: "bg-yellow-100",
    },
    {
      title: "Business Loans",
      amount: "Rs 500,000",
      icon: <BarChart2 className="text-pink-500" size={24} />,
      bgColor: "bg-pink-100",
    },
    {
      title: "Custom Loans",
      amount: "Choose Money",
      icon: <Wrench className="text-teal-500" size={24} />,
      bgColor: "bg-teal-100",
    },
  ];

  // Calculate totals
  const totalAmount = "$1,250,000";
  const totalLeftToRepay = "$750,000";
  const totalInstallment = "$50,000 / month";

  // Fetch active loans when account_id is available
  useEffect(() => {
    if (!account_id) return;
    setLoadingLoans(true);
    setErrorLoans(null);

    fetch(`http://localhost:3000/api/approvals/approved/search?account_id=${account_id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch loans");
        return res.json();
      })
      .then((data) => {
        setActiveLoans(data);
        setLoadingLoans(false);
      })
      .catch((err) => {
        setErrorLoans(err.message);
        setLoadingLoans(false);
      });
  }, [account_id, formSubmitted]); // Refresh loans after successful submission

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Notification Toast */}
        {notification.show && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 ${
            notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification({ ...notification, show: false })}
              className="ml-2 hover:bg-white hover:bg-opacity-20 rounded-full p-1"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Loan Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {loanCategories.map((category, index) => (
            <div key={index} className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-center mb-2">
                <div
                  className={`w-12 h-12 flex items-center justify-center ${category.bgColor} rounded-full mr-3`}
                >
                  {category.icon}
                </div>
                <span className="text-gray-500">{category.title}</span>
              </div>
              <div className="text-2xl font-bold">{category.amount}</div>
            </div>
          ))}
        </div>

        {/* Loan Application Form */}
        <div className="bg-white rounded-xl shadow-sm mb-8 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">
              Apply for a Loan
            </h2>
            <p className="text-gray-500 mt-1">
              Fill out the form below to apply for a new loan
            </p>
          </div>

          {formSubmitted ? (
            <div className="p-6">
              <div className="bg-green-50 text-green-800 rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">
                    Loan application submitted successfully!
                  </span>
                </div>
                <p className="mt-2">
                  Our team will review your application and contact you soon.
                </p>
              </div>
              <button
                onClick={() => {
                  setFormSubmitted(false);
                  setLoanForm({
                    loan_amount: "",
                    interest_rate: "",
                    credit_score: "",
                    income: "",
                    loan_limit: "",
                  });
                }}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Apply for Another Loan
              </button>
            </div>
          ) : (
            <div className="p-6">
              {/* Form Error Display */}
              {formError && (
                <div className="bg-red-50 text-red-800 rounded-lg p-4 mb-4">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Application Error</span>
                      <p className="mt-1">{formError}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Loan Amount</label>
                  <input
                    type="number"
                    name="loan_amount"
                    value={loanForm.loan_amount}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: 500000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">Interest Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="interest_rate"
                    value={loanForm.interest_rate}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: 12.5"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">Credit Score</label>
                  <input
                    type="number"
                    name="credit_score"
                    value={loanForm.credit_score}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: 720"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">Monthly Income</label>
                  <input
                    type="number"
                    name="income"
                    value={loanForm.income}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: 100000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Loan Limit (e.g., CF)
                  </label>
                  <input
                    type="text"
                    name="loan_limit"
                    value={loanForm.loan_limit}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: CF"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full p-3 rounded-lg text-white font-medium transition-colors ${
                    isSubmitting 
                      ? "bg-blue-300 cursor-not-allowed" 
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Active Loans Table */}
        <ActiveLoanTable
          activeLoans={activeLoans}
          onRepay={handleRepay} 
        />

        {/* Repay Modal */}
        {showRepayModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
              <h2 className="text-lg font-semibold mb-2">Repay Loan</h2>
              <p className="text-gray-600 mb-4">
                Enter amount to repay for <strong>Loan ID: {repayLoan?.loan_id}</strong>
              </p>
              
              {/* Repay Status Display */}
              {repayStatus.message && (
                <div className={`rounded-lg p-3 mb-4 ${
                  repayStatus.type === 'success' 
                    ? 'bg-green-50 text-green-800' 
                    : 'bg-red-50 text-red-800'
                }`}>
                  <div className="flex items-center">
                    {repayStatus.type === 'success' ? (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    ) : (
                      <AlertCircle className="w-4 h-4 mr-2" />
                    )}
                    <span className="text-sm">{repayStatus.message}</span>
                  </div>
                </div>
              )}

              <input
                type="number"
                className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter amount"
                value={repayAmount}
                onChange={(e) => {
                  setRepayAmount(e.target.value);
                  setRepayStatus({ type: '', message: '' });
                }}
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShowRepayModal(false);
                    setRepayStatus({ type: '', message: '' });
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (!repayAmount || isNaN(repayAmount) || repayAmount <= 0) {
                      setRepayStatus({ type: 'error', message: 'Please enter a valid amount.' });
                      return;
                    }
                    
                    setRepayStatus({ type: '', message: '' });
                    try {
                      const res = await fetch("http://localhost:3000/api/repayments", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          user_id,
                          loan_id: repayLoan.loan_id,
                          account_id: repayLoan.account_id,
                          amount_paid: parseFloat(repayAmount),
                        }),
                      });
                      const data = await res.json();
                      if (res.ok) {
                        setRepayStatus({ type: 'success', message: 'Repayment processed successfully!' });
                        showNotification('success', `Repayment of $${repayAmount} processed successfully`);
                        setTimeout(() => {
                          setShowRepayModal(false);
                          setRepayStatus({ type: '', message: '' });
                          // Refresh loans data
                          window.location.reload();
                        }, 2000);
                      } else {
                        setRepayStatus({ type: 'error', message: data.error || 'Repayment failed. Please try again.' });
                      }
                    } catch (err) {
                      console.error(err);
                      setRepayStatus({ type: 'error', message: 'Network error occurred. Please check your connection and try again.' });
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Confirm Repayment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Loan;