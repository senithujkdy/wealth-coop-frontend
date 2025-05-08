import { useState } from "react";
import { Shield, ShoppingBag, HeartHandshake } from "lucide-react";
import LifeInsurance from "./Services/LifeInsurance";
import Shopping from "./Services/Shopping";
import Safety from "./Services/Safety";
import BusinessLoanPage from "./Services/BusinessLoanPage";
import CheckingAccountPage from "./Services/CheckingAccountPage";
import SavingsAccountPage from "./Services/SavingsAccountPage";

// Services array
const services = [
  { icon: <HeartHandshake className="text-blue-500" />, title: "Life Insurance" },
  { icon: <ShoppingBag className="text-yellow-500" />, title: "Shopping" },
  { icon: <Shield className="text-green-500" />, title: "Safety" },
];

// Loans array
const loans = [
  { icon: "🏦", title: "Business loans", desc: "Flexible business loan options" },
  { icon: "💳", title: "Checking accounts", desc: "Manage your daily expenses" },
  { icon: "📊", title: "Savings accounts", desc: "Grow your savings steadily" },
  { icon: "💰", title: "Debit and credit cards", desc: "Secure card options for you" },
  { icon: "🛡️", title: "Life Insurance", desc: "Protect your future and family" }
];

export default function Services() {
  const [activeService, setActiveService] = useState(null);
  const [selectedLoan, setSelectedLoan] = useState(null);

  const handleBack = () => {
    setActiveService(null);
    setSelectedLoan(null);
  };

  const renderActiveComponent = () => {
    if (selectedLoan) {
      if (selectedLoan.title === "Business loans") return <BusinessLoanPage onBack={handleBack} />;
      if (selectedLoan.title === "Checking accounts") return <CheckingAccountPage onBack={handleBack} />;
      if (selectedLoan.title === "Savings accounts") return <SavingsAccountPage onBack={handleBack} />;

      return (
        <div className="text-center text-gray-600 py-20">
          <h2 className="text-2xl font-semibold mb-2">Details Page</h2>
          <p>
            Details for <strong>{selectedLoan.title}</strong> will appear here.
          </p>
          <button
            onClick={handleBack}
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Back
          </button>
        </div>
      );
    }

    if (activeService) {
      const ServiceComponent =
        activeService === "Life Insurance"
          ? LifeInsurance
          : activeService === "Shopping"
          ? Shopping
          : Safety;

      return (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{activeService}</h2>
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Back
            </button>
          </div>
          <ServiceComponent />
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold mb-3">Ongoing and Pending Loans</h3>
        {loans.map((loan, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition"
          >
            <div className="flex items-center">
              <div className="text-2xl">{loan.icon}</div>
              <div className="ml-4">
                <h4 className="font-medium text-lg">{loan.title}</h4>
                <p className="text-gray-500 text-sm">{loan.desc}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedLoan(loan)}
              className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-100"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Top Service Cards */}
      {!activeService && !selectedLoan && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {services.map((service, index) => (
            <div
              key={index}
              className={`p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition cursor-pointer ${
                activeService === service.title ? "ring-2 ring-blue-400" : ""
              }`}
              onClick={() => {
                setActiveService(service.title);
                setSelectedLoan(null);
              }}
            >
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 rounded-lg">{service.icon}</div>
                <div className="ml-4">
                  <h3 className="font-semibold text-lg">{service.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Section */}
      <div className="p-4 bg-white rounded-lg shadow-md">{renderActiveComponent()}</div>
    </div>
  );
}
