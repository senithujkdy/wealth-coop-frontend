import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

function LoanAmountForecast() {
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
  const [isLoading, setIsLoading] = useState(false);

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
        className="flex items-start justify-between gap-x-5 min-h-screen bg-gray-800 py-10">
      {/* Left Side Form */}
      <form onSubmit={handleSubmit} className="mx-auto w-[400px]">
        <div className="mb-5">
          <h1 className="text-4xl text-white font-semibold text-center tracking-normal">
            Loan Amount Forecast
          </h1>
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

        {/* Submit Button */}
        <div className="flex justify-center mt-9">
          <button
            type="submit"
            className="bg-blue-400 hover:bg-blue-700 text-white font-medium py-2 px-12 rounded-full"
            disabled={isLoading}
          >
            {isLoading ? "Predicting..." : "Predict Loan Amount"}
          </button>
        </div>
      </form>

      {/* Right Side Form */}
      <form className="mx-auto w-[400px] mt-14">
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
        <div className="flex flex-col items-center mt-10 p-6 bg-gray-700 rounded-lg">
          <h2 className="text-xl text-white mb-4">Loan Amount Forecast</h2>
          {prediction !== null ? (
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-400">
                LKR {prediction.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </p>
              <p className="text-gray-300 mt-2">Estimated approved loan amount</p>
            </div>
          ) : (
            <p className="text-gray-400">Submit form to get prediction</p>
          )}
        </div>
      </form>
      </motion.div>
  );
}

export default LoanAmountForecast;