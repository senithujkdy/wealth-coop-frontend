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

export default UserDashboard;


