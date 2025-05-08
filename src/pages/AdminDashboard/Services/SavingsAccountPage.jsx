import { useState } from "react";
import { savingsAccounts } from "./savingsAccountData";

export default function SavingsAccountPage({ onBack }) {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAccounts = savingsAccounts.filter((record) =>
    record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.id.toString().includes(searchTerm)
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Savings Account Records</h2>
        <button
          onClick={onBack}
          className="px-5 py-2 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-lg hover:brightness-110 transition"
        >
          Back to Services
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by Name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
        />
      </div>

      <div className="space-y-4">
        {filteredAccounts.length === 0 ? (
          <p className="text-gray-500 italic">No matching accounts found.</p>
        ) : (
          filteredAccounts.map((record) => (
            <div
              key={record.id}
              className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700">
                <p><strong>ID:</strong> {record.id}</p>
                <p><strong>Name:</strong> {record.name}</p>
                <p><strong>Contact:</strong> {record.contact}</p>
                <p><strong>Status:</strong> {record.status}</p>
                <p><strong>Date:</strong> {record.date}</p>
                <p><strong>Address:</strong> {record.address}</p>
              </div>
              <button
                onClick={() => setSelectedRecord(record)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                View More
              </button>
            </div>
          ))
        )}
      </div>

      {/* Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white bg-opacity-90 p-6 rounded-2xl max-w-xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Full Account Details - {selectedRecord.name}
              </h3>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-gray-500 hover:text-gray-800 text-xl"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
              <p><strong>ID:</strong> {selectedRecord.id}</p>
              <p><strong>Name:</strong> {selectedRecord.name}</p>
              <p><strong>Contact:</strong> {selectedRecord.contact}</p>
              <p><strong>Status:</strong> {selectedRecord.status}</p>
              <p><strong>Date:</strong> {selectedRecord.date}</p>
              <p><strong>Address:</strong> {selectedRecord.address}</p>
            </div>
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2 text-gray-800">Account Details:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                {Object.entries(selectedRecord.details).map(([key, value]) => (
                  <div key={key}>
                    <strong>{key}:</strong> {value}
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() => setSelectedRecord(null)}
              className="mt-6 w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}