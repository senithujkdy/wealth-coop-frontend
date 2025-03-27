import { Home, BarChart, CreditCard, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = () => {

  return (
    <div className="w-64 h-screen bg-gray-100 p-4">
      <h2 className="text-xl font-bold text-red-600">Wealth Coop</h2>
      <nav className="mt-4">
        <ul className="space-y-4">
          <li className="flex items-center space-x-3 text-blue-600 font-semibold">
            <Home size={20} /> 
            <Link to="/dashboard" className="">Dashboard</Link>
          </li>
          <li className="flex items-center space-x-3 text-gray-600">
            <BarChart size={20} />
            <Link to="/statistics" className="">Statistics</Link>
          </li>
          <li className="flex items-center space-x-3 text-gray-600">
            <CreditCard size={20} />
            <Link to="/predictions" className="">Predictions</Link>
          </li>
          <li className="flex items-center space-x-3 text-gray-600">
            <Settings size={20} />
            <Link to="/services" className="">Services</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
