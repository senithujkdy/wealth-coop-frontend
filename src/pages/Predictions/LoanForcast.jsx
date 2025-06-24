import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { savingsAccounts } from "../AdminDashboard/Services/savingsAccountData"; // Adjust import path as needed

function LoanAmountForecast() {
  const [userID, setUserID] = useState("");
  const [formData, setFormData] = useState({
    customer_age: "",
    customer_income: "",
    home_ownership: "",
    employment_duration: "",
    loan_intent: "",
    loan_grade: "",
    loan_int_rate: "",
    term_years: "",
    historical_default: "",
    cred_hist_length: ""
  });

  const [prediction, setPrediction] = useState(null);
  const [showInvalidIDModal, setShowInvalidIDModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUserIDChange = (e) => {
    setUserID(e.target.value);
  };

  const handleLookup = () => {
    const account = savingsAccounts.find(account => account.id === userID);
    if (account) {
      const details = account.details;
      setFormData({
        customer_age: details.Age,
        customer_income: details["Annual Income (LKR)"].replace(/[^0-9.]/g, ""),
        home_ownership: details["Home Ownership"],
        employment_duration: details["Employment Duration (months)"].replace(/\D/g, ""),
        loan_intent: details["Loan Purpose"].toUpperCase(),
        loan_grade: details["Loan Grade"],
        loan_int_rate: details["Interest Rate (%)"].toString(),
        term_years: details["Loan Term (years)"].replace(/\D/g, ""),
        historical_default: details["Previous Default"] === "Yes" ? "Y" : "N",
        cred_hist_length: details["Credit History (years)"].replace(/\D/g, "")
      });
    } else {
      setShowInvalidIDModal(true);
    }
  };

  const resetForm = () => {
    setUserID("");
    setFormData({
      customer_age: "",
      customer_income: "",
      home_ownership: "",
      employment_duration: "",
      loan_intent: "",
      loan_grade: "",
      loan_int_rate: "",
      term_years: "",
      historical_default: "",
      cred_hist_length: ""
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
      customer_age: parseInt(formData.customer_age) || 0,
      customer_income: parseFloat(formData.customer_income) || 0,
      employment_duration: parseInt(formData.employment_duration) || 0,
      loan_int_rate: parseFloat(formData.loan_int_rate) || 0,
      term_years: parseInt(formData.term_years) || 0,
      cred_hist_length: parseInt(formData.cred_hist_length) || 0
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/forecast-loan-amount", 
        payload
      );
      setPrediction(response.data.predicted_loan_amount);
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
            Loan Amount Forecast
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

        {/* Customer Age */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-white">
            Customer Age:
          </label>
          <input
            type="number"
            name="customer_age"
            value={formData.customer_age}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          />
          <p className="mt-1 text-[10px] text-gray-200">Applicant's age in years</p>
        </div>

        {/* Customer Income */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-white">
            Annual Income (LKR):
          </label>
          <input
            type="number"
            step="0.01"
            name="customer_income"
            value={formData.customer_income}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          />
          <p className="mt-1 text-[10px] text-gray-200">Gross annual income</p>
        </div>

        {/* Home Ownership */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-white">
            Home Ownership:
          </label>
          <select
            name="home_ownership"
            value={formData.home_ownership}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          >
            <option value="">Select Home Ownership</option>
            <option value="RENT">Rent</option>
            <option value="OWN">Own</option>
            <option value="MORTGAGE">Mortgage</option>
          </select>
        </div>

        {/* Employment Duration */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-white">
            Employment Duration (months):
          </label>
          <input
            type="number"
            name="employment_duration"
            value={formData.employment_duration}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          />
          <p className="mt-1 text-[10px] text-gray-200">Time at current job</p>
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
            disabled={isLoading}
          >
            {isLoading ? "Predicting..." : "Predict Loan Amount"}
          </button>
        </div>
      </form>

      {/* Right Side Form */}
      <div className="mx-auto w-[400px] mt-14">
        {/* Loan Intent */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-white">
            Loan Purpose:
          </label>
          <select
            name="loan_intent"
            value={formData.loan_intent}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          >
            <option value="">Select Loan Purpose</option>
            <option value="PERSONAL">Personal</option>
            <option value="EDUCATION">Education</option>
            <option value="MEDICAL">Medical</option>
            <option value="VENTURE">Business Venture</option>
          </select>
        </div>

        {/* Loan Grade */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-white">
            Loan Grade:
          </label>
          <select
            name="loan_grade"
            value={formData.loan_grade}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          >
            <option value="">Select Loan Grade</option>
            <option value="A">A (Best)</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D (Higher Risk)</option>
          </select>
          <p className="mt-1 text-[10px] text-gray-200">Credit risk assessment grade</p>
        </div>

        {/* Interest Rate */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-white">
            Interest Rate (%):
          </label>
          <input
            type="number"
            step="0.01"
            name="loan_int_rate"
            value={formData.loan_int_rate}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          />
        </div>

        {/* Term Years */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-white">
            Loan Term (years):
          </label>
          <input
            type="number"
            name="term_years"
            value={formData.term_years}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          />
        </div>

        {/* Historical Default */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-white">
            Previous Default:
          </label>
          <select
            name="historical_default"
            value={formData.historical_default}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          >
            <option value="">Select Default History</option>
            <option value="Y">Yes</option>
            <option value="N">No</option>
          </select>
        </div>

        {/* Credit History Length */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-white">
            Credit History (years):
          </label>
          <input
            type="number"
            name="cred_hist_length"
            value={formData.cred_hist_length}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          />
        </div>

        {/* Prediction Result */}
        <div className="mt-10 p-6 bg-gray-700 rounded-lg">
          <h2 className="text-2xl text-white mb-4 text-center">Loan Amount Forecast</h2>
          {prediction !== null && typeof prediction === 'number' ? (
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-400">
                LKR {prediction.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </p>
              <p className="text-gray-300 mt-2">Estimated approved loan amount</p>
            </div>
          ) : prediction ? (
            <p className="text-red-500 text-center">{prediction}</p>
          ) : (
            <p className="text-gray-400 text-center">Submit form to get prediction</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default LoanAmountForecast;