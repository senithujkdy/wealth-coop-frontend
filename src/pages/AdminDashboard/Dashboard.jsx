// import Table from './Table'

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

function Dashboard() {
  const { user } = useAuth(); // assuming useAuth gives you current logged-in user

  // Sample loan data based on the provided JSON
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/approvals/all");
        const data = await res.json();
        if (res.ok) {
          setLoans(data);
        } else {
          throw new Error(data.error || "Failed to fetch loans");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format currency function
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get status color class
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "text-green-500";
      case "rejected":
        return "text-red-500";
      case "pending":
        return "text-yellow-500";
      default:
        return "text-gray-500";
    }
  };
  //-------//
  const handleAction = async (loan_id, approval_status) => {
    const staff_id = user?.user_id;

    const remarks =
      approval_status === "approved"
        ? "Verified documents and credit score"
        : "Rejected due to credit concerns";

    try {
      const res = await fetch("http://localhost:3000/api/approvals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ loan_id, staff_id, approval_status, remarks }),
      });

      const result = await res.json();
      if (res.ok) {
        setLoans(loans.filter((loan) => loan.loan_id !== loan_id));
        alert(`Loan ${approval_status}`);
      } else {
        alert(result.error || "Action failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  //-------//
  const deleteLoan = async (loan_id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/approvals/${loan_id}`, {
        method: "DELETE",
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log("Loan deleted:", data.message);
        // Optionally update your local state or refetch data
      } else {
        console.error("Delete failed:", data.error);
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  };
  

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Loan Applications</h2>
        <div className="flex space-x-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm">
            Export
          </button>
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm">
            Filter
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center text-gray-500">Loading loans...</div>
        ) : error ? (
          <div className="text-center text-red-500">Error: {error}</div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 font-semibold text-gray-600 text-sm">
                  Loan ID
                </th>
                <th className="p-3 font-semibold text-gray-600 text-sm">
                  User
                </th>
                <th className="p-3 font-semibold text-gray-600 text-sm">
                  Amount
                </th>
                <th className="p-3 font-semibold text-gray-600 text-sm">
                  Interest
                </th>
                <th className="p-3 font-semibold text-gray-600 text-sm">
                  Credit Score
                </th>
                <th className="p-3 font-semibold text-gray-600 text-sm">
                  Date
                </th>
                <th className="p-3 font-semibold text-gray-600 text-sm">
                  Status
                </th>
                <th className="p-3 font-semibold text-gray-600 text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{loan.loan_id}</td>
                  <td className="p-3">{loan.user_id}</td>
                  <td className="p-3 font-medium">
                    {formatCurrency(loan.loan_amount)}
                  </td>
                  <td className="p-3">{loan.interest_rate}%</td>
                  <td className="p-3">{loan.credit_score}</td>
                  <td className="p-3 text-gray-500">
                    {formatDate(loan.createdAt)}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(
                        loan.status
                      )}`}
                    >
                      {loan.status.charAt(0).toUpperCase() +
                        loan.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex space-x-2">
                      {loan.status === "pending" && (
                        <>
                          <button
                            className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                            onClick={() =>
                              handleAction(loan.loan_id, "approved")
                            }
                          >
                            Approve
                          </button>
                          <button
                            className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                            onClick={() =>
                              handleAction(loan.loan_id, "rejected")
                            }
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button className="bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-600"
                        onClick={()=>deleteLoan(loan.loan_id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
        <div>Showing {loans.length} loans</div>
        <div className="flex space-x-1">
          <button className="px-3 py-1 rounded border">Previous</button>
          <button className="px-3 py-1 rounded bg-blue-500 text-white">
            1
          </button>
          <button className="px-3 py-1 rounded border">2</button>
          <button className="px-3 py-1 rounded border">3</button>
          <button className="px-3 py-1 rounded border">Next</button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
