import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { PREDICT_REPAYMENT_URL } from "../../../requests";
import { businessLoans } from "../AdminDashboard/Services/businessLoanData";

function LoanRepaymentPrediction() {
  const [userID, setUserID] = useState("");
  const [formData, setFormData] = useState({
    "credit.policy": "",
    purpose: "",
    "int.rate": "",
    installment: "",
    "log.annual.inc": "",
    dti: "",
    fico: "",
    "days.with.cr.line": "",
    "revol.bal": "",
    "revol.util": "",
    "inq.last.6mths": "",
    "delinq.2yrs": "",
    "pub.rec": ""
  });

  const [prediction, setPrediction] = useState({
    percentage: null,
    riskCategory: null
  });

  // New state variables
  const [showInvalidIDModal, setShowInvalidIDModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUserIDChange = (e) => {
    setUserID(e.target.value);
  };

  const handleLookup = () => {
    const loan = businessLoans.find(loan => loan.id === userID);
    if (loan) {
      const details = loan.details;
      setFormData({
        "credit.policy": details["Credit policy"] === "Yes" ? "1" : "0",
        purpose: details["Loan Purpose"].toLowerCase().replace(" ", "_"),
        "int.rate": details["Interest Rate"].toString(),
        installment: details["Monthly Installment (Rs)"].toString(),
        "log.annual.inc": details["Log Annual Income"].toString(),
        dti: details["Debt-to-Income Ratio"].toString(),
        fico: details["FICO Score"].toString(),
        "days.with.cr.line": details["Days with Credit Line"].toString(),
        "revol.bal": details["Revolving Balance (Rs)"].toString(),
        "revol.util": details["Revolving Utilization (%)"].toString(),
        "inq.last.6mths": details["Inq last"].toString(),
        "delinq.2yrs": details["Delinq 2yrs"].toString(),
        "pub.rec": details["Public rec"].toString()
      });
    } else {
      setShowInvalidIDModal(true);
    }
  };

  const resetForm = () => {
    setUserID("");
    setFormData({
      "credit.policy": "",
      purpose: "",
      "int.rate": "",
      installment: "",
      "log.annual.inc": "",
      dti: "",
      fico: "",
      "days.with.cr.line": "",
      "revol.bal": "",
      "revol.util": "",
      "inq.last.6mths": "",
      "delinq.2yrs": "",
      "pub.rec": ""
    });
    setPrediction({
      percentage: null,
      riskCategory: null
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Convert numerical fields to appropriate types
    const payload = {
      ...formData,
      "credit.policy": parseInt(formData["credit.policy"]),
      "int.rate": parseFloat(formData["int.rate"]),
      "installment": parseFloat(formData["installment"]),
      "log.annual.inc": parseFloat(formData["log.annual.inc"]),
      "dti": parseFloat(formData["dti"]),
      "fico": parseInt(formData["fico"]),
      "days.with.cr.line": parseFloat(formData["days.with.cr.line"]),
      "revol.bal": parseFloat(formData["revol.bal"]),
      "revol.util": parseFloat(formData["revol.util"]),
      "inq.last.6mths": parseInt(formData["inq.last.6mths"]),
      "delinq.2yrs": parseInt(formData["delinq.2yrs"]),
      "pub.rec": parseInt(formData["pub.rec"])
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/predict-repayment", 
        payload
      );
      setPrediction({
        percentage: response.data.prediction,
        riskCategory: response.data.risk_category
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setPrediction({
        percentage: null,
        riskCategory: "Error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate color based on risk category
  const getRiskColor = () => {
    switch(prediction.riskCategory) {
      case "Low": return "text-green-500";
      case "Medium": return "text-yellow-500";
      case "High": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  return (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-start justify-between gap-x-5 min-h-screen bg-gray-800 py-10">
      
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
            Loan Repayment Prediction
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

        {/* Credit Policy */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-white">
            Meets Credit Policy:
          </label>
          <select
            name="credit.policy"
            value={formData["credit.policy"]}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          >
            <option value="">Select</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
          <p className="mt-1 text-[10px] text-gray-200">Whether customer meets credit underwriting criteria</p>
        </div>

        {/* Purpose */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-white">
            Loan Purpose:
          </label>
          <select
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          >
            <option value="">Select Purpose</option>
            <option value="credit_card">Credit Card</option>
            <option value="debt_consolidation">Debt Consolidation</option>
            <option value="educational">Educational</option>
            <option value="major_purchase">Major Purchase</option>
            <option value="small_business">Small Business</option>
            <option value="all_other">All Other</option>
          </select>
        </div>

        {/* Interest Rate */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-white">
            Interest Rate:
          </label>
          <input
            type="number"
            step="0.0001"
            name="int.rate"
            value={formData["int.rate"]}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          />
          <p className="mt-1 text-[10px] text-gray-200">The interest rate of the loan (e.g., 0.1189 for 11.89%)</p>
        </div>

        {/* Installment */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-white">
            Monthly Installment ($):
          </label>
          <input
            type="number"
            step="0.01"
            name="installment"
            value={formData.installment}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          />
        </div>

        {/* Log Annual Income */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-white">
            Log Annual Income:
          </label>
          <input
            type="number"
            step="0.00000001"
            name="log.annual.inc"
            value={formData["log.annual.inc"]}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          />
          <p className="mt-1 text-[10px] text-gray-200">Natural log of self-reported annual income</p>
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
            Predict Repayment
          </button>
        </div>
      </form>

      {/* Right Side Form */}
      <div className="mx-auto w-[400px] mt-24">
        {/* DTI */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-white">
            Debt-to-Income Ratio:
          </label>
          <input
            type="number"
            step="0.01"
            name="dti"
            value={formData.dti}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          />
        </div>

        {/* FICO Score */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-white">
            FICO Score:
          </label>
          <input
            type="number"
            name="fico"
            value={formData.fico}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          />
          <p className="mt-1 text-[10px] text-gray-200">Credit score (300-850)</p>
        </div>

        {/* Days with Credit Line */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-white">
            Days with Credit Line:
          </label>
          <input
            type="number"
            step="0.01"
            name="days.with.cr.line"
            value={formData["days.with.cr.line"]}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          />
        </div>

        {/* Revolving Balance */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-white">
            Revolving Balance ($):
          </label>
          <input
            type="number"
            name="revol.bal"
            value={formData["revol.bal"]}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          />
        </div>

        {/* Revolving Utilization */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-white">
            Revolving Utilization (%):
          </label>
          <input
            type="number"
            step="0.1"
            name="revol.util"
            value={formData["revol.util"]}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          />
        </div>

        {/* Prediction Results */}
        <div className="mt-10 p-4 bg-gray-700 rounded-lg">
          <h2 className="text-2xl text-white mb-4">Prediction Results</h2>
          
          <div className="mb-3">
            <span className="text-white">Repayment Percentage: </span>
            <span className="text-xl font-bold text-blue-400">
              {prediction.percentage !== null ? 
                `${(prediction.percentage * 100).toFixed(2)}%` : 
                "N/A"}
            </span>
          </div>
          
          <div>
            <span className="text-white">Risk Category: </span>
            <span className={`text-xl font-bold ${getRiskColor()}`}>
              {prediction.riskCategory || "N/A"}
            </span>
          </div>
        </div>

        {/* Risk Legend */}
        <div className="mt-4 text-xs text-gray-300">
          <p><span className="text-green-500">Low Risk</span>: ≥90% repayment likely</p>
          <p><span className="text-yellow-500">Medium Risk</span>: 70-89% repayment likely</p>
          <p><span className="text-red-500">High Risk</span>: &lt;70% repayment likely</p>
        </div>
      </div>
    </motion.div>
  );
}

export default LoanRepaymentPrediction;