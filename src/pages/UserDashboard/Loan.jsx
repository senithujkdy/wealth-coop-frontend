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
  ArrowRight,
  ArrowLeft,
  FileText,
  MapPin,
  Building,
  Wallet,
  Eye,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useAccount } from "../../context/AccountContext";
import ActiveLoanTable from "./ActiveLoansTable";
import LoanCalculator from "./LoanCalculator";
import ImportantNotice from "../../components/ImportantNotice/ImportantNotice";
import SubmittedLoanTable from "./SubmittedLoanTable";

const Loan = () => {
  const [showRepayModal, setShowRepayModal] = useState(false);
  const [repayLoan, setRepayLoan] = useState(null);
  const [repayAmount, setRepayAmount] = useState("");
  const [repayStatus, setRepayStatus] = useState({ type: "", message: "" });
  const [activeTab, setActiveTab] = useState("active"); // 'apply' or 'calculate'
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRepay = (loan) => {
    setRepayLoan(loan);
    setRepayAmount("");
    setRepayStatus({ type: "", message: "" });
    setShowRepayModal(true);
  };

  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const [stepErrors, setStepErrors] = useState({});

  // Form state for loan application (enhanced with new fields)
  const [loanForm, setLoanForm] = useState({
    // Step 1: Personal Details
    full_name: "",
    nic: "",
    date_of_birth: "",
    address: "",

    // Step 2: Loan Details
    loan_amount: "",
    interest_rate: "",
    credit_score: "",
    income: "",
    loan_type: "",

    // Step 3: Financial Details
    sector: "",
    employment_type: "",
    account_balance: "",
    gross_salary: "",
    net_salary: "",
    other_income: "",
    deductions: "",
  });

  // State for form submission
  const { user } = useAuth();
  const { accounts } = useAccount();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const [notification, setNotification] = useState({
    type: "",
    message: "",
    show: false,
  });

  const account_id = accounts && accounts[0]?.account_id;
  const user_id = accounts && accounts[0]?.user_id;

  // State for active loans fetched from API
  const [activeLoans, setActiveLoans] = useState([]);
  const [loadingLoans, setLoadingLoans] = useState(true);
  const [errorLoans, setErrorLoans] = useState(null);

  // Prefill form data from context
  useEffect(() => {
    if (user) {
      setLoanForm((prev) => ({
        ...prev,
        full_name: user.full_name || user.name || "",
      }));
    }

    if (accounts && accounts[0]) {
      setLoanForm((prev) => ({
        ...prev,
        account_balance: accounts[0].balance || "",
      }));
    }
  }, [user, accounts]);

  // Dropdown options
  const sectorOptions = [
    { value: "Government", label: "Government" },
    { value: "Semi-Government", label: "Semi-Government" },
    { value: "Private", label: "Private" },
  ];

  const employmentOptions = [
    { value: "Confirmed", label: "Confirmed" },
    { value: "Contract", label: "Contract" },
    { value: "Other", label: "Other" },
  ];

  // Step configuration
  const steps = [
    { number: 1, title: "Personal Details", icon: User },
    { number: 2, title: "Loan Details", icon: DollarSign },
    { number: 3, title: "Financial Details", icon: Building },
    { number: 4, title: "Review & Submit", icon: CheckCircle },
  ];

  const sampleSubmittedApplications = [
    {
      _id: "3",
      loan_id: "LN003",
      loan_amount: 75000,
      interest_rate: 9.1,
      credit_score: 720,
      income: 85000,
      status: "submitted",
      prediction_time: new Date(),
      application_date: new Date("2024-12-01"),
    },
    {
      _id: "4",
      loan_id: "LN004",
      loan_amount: 30000,
      interest_rate: 10.5,
      credit_score: 620,
      income: 45000,
      status: "rejected",
      prediction_time: new Date(),
      application_date: new Date("2024-11-28"),
      rejection_reason: "Insufficient credit score",
    },
    {
      _id: "5",
      loan_id: "LN005",
      loan_amount: 100000,
      interest_rate: 8.8,
      credit_score: 780,
      income: 120000,
      status: "submitted",
      prediction_time: new Date(),
      application_date: new Date("2024-12-05"),
    },
  ];
  const submittedApplications = activeLoans.filter(
    (loan) => loan.status === "pending" || loan.status === "rejected"
  );

  // Notification system
  const showNotification = (type, message) => {
    setNotification({ type, message, show: true });
    setTimeout(() => {
      setNotification({ type: "", message: "", show: false });
    }, 5000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoanForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear form error when user starts typing
    if (formError) setFormError("");
    // Clear step errors for this field
    if (stepErrors[name]) {
      setStepErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Validation for each step
  const validateStep = (step) => {
    const errors = {};

    switch (step) {
      case 1:
        if (!loanForm.full_name.trim())
          errors.full_name = "Full name is required";
        if (!loanForm.nic.trim()) errors.nic = "NIC is required";
        if (!loanForm.date_of_birth)
          errors.date_of_birth = "Date of birth is required";
        if (!loanForm.address.trim()) errors.address = "Address is required";
        break;

      case 2:
        if (!loanForm.loan_amount || Number(loanForm.loan_amount) <= 0) {
          errors.loan_amount = "Valid loan amount is required";
        } else if (Number(loanForm.loan_amount) > 500000) {
          errors.loan_amount = "Loan amount cannot exceed LKR 500,000";
        }
        if (!loanForm.interest_rate || Number(loanForm.interest_rate) <= 0) {
          errors.interest_rate = "Valid interest rate is required";
        }
        // if (
        //   !loanForm.credit_score ||
        //   Number(loanForm.credit_score) < 300 ||
        //   Number(loanForm.credit_score) > 850
        // ) {
        //   errors.credit_score = "Credit score must be between 300-850";
        // }
        if (!loanForm.income || Number(loanForm.income) <= 0) {
          errors.income = "Valid monthly income is required";
        }
        if (!loanForm.loan_type.trim())
          errors.loan_type = "Loan limit is required";
        break;

      case 3:
        if (!loanForm.sector) errors.sector = "Sector is required";
        if (!loanForm.employment_type)
          errors.employment_type = "Employment type is required";
        if (
          !loanForm.account_balance ||
          Number(loanForm.account_balance) < 2000
        ) {
          errors.account_balance = "Account balance must be at least LKR 2,000";
        }
        if (loanForm.loan_amount && loanForm.account_balance) {
          const minBalance = Number(loanForm.loan_amount) / 12;
          if (Number(loanForm.account_balance) < minBalance) {
            errors.account_balance = `Account balance must be at least LKR ${minBalance.toLocaleString()} (1/12 of loan amount)`;
          }
        }
        if (!loanForm.gross_salary)
          errors.gross_salary = "Gross salary is required";
        if (!loanForm.net_salary) errors.net_salary = "Net salary is required";
        break;

      default:
        break;
    }

    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    const isValid = validateStep(currentStep);
    console.log("Step validation result:", isValid, "Errors:", stepErrors);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!user || accounts.length === 0) {
      setFormError(
        "User or account information is missing. Please ensure you're logged in and have an active account."
      );
      return;
    }

    // Validate all steps before submitting
    let allValid = true;
    for (let i = 1; i <= 3; i++) {
      if (!validateStep(i)) {
        allValid = false;
        break;
      }
    }

    if (!allValid) {
      setFormError(
        "Please correct the errors in previous steps before submitting."
      );
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
          loan_type: loanForm.loan_type,
          // Additional fields
          full_name: loanForm.full_name,
          nic: loanForm.nic,
          date_of_birth: loanForm.date_of_birth,
          address: loanForm.address,
          sector: loanForm.sector,
          employment_type: loanForm.employment_type,
          account_balance: Number(loanForm.account_balance),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setFormSubmitted(true);
        showNotification("success", "Loan application submitted successfully!");
        console.log("✅ Loan submitted:", data);
      } else {
        setFormError(
          data.error ||
            "Loan application failed. Please check your information and try again."
        );
      }
    } catch (err) {
      console.error("🚨 Loan submission error:", err);
      setFormError(
        "Network error occurred. Please check your connection and try again."
      );
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
      title: "Loan Details",
      amount: "after click this redirects to another page",
      icon: <Wrench className="text-teal-500" size={24} />,
      bgColor: "bg-teal-100",
    },
  ];

  // Fetch active loans when account_id is available
  useEffect(() => {
    if (!account_id) return;
    setLoadingLoans(true);
    setErrorLoans(null);

    fetch(`http://localhost:3000/api/loans/all/${account_id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch loans");
        return res.json();
      })
      .then((data) => {
        console.log("Fetched loans with remarks:", data); // ✅ Confirm here
        setActiveLoans(data);
        setLoadingLoans(false);
      })
      .catch((err) => {
        setErrorLoans(err.message);
        setLoadingLoans(false);
      });
  }, [account_id, formSubmitted]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={loanForm.full_name}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    stepErrors.full_name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your full name"
                />
                {stepErrors.full_name && (
                  <p className="text-red-500 text-sm mt-1">
                    {stepErrors.full_name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  NIC / National ID
                </label>
                <input
                  type="text"
                  name="nic"
                  value={loanForm.nic}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    stepErrors.nic ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your NIC"
                />
                {stepErrors.nic && (
                  <p className="text-red-500 text-sm mt-1">{stepErrors.nic}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={loanForm.date_of_birth}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  stepErrors.date_of_birth
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {stepErrors.date_of_birth && (
                <p className="text-red-500 text-sm mt-1">
                  {stepErrors.date_of_birth}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Address
              </label>
              <textarea
                name="address"
                value={loanForm.address}
                onChange={handleChange}
                rows="3"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  stepErrors.address ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your full address"
              />
              {stepErrors.address && (
                <p className="text-red-500 text-sm mt-1">
                  {stepErrors.address}
                </p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Loan Amount (LKR)
                </label>
                <input
                  type="number"
                  name="loan_amount"
                  value={loanForm.loan_amount}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    stepErrors.loan_amount
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Max: 500,000"
                />
                {stepErrors.loan_amount && (
                  <p className="text-red-500 text-sm mt-1">
                    {stepErrors.loan_amount}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="interest_rate"
                  value={loanForm.interest_rate}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed ${
                    stepErrors.interest_rate
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Ex: 12.5"
                />
                {stepErrors.interest_rate && (
                  <p className="text-red-500 text-sm mt-1">
                    {stepErrors.interest_rate}
                  </p>
                )}
              </div>
            </div>

            {/* <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Credit Score
                </label>
                <input
                  type="number"
                  name="credit_score"
                  value={loanForm.credit_score}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    stepErrors.credit_score
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="300-850"
                />
                {stepErrors.credit_score && (
                  <p className="text-red-500 text-sm mt-1">
                    {stepErrors.credit_score}
                  </p>
                )}
              </div> */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Monthly Income (LKR)
                </label>
                <input
                  type="number"
                  name="income"
                  value={loanForm.income}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    stepErrors.income ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Ex: 100,000"
                />
                {stepErrors.income && (
                  <p className="text-red-500 text-sm mt-1">
                    {stepErrors.income}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Loan Type
                </label>
                <select
                  name="loan_type"
                  value={loanForm.loan_type}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    stepErrors.loan_type ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">-- Select Loan Limit --</option>
                  <option value="CF">CF</option>
                  <option value="NCF">NCF</option>
                </select>
                {stepErrors.loan_type && (
                  <p className="text-red-500 text-sm mt-1">
                    {stepErrors.loan_type}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Sector
                </label>
                <select
                  name="sector"
                  value={loanForm.sector}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    stepErrors.sector ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select sector</option>
                  {sectorOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {stepErrors.sector && (
                  <p className="text-red-500 text-sm mt-1">
                    {stepErrors.sector}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Employment Type
                </label>
                <select
                  name="employment_type"
                  value={loanForm.employment_type}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    stepErrors.employment_type
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Select employment type</option>
                  {employmentOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {stepErrors.employment_type && (
                  <p className="text-red-500 text-sm mt-1">
                    {stepErrors.employment_type}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Account Balance (LKR)
              </label>
              <input
                type="number"
                name="account_balance"
                value={loanForm.account_balance}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  stepErrors.account_balance
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Current account balance"
              />
              {stepErrors.account_balance && (
                <p className="text-red-500 text-sm mt-1">
                  {stepErrors.account_balance}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Gross Salary:{" "}
                  <span className="block text-sm font-normal text-gray-500">
                    (in Rupees)
                  </span>
                </label>
                <input
                  type="number"
                  name="gross_salary"
                  value={loanForm.gross_salary}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    stepErrors.gross_salary
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter the gross salary"
                />
                {stepErrors.gross_salary && (
                  <p className="text-red-500 text-sm mt-1">
                    {stepErrors.gross_salary}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Net Salary:{" "}
                  <span className="block text-sm font-normal text-gray-500">
                    (in Rupees)
                  </span>
                </label>
                <input
                  type="number"
                  name="net_salary"
                  value={loanForm.net_salary}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    stepErrors.net_salary ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter the net salary"
                />
                {stepErrors.net_salary && (
                  <p className="text-red-500 text-sm mt-1">
                    {stepErrors.net_salary}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Other Income:{" "}
                  <span className="block text-sm font-normal text-gray-500">
                    (in Rupees)
                  </span>
                </label>
                <input
                  type="number"
                  name="other_income"
                  value={loanForm.other_income}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    stepErrors.other_income
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter other income"
                />
                {stepErrors.other_income && (
                  <p className="text-red-500 text-sm mt-1">
                    {stepErrors.other_income}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Deductions:{" "}
                  <span className="block text-sm font-normal text-gray-500">
                    (in Rupees)
                  </span>
                </label>
                <input
                  type="number"
                  name="deductions"
                  value={loanForm.deductions}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    stepErrors.deductions ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter deduction"
                />
                {stepErrors.deductions && (
                  <p className="text-red-500 text-sm mt-1">
                    {stepErrors.deductions}
                  </p>
                )}
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <div className="text-blue-800">
                  <p className="font-medium">Account Balance Requirements:</p>
                  <p className="text-sm mt-1">
                    Account balance must be at least{" "}
                    <strong>1/12 of requested loan amount</strong> and{" "}
                    <strong>≥ LKR 2,000</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">
                Review Your Application
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    Personal Details
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {loanForm.full_name}
                    </p>
                    <p>
                      <span className="font-medium">NIC:</span> {loanForm.nic}
                    </p>
                    <p>
                      <span className="font-medium">Date of Birth:</span>{" "}
                      {loanForm.date_of_birth}
                    </p>
                    <p>
                      <span className="font-medium">Address:</span>{" "}
                      {loanForm.address}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    Loan Details
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Amount:</span> LKR{" "}
                      {Number(loanForm.loan_amount).toLocaleString()}
                    </p>
                    <p>
                      <span className="font-medium">Interest Rate:</span>{" "}
                      {loanForm.interest_rate}%
                    </p>
                    <p>
                      <span className="font-medium">Credit Score:</span>{" "}
                      {loanForm.credit_score}
                    </p>
                    <p>
                      <span className="font-medium">Monthly Income:</span> LKR{" "}
                      {Number(loanForm.income).toLocaleString()}
                    </p>
                    <p>
                      <span className="font-medium">Loan Limit:</span>{" "}
                      {loanForm.loan_type}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    Financial Details
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Sector:</span>{" "}
                      {loanForm.sector}
                    </p>
                    <p>
                      <span className="font-medium">Employment:</span>{" "}
                      {loanForm.employment_type}
                    </p>
                    <p>
                      <span className="font-medium">Account Balance:</span> LKR{" "}
                      {Number(loanForm.account_balance).toLocaleString()}
                    </p>
                    <p>
                      <span className="font-medium">Gross Salary:</span> LKR{" "}
                      {Number(loanForm.gross_salary).toLocaleString()}
                    </p>
                    <p>
                      <span className="font-medium">Net Salary:</span> LKR{" "}
                      {Number(loanForm.net_salary).toLocaleString()}
                    </p>
                    {loanForm.other_income ? (
                      <p>
                        <span className="font-medium">Other Income:</span> LKR{" "}
                        {Number(loanForm.other_income).toLocaleString()}
                      </p>
                    ) : null}
                    {loanForm.deductions ? (
                      <p>
                        <span className="font-medium">Deductions:</span> LKR{" "}
                        {Number(loanForm.deductions).toLocaleString()}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                <div className="text-yellow-800">
                  <p className="font-medium">Before submitting:</p>
                  <p className="text-sm mt-1">
                    Please review all information carefully. Once submitted,
                    your application will be processed by our team.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Notification Toast */}
        {notification.show && (
          <div
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 ${
              notification.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {notification.type === "success" ? (
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

        {/* Important Notice */}
        <ImportantNotice />

        <LoanCalculator />

        {/* Multi-Step Loan Application Form */}
        <div className="bg-white rounded-xl shadow-sm mb-8 mt-8 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">
              Apply for a Loan
            </h2>
            <p className="text-gray-500 mt-1">
              Complete the following steps to apply for a new loan
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
                  setCurrentStep(1);
                  setLoanForm({
                    full_name: user?.full_name || user?.name || "",
                    nic: "",
                    date_of_birth: "",
                    address: "",
                    loan_amount: "",
                    interest_rate: "",
                    credit_score: "",
                    income: "",
                    loan_type: "",
                    sector: "",
                    employment_type: "",
                    account_balance: accounts?.[0]?.balance || "",
                  });
                  setStepErrors({});
                }}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Apply for Another Loan
              </button>
            </div>
          ) : (
            <div className="p-6">
              {/* Progress Indicator */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = currentStep === step.number;
                    const isCompleted = currentStep > step.number;

                    return (
                      <div key={step.number} className="flex items-center">
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                            isActive
                              ? "bg-blue-500 border-blue-500 text-white"
                              : isCompleted
                              ? "bg-green-500 border-green-500 text-white"
                              : "bg-gray-100 border-gray-300 text-gray-400"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle size={20} />
                          ) : (
                            <Icon size={20} />
                          )}
                        </div>
                        <div className="ml-3">
                          <div
                            className={`text-sm font-medium ${
                              isActive
                                ? "text-blue-600"
                                : isCompleted
                                ? "text-green-600"
                                : "text-gray-400"
                            }`}
                          >
                            Step {step.number}
                          </div>
                          <div
                            className={`text-xs ${
                              isActive
                                ? "text-blue-600"
                                : isCompleted
                                ? "text-green-600"
                                : "text-gray-400"
                            }`}
                          >
                            {step.title}
                          </div>
                        </div>

                        {index < steps.length - 1 && (
                          <div
                            className={`w-16 h-0.5 ml-4 ${
                              isCompleted ? "bg-green-500" : "bg-gray-200"
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        ((currentStep - 1) / (steps.length - 1)) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>

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

              {/* Step Content */}
              <div className="mb-8">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {steps[currentStep - 1].title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {currentStep === 1 &&
                      "Please provide your personal information"}
                    {currentStep === 2 &&
                      "Enter your loan requirements and financial details"}
                    {currentStep === 3 &&
                      "Complete your employment and financial information"}
                    {currentStep === 4 && "Review and confirm your application"}
                  </p>
                </div>

                <div className="min-h-[400px]">{renderStepContent()}</div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                    currentStep === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  <ArrowLeft size={20} className="mr-2" />
                  Previous
                </button>

                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>
                    Step {currentStep} of {steps.length}
                  </span>
                </div>

                {currentStep < 4 ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Next
                    <ArrowRight size={20} className="ml-2" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`flex items-center px-8 py-3 rounded-lg font-medium transition-colors ${
                      isSubmitting
                        ? "bg-blue-300 text-white cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={20} className="mr-2" />
                        Submit Application
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("active")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "active"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Active Loans
              </button>
              <button
                onClick={() => setActiveTab("submitted")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "submitted"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Submitted Applications
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "active" && (
          <ActiveLoanTable activeLoans={activeLoans} onRepay={handleRepay} />
        )}

        {activeTab === "submitted" && (
          <SubmittedLoanTable submittedApplications={submittedApplications} />
        )}

        {/* Repay Modal */}
        {showRepayModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
              <h2 className="text-lg font-semibold mb-2">Repay Loan</h2>
              <p className="text-gray-600 mb-4">
                Enter amount to repay for{" "}
                <strong>Loan ID: {repayLoan?.loan_id}</strong>
              </p>

              {/* Repay Status Display */}
              {repayStatus.message && (
                <div
                  className={`rounded-lg p-3 mb-4 ${
                    repayStatus.type === "success"
                      ? "bg-green-50 text-green-800"
                      : "bg-red-50 text-red-800"
                  }`}
                >
                  <div className="flex items-center">
                    {repayStatus.type === "success" ? (
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
                  setRepayStatus({ type: "", message: "" });
                }}
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShowRepayModal(false);
                    setRepayStatus({ type: "", message: "" });
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (
                      !repayAmount ||
                      isNaN(repayAmount) ||
                      repayAmount <= 0
                    ) {
                      setRepayStatus({
                        type: "error",
                        message: "Please enter a valid amount.",
                      });
                      return;
                    }

                    setRepayStatus({ type: "", message: "" });
                    try {
                      const res = await fetch(
                        "http://localhost:3000/api/repayments",
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            user_id,
                            loan_id: repayLoan.loan_id,
                            account_id: repayLoan.account_id,
                            amount_paid: parseFloat(repayAmount),
                          }),
                        }
                      );
                      const data = await res.json();
                      if (res.ok) {
                        setRepayStatus({
                          type: "success",
                          message: "Repayment processed successfully!",
                        });
                        showNotification(
                          "success",
                          `Repayment of ${repayAmount} processed successfully`
                        );
                        setTimeout(() => {
                          setShowRepayModal(false);
                          setRepayStatus({ type: "", message: "" });
                          // Refresh loans data
                          window.location.reload();
                        }, 2000);
                      } else {
                        setRepayStatus({
                          type: "error",
                          message:
                            data.error || "Repayment failed. Please try again.",
                        });
                      }
                    } catch (err) {
                      console.error(err);
                      setRepayStatus({
                        type: "error",
                        message:
                          "Network error occurred. Please check your connection and try again.",
                      });
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
