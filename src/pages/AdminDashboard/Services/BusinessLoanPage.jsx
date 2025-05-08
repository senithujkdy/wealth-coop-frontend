import { useState } from "react";
import { businessLoans } from "./businessLoanData";

export default function BusinessLoanPage({ onBack }) {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [riskLevel, setRiskLevel] = useState("");
  const [notes, setNotes] = useState("");

  const filteredLoans = businessLoans.filter((loan) =>
    loan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.id.toString().includes(searchTerm)
  );

  const handleFlagRecord = () => {
    if (!riskLevel) return;
    
    const updatedLoan = {
      ...selectedRecord,
      riskAssessment: {
        level: riskLevel,
        notes,
        flaggedBy: "User", // You can replace with actual user name
        flaggedDate: new Date().toISOString().split('T')[0]
      }
    };

    // In a real app, you would update the record in your database here
    console.log("Flagged record:", updatedLoan);
    
    // For demo purposes, we'll just close the modal
    setSelectedRecord(null);
    setRiskLevel("");
    setNotes("");
  };

  const getRiskColor = (level) => {
    switch(level) {
      case "Low": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "High": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Business Loan Records</h2>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded hover:from-gray-700 hover:to-gray-800 transition"
        >
          Back to Services
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by Name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="space-y-4">
        {filteredLoans.length === 0 ? (
          <p className="text-gray-500 text-center italic">No matching loan records found.</p>
        ) : (
          filteredLoans.map((loan) => (
            <div key={loan.id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition duration-300">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <p><strong>ID:</strong> {loan.id}</p>
                <p><strong>Name:</strong> {loan.name}</p>
                <p><strong>Contact:</strong> {loan.contact}</p>
                <p>
                  <strong>Status:</strong>
                  <span
                    className={`ml-1 px-2 py-1 rounded text-xs font-medium ${
                      loan.status === "Approved"
                        ? "bg-green-100 text-green-800"
                        : loan.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {loan.status}
                  </span>
                </p>
                <p>
                  <strong>Risk:</strong>
                  {loan.riskAssessment ? (
                    <span className={`ml-1 px-2 py-1 rounded text-xs font-medium ${getRiskColor(loan.riskAssessment.level)}`}>
                      {loan.riskAssessment.level}
                    </span>
                  ) : (
                    <span className="ml-1 text-gray-500 text-xs">Not assessed</span>
                  )}
                </p>
                <p><strong>Amount:</strong> ${loan.amount.toLocaleString()}</p>
                <p><strong>Date:</strong> {loan.date}</p>
                <p><strong>Address:</strong> {loan.address}</p>
              </div>
              <button
                onClick={() => setSelectedRecord(loan)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                View More
              </button>
            </div>
          ))
        )}
      </div>

      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/80 p-6 rounded-xl max-w-xl w-full max-h-[80vh] overflow-y-auto shadow-2xl border border-gray-300">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Full Loan Details - {selectedRecord.name}
              </h3>
              <button
                onClick={() => {
                  setSelectedRecord(null);
                  setRiskLevel("");
                  setNotes("");
                }}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <p><strong>ID:</strong> {selectedRecord.id}</p>
              <p><strong>Name:</strong> {selectedRecord.name}</p>
              <p><strong>Contact:</strong> {selectedRecord.contact}</p>
              <p><strong>Status:</strong> {selectedRecord.status}</p>
              <p><strong>Amount:</strong> Rs{selectedRecord.amount.toLocaleString()}</p>
              <p><strong>Date:</strong> {selectedRecord.date}</p>
              <p><strong>Address:</strong> {selectedRecord.address}</p>
              {selectedRecord.riskAssessment && (
                <div className="col-span-2">
                  <p><strong>Risk Level:</strong>
                    <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getRiskColor(selectedRecord.riskAssessment.level)}`}>
                      {selectedRecord.riskAssessment.level}
                    </span>
                  </p>
                  <p><strong>Notes:</strong> {selectedRecord.riskAssessment.notes}</p>
                  <p><strong>Flagged By:</strong> {selectedRecord.riskAssessment.flaggedBy}</p>
                  <p><strong>Date Flagged:</strong> {selectedRecord.riskAssessment.flaggedDate}</p>
                </div>
              )}
            </div>
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Loan Details:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {Object.entries(selectedRecord.details).map(([key, value]) => (
                  <div key={key}>
                    <strong>{key}:</strong> {value}
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Assessment Section */}
            <div className="border-t pt-4 mt-4">
              <h4 className="font-medium mb-2">Risk Assessment</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Risk Level</label>
                  <select
                    value={riskLevel}
                    onChange={(e) => setRiskLevel(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select risk level</option>
                    <option value="Low">Low Risk</option>
                    <option value="Medium">Medium Risk</option>
                    <option value="High">High Risk</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows="3"
                    placeholder="Add notes about the risk assessment..."
                  />
                </div>
                <button
                  onClick={handleFlagRecord}
                  disabled={!riskLevel}
                  className={`px-4 py-2 rounded text-white ${!riskLevel ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                >
                  Flag Record
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedRecord(null);
                setRiskLevel("");
                setNotes("");
              }}
              className="mt-6 w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded hover:from-blue-600 hover:to-blue-700 transition"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}