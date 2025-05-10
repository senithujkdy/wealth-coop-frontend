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
<div className="bg-gray-50 min-h-screen">
  {/* Full-width header */}
  <Header title={currentTitle} />

  {/* Sidebar + Page content */}
  <div className="flex">
    <Sidebar />
    <div className="flex-1 p-6">
      <Outlet />
    </div>
  </div>
</div>
  );
};

export default AdminDashboard;
