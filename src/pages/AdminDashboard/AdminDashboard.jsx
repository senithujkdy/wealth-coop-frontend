import Sidebar from "../../components/Sidebar/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../../components/Header/Header";

const AdminDashboard = () => {
  const location = useLocation();

  // Map route paths to page titles
  const pageTitles = {
    "/dashboard": "Activity Overview",
    "/statistics": "Statistics",
    "/predictions": "Predictions",
    "/services": "Services",
  };

  const currentTitle = pageTitles[location.pathname] || "Admin Dashboard";

  return (
    <div className="flex size-auto">
      {/* Sidebar is always visible */}
      <Sidebar />

      {/* Page content area */}
      <div className="flex-1 bg-gray-50">
        {/* Pass the title dynamically */}
        <Header title={currentTitle} />

        {/* Dynamic content from child pages */}
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
