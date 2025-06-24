import React, { useState } from "react";

export default function Safety() {
  const [loginAttempts, setLoginAttempts] = useState(56);
  const [alerts, setAlerts] = useState(["Unusual login from Colombo", "Blocked phishing attempt"]);

  const handleViewAlerts = () => {
    alert("Viewing flagged transactions...");
    // Logic to list flagged transactions/fraud alerts
  };

  const handleUpdateRiskSettings = () => {
    alert("Opening risk settings...");
    // Logic to update risk settings/preferences
  };

  return (
    <div>
      <h4 className="font-bold mb-2">Safety Center</h4>
      <p>🔐 Login Attempts Today: {loginAttempts}</p>
      <p>🚨 Active Alerts:</p>
      <ul className="list-disc list-inside text-sm text-red-600">
        {alerts.map((alert, idx) => (
          <li key={idx}>{alert}</li>
        ))}
      </ul>

      <div className="mt-4 space-x-2">
        <button onClick={handleViewAlerts} className="px-3 py-1 bg-red-500 text-white rounded">
          View Alerts
        </button>
        <button onClick={handleUpdateRiskSettings} className="px-3 py-1 bg-gray-800 text-white rounded">
          Risk Settings
        </button>
      </div>
    </div>
  );
}
