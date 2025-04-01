const Table = () => {
    const data = [
      { client: "User1", activity: "Fund Transfer", date: "Mar 15, 2025", status: "Processing" },
      { client: "User1", activity: "Loan Request", date: "Mar 15, 2025", status: "Declined" },
      { client: "User3", activity: "Fund Receive", date: "Mar 23, 2025", status: "Done" },
      { client: "User1", activity: "Fund Transfer", date: "Mar 15, 2025", status: "Processing" },
      { client: "User2", activity: "Loan Payment", date: "Mar 20, 2025", status: "Done" },
      { client: "User5", activity: "Loan Request", date: "Mar 11, 2025", status: "Declined" },
    ];
  
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Active Loans Overview</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Client</th>
              <th className="p-3">Activity</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-b">
                <td className="p-3">{row.client}</td>
                <td className="p-3">{row.activity}</td>
                <td className="p-3">{row.date}</td>
                <td className={`p-3 ${row.status === "Declined" ? "text-red-500" : row.status === "Done" ? "text-green-500" : "text-yellow-500"}`}>
                  {row.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default Table;
  