const ActiveLoanTable = ({ activeLoans }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <h2 className="text-xl font-bold text-gray-800 p-6 pb-4">Active Loans Overview</h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-100">
              <th className="px-6 py-3 font-medium">SL No</th>
              <th className="px-6 py-3 font-medium">Loan ID</th>
              {/* <th className="px-6 py-3 font-medium">User ID</th> */}
              {/* <th className="px-6 py-3 font-medium">Account ID</th> */}
              <th className="px-6 py-3 font-medium">Loan Amount</th>
              <th className="px-6 py-3 font-medium">Interest Rate (%)</th>
              <th className="px-6 py-3 font-medium">Credit Score</th>
              <th className="px-6 py-3 font-medium">Income</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Repay</th>
              {/* <th className="px-6 py-3 font-medium">Prediction Time</th> */}
            </tr>
          </thead>
          <tbody>
            {activeLoans.map((loan, index) => (
              <tr key={loan._id} className="border-b border-gray-100">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{loan.loan_id}</td>
                {/* <td className="px-6 py-4">{loan.user_id}</td> */}
                {/* <td className="px-6 py-4">{loan.account_id}</td> */}
                <td className="px-6 py-4 font-medium">{loan.loan_amount}</td>
                <td className="px-6 py-4">{loan.interest_rate}</td>
                <td className="px-6 py-4">{loan.credit_score}</td>
                <td className="px-6 py-4">{loan.income}</td>
                <td className="px-6 py-4 capitalize">{loan.status}</td>
                <td className="px-6 py-4">
                  <button
                    className="rounded-full px-6 py-1 border border-blue-500 bg-blue-500 text-white hover:bg-blue-600 transition"
                    onClick={() => onRepay && onRepay(loan)}
                  >
                    Repay
                  </button>
                </td>
                {/* <td className="px-6 py-4">{new Date(loan.prediction_time).toLocaleString()}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveLoanTable;
