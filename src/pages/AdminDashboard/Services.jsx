import { Shield, ShoppingBag, HeartHandshake } from "lucide-react";

const services = [
  { icon: <HeartHandshake className="text-blue-500" />, title: "Life Insurance", desc: "Unlimited protection" },
  { icon: <ShoppingBag className="text-yellow-500" />, title: "Shopping", desc: "Buy. Think. Grow." },
  { icon: <Shield className="text-green-500" />, title: "Safety", desc: "We are your allies" },
];

const loans = [
  { icon: "🏦", title: "Business loans", desc: "It is a long established" },
  { icon: "💳", title: "Checking accounts", desc: "It is a long established" },
  { icon: "📊", title: "Savings accounts", desc: "It is a long established" },
  { icon: "💰", title: "Debit and credit cards", desc: "It is a long established" },
  { icon: "🛡️", title: "Life Insurance", desc: "It is a long established" },
  { icon: "🏦", title: "Business loans", desc: "It is a long established" },
];

export default function Services() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* Top Service Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {services.map((service, index) => (
          <div key={index} className="flex items-center p-4 bg-white rounded-lg shadow-md">
            <div className="p-2 bg-gray-100 rounded-lg">{service.icon}</div>
            <div className="ml-4">
              <h3 className="font-semibold">{service.title}</h3>
              <p className="text-gray-500 text-sm">{service.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Ongoing Loans */}
      <h3 className="text-xl font-semibold mb-3">Ongoing And Pending Loans</h3>
      <div className="space-y-4">
        {loans.map((loan, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="text-xl">{loan.icon}</div>
              <div className="ml-4">
                <h4 className="font-medium">{loan.title}</h4>
                <p className="text-gray-500 text-sm">{loan.desc}</p>
              </div>
            </div>
            <button className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-100">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
