import Sidebar from "../../components/layout/UserSidebar/UserSidebar";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../../components/layout/Header/Header";

const UserDashboard = () => {
  const location = useLocation();

  // Map route paths to page titles
  const pageTitles = {
    "/overview": "Overview",
    "/accounts": "Accounts",
    "/transaction": "Transactions",
    "/loans": "Loans",
    "/settings": "Settings",
  };

  const currentTitle = pageTitles[location.pathname] || "Overview";

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

export default UserDashboard;
