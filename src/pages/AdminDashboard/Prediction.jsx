import { useCallback } from "react";
import { motion } from "framer-motion";
import { FaChartLine, FaMoneyCheckAlt, FaBalanceScale } from "react-icons/fa";

const predictions = [
  {
    title: "Loan Default Prediction",
    description: "Predict the risk of a borrower defaulting on a loan before approval.",
    icon: <FaBalanceScale size={40} />,
    path: "/default",
  },
  {
    title: "Loan Repayment Prediction",
    description: "Assess if a customer will successfully repay their existing loan.",
    icon: <FaMoneyCheckAlt size={40} />,
    path: "/repayment",
  },
  {
    title: "Loan Amount Forecast",
    description: "Estimate the optimal loan amount based on borrower profiles.",
    icon: <FaChartLine size={40} />,
    path: "/forecast",
  },
];

export default function Predictions() {
  const handleClick = useCallback((path) => {
    const url = window.location.origin + path;
    window.open(url, "_blank");
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-8"
    >
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Predictive Analytics & Insights</h1>
      <p className="text-gray-600 mb-12 text-center max-w-2xl">
        Explore powerful predictive tools designed to assist in loan management decisions.
        Click on a module below to get started!
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {predictions.map((item, index) => (
          <motion.div
            key={index}
            onClick={() => handleClick(item.path)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
            className="cursor-pointer bg-white hover:bg-blue-600 hover:text-white border border-gray-200 p-8 rounded-2xl shadow-lg hover:shadow-2xl transform transition-all duration-300 flex flex-col items-center justify-center text-center"
          >
            <div className="mb-4">{item.icon}</div>
            <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
            <p className="text-sm text-gray-500 hover:text-white">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}