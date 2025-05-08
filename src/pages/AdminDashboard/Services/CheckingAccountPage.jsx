import { useState } from "react";
import { checkingAccounts } from "./checkingAccountData";

export default function CheckingAccountPage({ onBack }) {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAccounts = checkingAccounts.filter(account =>
    account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.id.toString().includes(searchTerm)
  );

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Checking Account Records</h2>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Back to Services
        </button>
      </div>

      {/* Search bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by Name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Account Cards */}
      <div className="space-y-4">
        {filteredAccounts.length === 0 ? (
          <p className="text-gray-500">No matching accounts found.</p>
        ) : (
          filteredAccounts.map((account) => (
            <div key={account.id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <p><strong>ID:</strong> {account.id}</p>
                <p><strong>Name:</strong> {account.name}</p>
                <p><strong>Contact:</strong> {account.contact}</p>
                <p><strong>Status:</strong> {account.status}</p>
                <p><strong>Date:</strong> {account.date}</p>
                <p><strong>Address:</strong> {account.address}</p>
              </div>
              <button
                onClick={() => setSelectedRecord(account)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                View More
              </button>
            </div>
          ))
        )}
      </div>

      {/* Modal for Account Details */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-xl w-full max-h-[80vh] overflow-y-auto shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">
                Full Account Details - {selectedRecord.name}
              </h3>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <p><strong>ID:</strong> {selectedRecord.id}</p>
              <p><strong>Name:</strong> {selectedRecord.name}</p>
              <p><strong>Contact:</strong> {selectedRecord.contact}</p>
              <p><strong>Status:</strong> {selectedRecord.status}</p>
              <p><strong>Date:</strong> {selectedRecord.date}</p>
              <p><strong>Address:</strong> {selectedRecord.address}</p>
            </div>

            {/* Additional Account Details */}
            {selectedRecord.details ? (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Account Details:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {Object.entries(selectedRecord.details).map(([key, value]) => (
                    <div key={key}>
                      <strong>{key}:</strong> {value}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic mt-4">No additional details available.</p>
            )}

            <button
              onClick={() => setSelectedRecord(null)}
              className="mt-6 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
