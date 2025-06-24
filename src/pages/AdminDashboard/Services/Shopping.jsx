import React, { useState } from "react";

export default function Shopping() {
  const [transactions, setTransactions] = useState(874);
  const [popularItem, setPopularItem] = useState("Wireless Headphones");

  const handleToggleOffers = () => {
    alert("Toggling partner offers...");
    // Logic to enable/disable offers
  };

  const handleManagePartners = () => {
    alert("Managing shopping partners...");
    // Logic to view/manage affiliate partners
  };

  return (
    <div>
      <h4 className="font-bold mb-2">Shopping Overview</h4>
      <p>🛒 Total Transactions via Offers: {transactions}</p>
      <p>🔥 Most Popular Item: {popularItem}</p>

      <div className="mt-4 space-x-2">
        <button onClick={handleToggleOffers} className="px-3 py-1 bg-yellow-500 text-white rounded">
          Toggle Offers
        </button>
        <button onClick={handleManagePartners} className="px-3 py-1 bg-purple-600 text-white rounded">
          Manage Partners
        </button>
      </div>
    </div>
  );
}
