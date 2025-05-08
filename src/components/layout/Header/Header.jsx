import { useState, useRef, useEffect } from "react";
import { Bell, Settings, LogOut } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const Header = ({ title }) => {
  const { logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  // Close popup if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex justify-between items-center bg-white px-6 py-3 shadow-sm relative">
      <h1 className="text-xl font-bold">{title}</h1>

      <div className="flex items-center space-x-4">
        <Settings size={24} className="text-gray-600 cursor-pointer" />
        <Bell size={24} className="text-gray-600 cursor-pointer" />

        <div className="relative" ref={dropdownRef}>
          <img
            src="https://randomuser.me/api/portraits/women/50.jpg"
            alt="Profile"
            onClick={() => setIsOpen(!isOpen)}
            className="w-10 h-10 rounded-full cursor-pointer border-2 border-transparent hover:border-blue-500 transition duration-150"
          />

          {isOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-md z-10 border">
              <div className="px-4 py-2 border-b text-sm text-gray-500">{user?.full_name}</div>
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
