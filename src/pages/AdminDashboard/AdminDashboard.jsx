import Sidebar from "../../components/layout/AdminSidebar/AdminSidebar";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../../components/layout/Header/Header";

const AdminDashboard = () => {
  const location = useLocation();

  // Map route paths to page titles
  const pageTitles = {
    "/admin/dashboard": "Activity Overview",
    "/admin/statistics": "Statistics",
    "/admin/predictions": "Predictions",
    "/admin/services": "Services",
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
