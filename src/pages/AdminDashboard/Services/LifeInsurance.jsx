import React, { useState } from "react";

export default function LifeInsurance() {
  const [claims, setClaims] = useState(12);
  const [policies, setPolicies] = useState(103);
  const [policyholders, setPolicyholders] = useState([]);
  const [showPolicyholders, setShowPolicyholders] = useState(false);
  const [claimInitiated, setClaimInitiated] = useState(false);

  const mockPolicyholders = [
    { name: "abcd", policyId: "P-001", status: "Active" },
    { name: "efgh", policyId: "P-002", status: "Pending" },
    { name: "ijkl", policyId: "P-003", status: "Active" },
  ];

  const handleViewPolicyholders = () => {
    setPolicyholders(mockPolicyholders);
    setShowPolicyholders(true);
  };

  const handleInitiateClaim = () => {
    setClaimInitiated(true);
    setClaims((prev) => prev + 1); // Simulate a new claim being added
  };

  return (
    <div>
      <h4 className="font-bold mb-2">Life Insurance Overview</h4>
      <p>📄 Active Policies: {policies}</p>
      <p>⚠️ Claims This Month: {claims}</p>

      <div className="mt-4 space-x-2">
        <button
          onClick={handleViewPolicyholders}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          View Policyholders
        </button>
        <button
          onClick={handleInitiateClaim}
          className="px-3 py-1 bg-green-500 text-white rounded"
        >
          Initiate Claim
        </button>
      </div>

      {/* Show mock claim initiation message */}
      {claimInitiated && (
        <div className="mt-4 text-green-600 text-sm">
          ✅ New claim initiated successfully.
        </div>
      )}

      {/* Display mock policyholder data */}
      {showPolicyholders && (
        <div className="mt-6">
          <h5 className="font-semibold mb-2">Policyholders</h5>
          <ul className="text-sm list-disc list-inside">
            {policyholders.map((ph, idx) => (
              <li key={idx}>
                <span className="font-medium">{ph.name}</span> —{" "}
                {ph.policyId} ({ph.status})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
