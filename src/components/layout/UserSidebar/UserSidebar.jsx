import { Home, User, Briefcase, CreditCard, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", path: "/overview", icon: <Home className="w-5 h-5" /> },
    { name: "Transactions", path: "/transaction", icon: <CreditCard className="w-5 h-5" /> },
    { name: "Accounts", path: "/accounts", icon: <User className="w-5 h-5" /> },
    { name: "Loans", path: "/loans", icon: <Briefcase className="w-5 h-5" /> },
    { name: "Settings", path: "/settings", icon: <Settings className="w-5 h-5" /> },
    ,
  ];

  return (
    <div className="w-64 h-auto bg-gray-100 p-4">
      <h2 className="text-xl font-bold text-red-600 mb-6">Wealth Coop</h2>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition ${
                isActive ? "text-blue-600 font-semibold bg-blue-50 border-l-4 border-blue-500 pl-3" : "pl-4"
              }`
            // Color selected tab
            }
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;