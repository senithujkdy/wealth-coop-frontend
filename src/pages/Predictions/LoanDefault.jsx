import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { checkingAccounts } from "../AdminDashboard/Services/checkingAccountData";

function InputDetails() {
  const [userID, setUserID] = useState("");
  const [formData, setFormData] = useState({
    loan_limit: "",
    Gender: "",
    loan_type: "",
    business_or_commercial: "",
    credit_type: "",
    loan_amount: "",
    rate_of_interest: "",
    Interest_rate_spread: "",
    income: "",
    Credit_Score: "",
    age: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [showInvalidIDModal, setShowInvalidIDModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUserIDChange = (e) => {
    setUserID(e.target.value);
  };

  const handleLookup = () => {
    const account = checkingAccounts.find(account => account.id === userID);
    if (account) {
      const details = account.details;
      setFormData({
        loan_limit: details.loan_limit.includes("Confirming") ? "cf" : "ncf",
        Gender: details.Gender,
        loan_type: details.loan_type.toLowerCase().replace(" ", ""),
        business_or_commercial: details.business_or_commercial === "Personal" ? "nob/c" : "b/c",
        credit_type: details.credit_type,
        loan_amount: details.loan_amount.replace(/[^0-9.]/g, ""), // Remove currency symbols
        rate_of_interest: details.rate_of_interest.replace("%", ""),
        Interest_rate_spread: details.Interest_rate_spread.replace("%", ""),
        income: details.income.replace(/[^0-9.]/g, ""), // Remove currency symbols
        Credit_Score: details.Credit_Score,
        age: details.age
      });
    } else {
      setShowInvalidIDModal(true);
    }
  };

  const resetForm = () => {
    setUserID("");
    setFormData({
      loan_limit: "",
      Gender: "",
      loan_type: "",
      business_or_commercial: "",
      credit_type: "",
      loan_amount: "",
      rate_of_interest: "",
      Interest_rate_spread: "",
      income: "",
      Credit_Score: "",
      age: "",
    });
    setPrediction(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Convert numerical fields to numbers
    const payload = {
      ...formData,
      loan_amount: parseFloat(formData.loan_amount),
      rate_of_interest: parseFloat(formData.rate_of_interest),
      Interest_rate_spread: parseFloat(formData.Interest_rate_spread),
      income: parseFloat(formData.income),
      Credit_Score: parseFloat(formData.Credit_Score),
    };
  
    try {
      const response = await axios.post("http://127.0.0.1:5000/predict-default", payload);
      setPrediction(response.data.prediction === "Approve" ? 0 : 1);
    } catch (error) {
      console.error("Error submitting form:", error);
      setPrediction("Error processing request");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex items-start justify-between gap-x-5 min-h-screen bg-gray-800 py-10"
    >
      {/* Invalid ID Modal */}
      {showInvalidIDModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm">
            <h3 className="text-xl font-bold mb-4">Invalid User ID</h3>
            <p>The User ID you entered was not found. Please try again.</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowInvalidIDModal(false)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Modal */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-lg font-semibold">Processing Prediction...</p>
          </div>
        </div>
      )}

      {/* Left Side Form */}
      <form onSubmit={handleSubmit} className="mx-auto w-[400px]">
        <div className="mb-5">
          <h1 className="text-4xl text-white font-semibold text-center tracking-normal">
            Loan Default Prediction
          </h1>
        </div>

        {/* User ID Field */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-white">
            User ID:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              name="userID"
              value={userID}
              onChange={handleUserIDChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
              placeholder="Enter User ID"
            />
            <button
              type="button"
              onClick={handleLookup}
              className="bg-gray-400 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg"
            >
              Lookup
            </button>
          </div>
          <p className="mt-1 text-[10px] text-gray-200">Enter a valid User ID to auto-fill form</p>
        </div>

        {/* Loan Limit */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-white">
            Loan Limit:
          </label>
          <select
            name="loan_limit"
            value={formData.loan_limit}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          >
            <option value="">Select Loan Limit</option>
            <option value="cf">CF (Confirming Loan)</option>
            <option value="ncf">NCF (Non-Confirming Loan)</option>
          </select>
          <p className="mt-1 text-[10px] text-gray-200">CF: Conforming Loan, NCF: Non-Conforming Loan</p>
        </div>

        {/* Gender */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-white">
            Gender:
          </label>
          <select
            name="Gender"
            value={formData.Gender}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Joint">Joint</option>
            <option value="Sex Not Available">Sex Not Available</option>
          </select>
          <p className="mt-1 text-[10px] text-gray-200">Select the applicant's gender.</p>
        </div>

        {/* Loan Type */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-white">
            Loan Type:
          </label>
          <select
            name="loan_type"
            value={formData.loan_type}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          >
            <option value="">Select Loan Type</option>
            <option value="type1">Type 1</option>
            <option value="type2">Type 2</option>
          </select>
          <p className="mt-1 text-[10px] text-gray-200">Different loan categories.</p>
        </div>

        {/* Business or Commercial */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-white">
            Business or Commercial:
          </label>
          <select
            name="business_or_commercial"
            value={formData.business_or_commercial}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          >
            <option value="">Select</option>
            <option value="b/c">Yes</option>
            <option value="nob/c">No</option>
          </select>
          <p className="mt-1 text-[10px] text-gray-200">Is the loan for a business or commercial purpose?</p>
        </div>

        {/* Credit Type */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-white">
            Credit Type:
          </label>
          <select
            name="credit_type"
            value={formData.credit_type}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          >
            <option value="">Select</option>
            <option value="CIB">CIB</option>
            <option value="CRIF">CRIF</option>
            <option value="EXP">EXP</option>
            <option value="EQUI">EQUI</option>
          </select>
          <p className="mt-1 text-[10px] text-gray-200">CIB: Credit Information Bureau, CRIF: CRIF Credit Solutions, EXP: Experian, EQUI: Equifax.</p>
        </div>

        {/* Form Buttons */}
        <div className="flex justify-between mt-9">
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-500 hover:bg-gray-700 text-white font-medium py-2 px-8 rounded-full"
          >
            Reset
          </button>
          <button
            type="submit"
            className="bg-blue-400 hover:bg-blue-700 text-white font-medium py-2 px-8 rounded-full"
          >
            Submit
          </button>
        </div>
      </form>

      {/* Right Side Form */}
      <div className="mx-auto w-[400px] mt-14">
        {/* Loan Amount */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-white">
            Loan Amount:
          </label>
          <input
            type="number"
            step="0.01"
            name="loan_amount"
            value={formData.loan_amount}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          />
          <p className="mt-1 text-[10px] text-gray-200">Enter the total loan amount in USD.</p>
        </div>

        {/* Interest Rate */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-white">
            Rate of Interest:
          </label>
          <input
            type="number"
            step="0.01"
            name="rate_of_interest"
            value={formData.rate_of_interest}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          />
          <p className="mt-1 text-[10px] text-gray-200">Enter the interest rate percentage.</p>
        </div>

        {/* Rate Spread */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-white">
            Interest Rate Spread:
          </label>
          <input
            type="number"
            step="0.01"
            name="Interest_rate_spread"
            value={formData.Interest_rate_spread}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          />
          <p className="mt-1 text-[10px] text-gray-200">Difference between loan rate and benchmark rate.</p>
        </div>

        {/* Income */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-white">
            Income:
          </label>
          <input
            type="number"
            step="0.01"
            name="income"
            value={formData.income}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          />
          <p className="mt-1 text-[10px] text-gray-200">Enter the borrower's annual income in USD.</p>
        </div>

        {/* Credit Score */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-white">
            Credit Score:
          </label>
          <input
            type="number"
            name="Credit_Score"
            value={formData.Credit_Score}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            required
          />
          <p className="mt-1 text-[10px] text-gray-200">A numerical representation of creditworthiness.</p>
        </div>

        {/* Age */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-white">
            Age:
          </label>
          <select
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          >
            <option value="">Select Age</option>
            <option value="25-34">25-34</option>
            <option value="35-44">35-44</option>
            <option value="45-54">45-54</option>
            <option value="55-64">55-64</option>
          </select>
          <p className="mt-1 text-[10px] text-gray-200">Customer Age</p>
        </div>

        {/* Loan Status */}
        <div className="mt-10 p-4 bg-gray-700 rounded-lg">
          <h2 className="text-2xl text-white mb-4">Prediction Results</h2>
          <div className="flex justify-between items-center">
            <span className="text-white text-xl">Loan Status: </span>
            <span className={`text-xl font-bold ${
              prediction === 0 ? "text-green-500" : 
              prediction === 1 ? "text-red-500" : 
              "text-gray-400"
            }`}>
              {prediction === 0 ? "Approved" : 
               prediction === 1 ? "Rejected" : 
               "Awaiting Submission"}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default InputDetails;