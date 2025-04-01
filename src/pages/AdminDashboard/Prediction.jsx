const predictions = [
  { title: "Loan Default Prediction" },
  { title: "Loan Repayment Prediction" },
  { title: "Loan Amount Forecast" },
];

export default function Predictions() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-stretch justify-start p-6">
      <h1 className="text-2xl font-semibold mb-6">Predictive Analytics & Insights</h1>
      <div className="grid grid-cols-3 gap-4">
        {predictions.map((item, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-12 rounded-2xl shadow-md text-lg font-medium text-center w-60"
          >
            {item.title}
          </div>
        ))}
      </div>
    </div>
  );
}
