// import Table from './Table'

import { useState } from "react";

function Dashboard() {
    // Sample loan data based on the provided JSON
    const [loans] = useState([
      {
        "_id": "67fab5d7357b5ff1e838227c",
        "loan_id": "LOAN002",
        "user_id": "USR002",
        "account_id": "ACC001",
        "loan_amount": 905000,
        "interest_rate": 12.5,
        "credit_score": 720,
        "income": 100000,
        "loan_limit": "CF",
        "status": "pending",
        "prediction_time": "2025-04-12T18:49:59.433Z",
        "createdAt": "2025-04-12T18:49:59.433Z",
        "updatedAt": "2025-04-12T18:52:50.605Z"
      },
      // Added some sample data for demonstration
      {
        "_id": "67fab5d7357b5ff1e838227d",
        "loan_id": "LOAN003",
        "user_id": "USR001",
        "account_id": "ACC002",
        "loan_amount": 750000,
        "interest_rate": 10.2,
        "credit_score": 780,
        "income": 120000,
        "loan_limit": "CF",
        "status": "approved",
        "prediction_time": "2025-04-10T14:22:31.433Z",
        "createdAt": "2025-04-10T14:22:31.433Z",
        "updatedAt": "2025-04-11T09:15:40.605Z"
      },
      {
        "_id": "67fab5d7357b5ff1e838227e",
        "loan_id": "LOAN004",
        "user_id": "USR003",
        "account_id": "ACC003",
        "loan_amount": 250000,
        "interest_rate": 9.8,
        "credit_score": 640,
        "income": 75000,
        "loan_limit": "CF",
        "status": "rejected",
        "prediction_time": "2025-04-08T11:34:22.433Z",
        "createdAt": "2025-04-08T11:34:22.433Z",
        "updatedAt": "2025-04-08T11:36:18.605Z"
      }
    ]);
  
    // Format date function
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    };
  
    // Format currency function
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    };
  
    // Get status color class
    const getStatusClass = (status) => {
      switch(status.toLowerCase()) {
        case 'approved':
          return "text-green-500";
        case 'rejected':
          return "text-red-500";
        case 'pending':
          return "text-yellow-500";
        default:
          return "text-gray-500";
      }
    };
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Loan Applications</h2>
        <div className="flex space-x-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm">Export</button>
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm">Filter</button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 font-semibold text-gray-600 text-sm">Loan ID</th>
              <th className="p-3 font-semibold text-gray-600 text-sm">User</th>
              <th className="p-3 font-semibold text-gray-600 text-sm">Amount</th>
              <th className="p-3 font-semibold text-gray-600 text-sm">Interest</th>
              <th className="p-3 font-semibold text-gray-600 text-sm">Credit Score</th>
              <th className="p-3 font-semibold text-gray-600 text-sm">Date</th>
              <th className="p-3 font-semibold text-gray-600 text-sm">Status</th>
              <th className="p-3 font-semibold text-gray-600 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{loan.loan_id}</td>
                <td className="p-3">{loan.user_id}</td>
                <td className="p-3 font-medium">{formatCurrency(loan.loan_amount)}</td>
                <td className="p-3">{loan.interest_rate}%</td>
                <td className="p-3">{loan.credit_score}</td>
                <td className="p-3 text-gray-500">{formatDate(loan.createdAt)}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(loan.status)}`}>
                    {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex space-x-2">
                    {loan.status === "pending" && (
                      <>
                        <button className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600">
                          Approve
                        </button>
                        <button className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600">
                          Reject
                        </button>
                      </>
                    )}
                    <button className="bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-600">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
        <div>Showing {loans.length} loans</div>
        <div className="flex space-x-1">
          <button className="px-3 py-1 rounded border">Previous</button>
          <button className="px-3 py-1 rounded bg-blue-500 text-white">1</button>
          <button className="px-3 py-1 rounded border">2</button>
          <button className="px-3 py-1 rounded border">3</button>
          <button className="px-3 py-1 rounded border">Next</button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard