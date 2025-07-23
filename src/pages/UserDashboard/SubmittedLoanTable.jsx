const SubmittedLoanTable = ({ submittedApplications }) => {
    console.log(submittedApplications)
    
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <h2 className="text-xl font-bold text-gray-800 p-6 pb-4">Submitted Applications</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-100">
              <th className="px-6 py-3 font-medium">SL No</th>
              <th className="px-6 py-3 font-medium">Loan ID</th>
              <th className="px-6 py-3 font-medium">Loan Amount</th>
              <th className="px-6 py-3 font-medium">Interest Rate (%)</th>
              <th className="px-6 py-3 font-medium">Credit Score</th>
              <th className="px-6 py-3 font-medium">Income</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Application Date</th>
              <th className="px-6 py-3 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody>
            {submittedApplications.map((loan, index) => (
              <tr key={loan._id} className="border-b border-gray-100">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{loan.loan_id}</td>
                <td className="px-6 py-4 font-medium">{loan.loan_amount}</td>
                <td className="px-6 py-4">{loan.interest_rate}</td>
                <td className="px-6 py-4">{loan.credit_score}</td>
                <td className="px-6 py-4">{loan.income}</td>
                <td className="px-6 py-4 capitalize">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    loan.status === 'pending' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {loan.status}
                  </span>
                </td>
                <td className="px-6 py-4"> {new Date(loan.createdAt).toLocaleDateString('en-GB')}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {loan.status === 'rejected' && loan.remarks ? (
                    <span className="text-red-600">{loan.remarks|| "No remarks"}</span>
                  ) : (
                    <span className="text-gray-400">Under review</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default SubmittedLoanTable