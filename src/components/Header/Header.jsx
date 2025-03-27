import { Bell, Settings } from "lucide-react";

const Header = () => {
  return (
    <div className="flex justify-between items-center bg-white px-6 py-3 shadow-sm">
      <h1 className="text-xl font-bold">Activity Overview</h1>
      <div className="flex items-center space-x-4">
        <Settings size={24} className="text-gray-600 cursor-pointer" />
        <Bell size={24} className="text-gray-600 cursor-pointer" />
        <img 
          src="https://randomuser.me/api/portraits/women/50.jpg" 
          alt="Profile" 
          className="w-10 h-10 rounded-full"
        />
      </div>
    </div>
  );
};

export default Header;
