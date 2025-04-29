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
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useAccount } from "../../context/AccountContext";
import ActiveLoanTable from "./ActiveLoansTable";

const Loan = () => {
  
  const handleRepay = (loan) => {
    const amount = prompt(`Enter repayment amount for Loan ID ${loan.loan_id}:`);
  
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid number.");
      return;
    }
  
    fetch(`http://localhost:3000/api/repayments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id, // Add this line
        loan_id: loan.loan_id,
        account_id: loan.account_id,
        amount_paid: parseFloat(amount),
      })
    })
      .then(res => res.json())
      .then(data => {
        alert(`Repayment successful: ${data.message}`);
        // Optionally refresh activeLoans here
      })
      .catch(err => {
        console.error(err);
        alert("Repayment failed.");
      });
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


  const account_id = accounts && accounts[0]?.account_id;
  const user_id = accounts && accounts[0]?.user_id;


  // State for active loans fetched from API
  const [activeLoans, setActiveLoans] = useState([]);
  const [loadingLoans, setLoadingLoans] = useState(true);
  const [errorLoans, setErrorLoans] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoanForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || accounts.length === 0) {
      alert("User or account info missing.");
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
        console.log("✅ Loan submitted:", data);
      } else {
        alert(data.error || "Loan application failed");
      }
    } catch (err) {
      console.error("🚨 Loan submission error:", err);
      alert("An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loan category data
  const loanCategories = [
    {
      title: "Personal Loans",
      amount: "$50,000",
      icon: <User className="text-blue-500" size={24} />,
      bgColor: "bg-blue-100",
    },
    {
      title: "Corporate Loans",
      amount: "$100,000",
      icon: <Briefcase className="text-yellow-500" size={24} />,
      bgColor: "bg-yellow-100",
    },
    {
      title: "Business Loans",
      amount: "$500,000",
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

  //   {
  //     id: "01",
  //     amount: "$100,000",
  //     leftToRepay: "$40,500",
  //     duration: "8 Months",
  //     interestRate: "12%",
  //     installment: "$2,000 / month",
  //   },


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
          setActiveLoans(data); // Adjust if your API wraps data in a property
          setLoadingLoans(false);
        })
        .catch((err) => {
          setErrorLoans(err.message);
          setLoadingLoans(false);
        });
    }, [account_id]);

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
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
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span className="font-medium">
                    Loan application submitted successfully!
                  </span>
                </div>
                <p className="mt-2">
                  Our team will review your application and contact you soon.
                </p>
              </div>
              <button
                onClick={() => setFormSubmitted(false)}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Apply for Another Loan
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 mx-6">
              <div>
                <label className="block text-gray-700">Loan Amount</label>
                <input
                  type="number"
                  name="loan_amount"
                  value={loanForm.loan_amount}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded"
                  placeholder="Ex: 500000"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700">Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  name="interest_rate"
                  value={loanForm.interest_rate}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded"
                  placeholder="Ex: 12.5"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700">Credit Score</label>
                <input
                  type="number"
                  name="credit_score"
                  value={loanForm.credit_score}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded"
                  placeholder="Ex: 720"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700">Monthly Income</label>
                <input
                  type="number"
                  name="income"
                  value={loanForm.income}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded"
                  placeholder="Ex: 100000"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700">
                  Loan Limit (e.g., CF)
                </label>
                <input
                  type="text"
                  name="loan_limit"
                  value={loanForm.loan_limit}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded"
                  placeholder="Ex: CF"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full p-3 mb-4 rounded text-white font-medium ${
                  isSubmitting ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          )}
        </div>

        {/* Active Loans Table */}
        <ActiveLoanTable
          activeLoans={activeLoans}
          onRepay={handleRepay} 
        />
      </div>
    </div>
  );
};

export default Loan;
