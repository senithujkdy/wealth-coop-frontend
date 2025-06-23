import { Home, BarChart, CreditCard, Settings, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { name: "Users", path: "/admin/users", icon: <Users className="w-5 h-5" /> },
    { name: "Loan Applications", path: "/admin/dashboard", icon: <Home className="w-5 h-5" /> },
    { name: "Statistics", path: "/admin/statistics", icon: <BarChart className="w-5 h-5" /> },
    { name: "Predictions", path: "/admin/predictions", icon: <CreditCard className="w-5 h-5" /> },
    { name: "Services", path: "/admin/services", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="w-64 h-screen bg-white p-4">
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